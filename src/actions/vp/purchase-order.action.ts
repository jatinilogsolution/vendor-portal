// src/actions/vp/purchase-order.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdmin, isAdminOrBoss, isBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { createVpNotification, getInternalUserIds } from "@/lib/vendor-portal/notify"
import {
    emailPoApproved,
    emailPoRejected,
    emailPoSentToVendor,
    emailPoSubmitted,
} from "@/lib/vp-email"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { purchaseOrderSchema, PurchaseOrderValues } from "@/validations/vp/purchase-order"

// ── Types ──────────────────────────────────────────────────────

export type VpPoLineItem = {
    id: string
    itemId: string | null
    itemCode: string | null
    itemName: string | null
    description: string
    qty: number
    unitPrice: number
    total: number
}

export type VpPoRow = {
    id: string
    poNumber: string
    status: string
    subtotal: number
    taxRate: number
    taxAmount: number
    grandTotal: number
    notes: string | null
    deliveryDate: Date | null
    deliveryAddress: string | null
    billToId: string | null
    billTo: string | null
    billToGstin: string | null
    createdAt: Date
    categoryName: string | null
    vendor: {
        id: string
        vendorName: string
        vendorType: string
    }
    createdBy: { id: string; name: string }
    approvedBy: { id: string; name: string } | null
    submittedAt: Date | null
    approvedAt: Date | null
    sentToVendorAt: Date | null
    acknowledgedAt: Date | null
    rejectedAt: Date | null
    rejectionReason: string | null
}

export type VpPoDetail = VpPoRow & {
    items: VpPoLineItem[]
    deliveries: {
        id: string
        status: string
        deliveryDate: Date | null
        _count: { items: number }
    }[]
    invoices: {
        id: string
        invoiceNumber: string | null
        status: string
        totalAmount: number
        payments: {
            id: string
            amount: number
            status: string
            paymentMode: string | null
            transactionRef: string | null
            paymentDate: Date | null
            proofUrl: string | null
        }[]
    }[]
}

// ── Number generator ───────────────────────────────────────────

async function generatePoNumber(): Promise<string> {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const count = await prisma.vpPurchaseOrder.count()
    const seq = String(count + 1).padStart(4, "0")
    return `VP-PO-${year}${month}-${seq}`
}

// ── Compute totals ─────────────────────────────────────────────

function computeTotals(items: { qty: number; unitPrice: number }[], taxRate: number) {
    const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
    const taxAmount = (subtotal * taxRate) / 100
    const grandTotal = subtotal + taxAmount
    return { subtotal, taxAmount, grandTotal }
}

// ── Row mapper ─────────────────────────────────────────────────

function mapRow(r: any): VpPoRow {
    return {
        id: r.id,
        poNumber: r.poNumber,
        status: r.status,
        subtotal: r.subtotal,
        taxRate: r.taxRate,
        taxAmount: r.taxAmount,
        grandTotal: r.grandTotal,
        notes: r.notes,
        deliveryDate: r.deliveryDate,
        deliveryAddress: r.deliveryAddress,
        billToId: r.billToId,
        billTo: r.billTo,
        billToGstin: r.billToGstin,
        createdAt: r.createdAt,
        categoryName: r.category?.name ?? null,
        vendor: {
            id: r.vendor.id,
            vendorName: r.vendor.existingVendor.name,
            vendorType: r.vendor.vendorType,
        },
        createdBy: { id: r.createdBy.id, name: r.createdBy.name },
        approvedBy: r.approvedBy ? { id: r.approvedBy.id, name: r.approvedBy.name } : null,
        submittedAt: r.submittedAt,
        approvedAt: r.approvedAt,
        sentToVendorAt: r.sentToVendorAt,
        acknowledgedAt: r.acknowledgedAt,
        rejectedAt: r.rejectedAt,
        rejectionReason: r.rejectionReason,
    }
}

const PO_SELECT = {
    id: true,
    poNumber: true,
    status: true,
    subtotal: true,
    taxRate: true,
    taxAmount: true,
    grandTotal: true,
    notes: true,
    deliveryDate: true,
    deliveryAddress: true,
    billToId: true,
    billTo: true,
    billToGstin: true,
    createdAt: true,
    submittedAt: true,
    approvedAt: true,
    sentToVendorAt: true,
    acknowledgedAt: true,
    rejectedAt: true,
    rejectionReason: true,
    category: { select: { name: true } },
    vendor: { select: { id: true, vendorType: true, existingVendor: { select: { name: true } } } },
    createdBy: { select: { id: true, name: true } },
    approvedBy: { select: { id: true, name: true } },
} as const

// ── READ list ──────────────────────────────────────────────────

export async function getVpPurchaseOrders(
    params: VpListParams & { vendorId?: string } = {},
): Promise<VpActionResult<VpListResult<VpPoRow>>> {
    try {
        const session = await getCustomSession()
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.status) where.status = params.status
        if (params.vendorId) where.vendorId = params.vendorId
        if (params.from) where.createdAt = { ...where.createdAt, gte: new Date(params.from) }
        if (params.to) where.createdAt = { ...where.createdAt, lte: new Date(params.to) }
        if (params.search) where.poNumber = { contains: params.search }

        // VENDOR can only see their own POs and ONLY those sent/approved
        if (session.user.role === "VENDOR") {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id }, select: { vendorId: true },
            })
            if (user?.vendorId) {
                const vpv = await prisma.vpVendor.findFirst({
                    where: { existingVendorId: user.vendorId }, select: { id: true },
                })
                if (vpv) {
                    where.vendorId = vpv.id
                    // Only show status >= SENT_TO_VENDOR for vendors
                    if (!where.status) {
                        where.status = {
                            in: ["SENT_TO_VENDOR", "ACKNOWLEDGED", "COMPLETED", "CANCELLED"] as any,
                        }
                    }
                } else {
                    return { success: true, data: { data: [], meta: { page, per_page, total: 0, total_pages: 0 } } }
                }
            }
        }

        const [total, rows] = await Promise.all([
            prisma.vpPurchaseOrder.count({ where }),
            prisma.vpPurchaseOrder.findMany({
                where, skip, take: per_page,
                orderBy: { createdAt: "desc" },
                select: PO_SELECT,
            }),
        ])

        return {
            success: true,
            data: {
                data: rows.map(mapRow),
                meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
            },
        }
    } catch (e) {
        console.error("[getVpPurchaseOrders]", e)
        return { success: false, error: "Failed to fetch purchase orders" }
    }
}

// ── READ single ────────────────────────────────────────────────

export async function getVpPurchaseOrderById(
    id: string,
): Promise<VpActionResult<VpPoDetail>> {
    try {
        const session = await getCustomSession()
        const isVendor = session.user.role === "VENDOR"

        const r = await prisma.vpPurchaseOrder.findUnique({
            where: { id },
            select: {
                ...PO_SELECT,
                items: {
                    select: {
                        id: true,
                        description: true,
                        qty: true,
                        unitPrice: true,
                        total: true,
                        itemId: true,
                        item: { select: { code: true, name: true } },
                    },
                },
                deliveries: {
                    select: {
                        id: true,
                        status: true,
                        deliveryDate: true,
                        _count: { select: { items: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
                invoices: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        status: true,
                        totalAmount: true,
                        payments: {
                            select: {
                                id: true,
                                amount: true,
                                status: true,
                                paymentMode: true,
                                transactionRef: true,
                                paymentDate: true,
                                proofUrl: true,
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" },
                }
            },
        })
        if (!r) return { success: false, error: "Purchase order not found" }

        // Security check for Vendors
        if (isVendor) {
            const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { vendorId: true } })
            const vpv = await prisma.vpVendor.findFirst({ where: { existingVendorId: user?.vendorId || "" }, select: { id: true } })
            
            if (r.vendor.id !== vpv?.id || ["DRAFT", "SUBMITTED", "APPROVED"].includes(r.status)) {
                return { success: false, error: "Access denied or PO not yet sent to you" }
            }
        }

        return {
            success: true,
            data: {
                ...mapRow(r),
                items: r.items.map((i) => ({
                    id: i.id,
                    itemId: i.itemId,
                    itemCode: i.item?.code ?? null,
                    itemName: i.item?.name ?? null,
                    description: i.description,
                    qty: i.qty,
                    unitPrice: i.unitPrice,
                    total: i.total,
                })),
                deliveries: r.deliveries,
                invoices: r.invoices,
            },
        }
    } catch (e) {
        console.error("[getVpPurchaseOrderById]", e)
        return { success: false, error: "Failed to fetch purchase order" }
    }
}

// ── CREATE ─────────────────────────────────────────────────────

export async function createVpPurchaseOrder(
    raw: PurchaseOrderValues,
): Promise<VpActionResult<{ id: string; poNumber: string }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const parsed = purchaseOrderSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const d = parsed.data
    const { subtotal, taxAmount, grandTotal } = computeTotals(d.items, d.taxRate)

    try {
        const poNumber = await generatePoNumber()

        const po = await prisma.vpPurchaseOrder.create({
            data: {
                poNumber,
                status: "DRAFT",
                vendorId: d.vendorId,
                categoryId: d.categoryId || null,
                notes: d.notes || null,
                deliveryDate: d.deliveryDate ? new Date(d.deliveryDate) : null,
                deliveryAddress: d.deliveryAddress || null,
                billToId: d.billToId || null,
                billTo: d.billTo || null,
                billToGstin: d.billToGstin || null,
                subtotal,
                taxRate: d.taxRate,
                taxAmount,
                grandTotal,
                createdById: session.user.id,
                items: {
                    create: d.items.map((item) => ({
                        itemId: item.itemId || null,
                        description: item.description,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        total: item.qty * item.unitPrice,
                    })),
                },
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpPurchaseOrder",
            entityId: po.id,
            description: `Created PO ${poNumber}`,
        })

        return { success: true, data: { id: po.id, poNumber } }
    } catch (e) {
        console.error("[createVpPurchaseOrder]", e)
        return { success: false, error: "Failed to create purchase order" }
    }
}

// ── UPDATE (draft only) ────────────────────────────────────────

export async function updateVpPurchaseOrder(
    id: string,
    raw: PurchaseOrderValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const parsed = purchaseOrderSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id }, select: { status: true },
    })
    if (!po) return { success: false, error: "Purchase order not found" }
    if (po.status !== "DRAFT")
        return { success: false, error: "Only DRAFT purchase orders can be edited" }

    const d = parsed.data
    const { subtotal, taxAmount, grandTotal } = computeTotals(d.items, d.taxRate)

    try {
        // Delete old items, recreate
        await prisma.vpPoLineItem.deleteMany({ where: { poId: id } })
        await prisma.vpPurchaseOrder.update({
            where: { id },
            data: {
                vendorId: d.vendorId,
                categoryId: d.categoryId || null,
                notes: d.notes || null,
                deliveryDate: d.deliveryDate ? new Date(d.deliveryDate) : null,
                deliveryAddress: d.deliveryAddress || null,
                billToId: d.billToId || null,
                billTo: d.billTo || null,
                billToGstin: d.billToGstin || null,
                subtotal,
                taxRate: d.taxRate,
                taxAmount,
                grandTotal,
                items: {
                    create: d.items.map((item) => ({
                        itemId: item.itemId || null,
                        description: item.description,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        total: item.qty * item.unitPrice,
                    })),
                },
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpPurchaseOrder",
            entityId: id,
            description: "Updated PO (DRAFT)",
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[updateVpPurchaseOrder]", e)
        return { success: false, error: "Failed to update purchase order" }
    }
}

// ── SUBMIT (DRAFT → SUBMITTED) — ADMIN ────────────────────────

export async function submitVpPurchaseOrder(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id }, select: { status: true, poNumber: true },
    })
    if (!po) return { success: false, error: "PO not found" }
    if (po.status !== "DRAFT")
        return { success: false, error: `Cannot submit a PO in ${po.status} status` }

    await prisma.vpPurchaseOrder.update({
        where: { id },
        data: { status: "SUBMITTED", submittedAt: new Date() },
    })

    // Notify BOSS
    const bossIds = await prisma.user.findMany({
        where: { role: "BOSS" },
        select: { id: true },
    }).then((u) => u.map((x) => x.id))

    await createVpNotification({
        userIds: bossIds,
        type: "PO_SUBMITTED",
        message: `Purchase Order ${po.poNumber} has been submitted for approval.`,
        refDocType: "VpPurchaseOrder",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpPurchaseOrder", entityId: id,
        description: `Submitted PO ${po.poNumber} for approval`,
    })
    await emailPoSubmitted(id)

    return { success: true, data: null }
}

// ── APPROVE (SUBMITTED → APPROVED) — BOSS ─────────────────────

export async function approveVpPurchaseOrder(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id },
        select: { status: true, poNumber: true, createdById: true },
    })
    if (!po) return { success: false, error: "PO not found" }
    if (po.status !== "SUBMITTED")
        return { success: false, error: `Cannot approve a PO in ${po.status} status` }

    await prisma.vpPurchaseOrder.update({
        where: { id },
        data: { status: "APPROVED", approvedAt: new Date(), approvedById: session.user.id },
    })

    // Notify the admin who created it
    await createVpNotification({
        userIds: [po.createdById],
        type: "PO_APPROVED",
        message: `Purchase Order ${po.poNumber} has been approved. You can now send it to the vendor.`,
        refDocType: "VpPurchaseOrder",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpPurchaseOrder", entityId: id,
        description: `Approved PO ${po.poNumber}`,
    })
    await emailPoApproved(id)

    return { success: true, data: null }
}

// ── REJECT — BOSS ──────────────────────────────────────────────

export async function rejectVpPurchaseOrder(
    id: string,
    reason: string,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    if (!reason?.trim()) return { success: false, error: "Rejection reason is required" }

    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id },
        select: { status: true, poNumber: true, createdById: true },
    })
    if (!po) return { success: false, error: "PO not found" }
    if (!["SUBMITTED"].includes(po.status))
        return { success: false, error: `Cannot reject a PO in ${po.status} status` }

    await prisma.vpPurchaseOrder.update({
        where: { id },
        data: { status: "REJECTED", rejectedAt: new Date(), rejectionReason: reason },
    })

    await createVpNotification({
        userIds: [po.createdById],
        type: "PO_REJECTED",
        message: `Purchase Order ${po.poNumber} was rejected. Reason: ${reason}`,
        refDocType: "VpPurchaseOrder",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpPurchaseOrder", entityId: id,
        description: `Rejected PO ${po.poNumber}: ${reason}`,
    })
    await emailPoRejected(id, reason)

    return { success: true, data: null }
}

// ── SEND TO VENDOR (APPROVED → SENT_TO_VENDOR) — ADMIN ────────

export async function sendVpPoToVendor(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can send POs to vendors" }

    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id },
        select: { status: true, poNumber: true, vendorId: true },
    })
    if (!po) return { success: false, error: "PO not found" }
    if (po.status !== "APPROVED")
        return { success: false, error: "PO must be approved before sending to vendor" }

    await prisma.vpPurchaseOrder.update({
        where: { id },
        data: { status: "SENT_TO_VENDOR", sentToVendorAt: new Date() },
    })

    // Notify all VENDOR users linked to this vpVendor
    const vendorUsers = await prisma.user.findMany({
        where: {
            role: "VENDOR",
            Vendor: { vpVendors: { some: { id: po.vendorId } } },
        },
        select: { id: true },
    })

    if (vendorUsers.length > 0) {
        await createVpNotification({
            userIds: vendorUsers.map((u) => u.id),
            type: "PO_SENT_TO_VENDOR",
            message: `A new Purchase Order ${po.poNumber} has been sent to you. Please review and acknowledge.`,
            refDocType: "VpPurchaseOrder",
            refDocId: id,
        })
    }

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpPurchaseOrder", entityId: id,
        description: `Sent PO ${po.poNumber} to vendor`,
    })
    await emailPoSentToVendor(id)

    return { success: true, data: null }
}

// ── ACKNOWLEDGE (SENT_TO_VENDOR → ACKNOWLEDGED) — VENDOR ──────

export async function acknowledgeVpPo(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can acknowledge purchase orders" }

    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id },
        select: { status: true, poNumber: true, createdById: true },
    })
    if (!po) return { success: false, error: "PO not found" }
    if (po.status !== "SENT_TO_VENDOR")
        return { success: false, error: "This PO is not awaiting acknowledgement" }

    await prisma.vpPurchaseOrder.update({
        where: { id },
        data: { status: "ACKNOWLEDGED", acknowledgedAt: new Date() },
    })

    await createVpNotification({
        userIds: [po.createdById],
        type: "PO_ACKNOWLEDGED",
        message: `Purchase Order ${po.poNumber} has been acknowledged by the vendor.`,
        refDocType: "VpPurchaseOrder",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpPurchaseOrder", entityId: id,
        description: `Vendor acknowledged PO ${po.poNumber}`,
    })

    return { success: true, data: null }
}

// ── DELETE (DRAFT only) — ADMIN ───────────────────────────────

export async function deleteVpPurchaseOrder(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can delete purchase orders" }

    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id }, select: { status: true, poNumber: true },
    })
    if (!po) return { success: false, error: "PO not found" }
    if (po.status !== "DRAFT")
        return { success: false, error: "Only DRAFT purchase orders can be deleted" }

    await prisma.vpPurchaseOrder.delete({ where: { id } })

    await logVpAudit({
        userId: session.user.id, action: "DELETE",
        entityType: "VpPurchaseOrder", entityId: id,
        description: `Deleted PO ${po.poNumber}`,
    })

    return { success: true, data: null }
}
