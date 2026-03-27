// src/actions/vp/procurement.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdmin, isBoss, isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { createVpNotification } from "@/lib/vendor-portal/notify"
import { emailProcurementOpenForQuotes, emailProcurementSubmitted } from "@/lib/vp-email"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { procurementSchema, ProcurementFormValues } from "@/validations/vp/procurement"

// ── Types ──────────────────────────────────────────────────────

export type VpProcurementRow = {
    id: string
    prNumber: string
    title: string
    description: string | null
    status: string
    categoryName: string | null
    requiredByDate: Date | null
    grandTotal: number
    createdAt: Date
    createdBy: { name: string }
    approvedBy: { name: string } | null
    _count: {
        lineItems: number
        vendorInvites: number
        proformaInvoices: number
    }
}

export type VpProcurementDetail = VpProcurementRow & {
    lineItems: {
        id: string
        itemId: string | null
        itemCode: string | null
        description: string
        qty: number
        estimatedUnitPrice: number
        total: number
    }[]
    vendorInvites: {
        id: string
        status: string
        vendor: {
            id: string
            vendorName: string
            vendorType: string
        }
    }[]
    deliveryAddress: string | null
    billToId: string | null
    billTo: string | null
    billToGstin: string | null
    subtotal: number
    taxRate: number
    taxAmount: number
    rejectionReason: string | null
    submittedAt: Date | null
    approvedAt: Date | null,

    quotes: {
        id: string
        piNumber: string
        status: string
        grandTotal: number
        validityDate: Date | null
        paymentTerms: string | null
        fulfillmentDate: Date | null
        vendor: { id: string; vendorName: string; vendorType: string }
        items: { id: string; description: string; qty: number; unitPrice: number; total: number }[]
    }[]
    invoices: {
        id: string
        invoiceNumber: string | null
        status: string
        totalAmount: number
        vendor: { vendorName: string }
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

async function generatePrNumber(): Promise<string> {
    const now = new Date()
    const yr = now.getFullYear().toString().slice(-2)
    const mo = String(now.getMonth() + 1).padStart(2, "0")
    const count = await prisma.vpProcurement.count()
    return `VP-PR-${yr}${mo}-${String(count + 1).padStart(4, "0")}`
}

const PR_SELECT = {
    id: true,
    prNumber: true,
    title: true,
    description: true,
    status: true,
    grandTotal: true,
    subtotal: true,
    taxRate: true,
    taxAmount: true,
    requiredByDate: true,
    deliveryAddress: true,
    billToId: true,
    billTo: true,
    billToGstin: true,
    rejectionReason: true,
    submittedAt: true,
    approvedAt: true,
    createdAt: true,
    category: { select: { name: true } },
    createdBy: { select: { name: true } },
    approvedBy: { select: { name: true } },
    _count: {
        select: {
            lineItems: true,
            vendorInvites: true,
            proformaInvoices: true,
        },
    },
} as const

function mapRow(r: any): VpProcurementRow {
    return {
        id: r.id,
        prNumber: r.prNumber,
        title: r.title,
        description: r.description,
        status: r.status,
        categoryName: r.category?.name ?? null,
        requiredByDate: r.requiredByDate,
        grandTotal: r.grandTotal,
        createdAt: r.createdAt,
        createdBy: r.createdBy,
        approvedBy: r.approvedBy ?? null,
        _count: r._count,
    }
}

// ── READ list ──────────────────────────────────────────────────

export async function getVpProcurements(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpProcurementRow>>> {
    try {
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.status) where.status = params.status
        if (params.categoryId) where.categoryId = params.categoryId
        if (params.search) where.OR = [
            { title: { contains: params.search } },
            { prNumber: { contains: params.search } },
        ]
        if (params.from) where.createdAt = { ...where.createdAt, gte: new Date(params.from) }
        if (params.to) where.createdAt = { ...where.createdAt, lte: new Date(params.to) }

        const [total, rows] = await Promise.all([
            prisma.vpProcurement.count({ where }),
            prisma.vpProcurement.findMany({
                where, skip, take: per_page,
                orderBy: { createdAt: "desc" },
                select: PR_SELECT,
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
        console.error("[getVpProcurements]", e)
        return { success: false, error: "Failed to fetch procurements" }
    }
}

// ── READ single ────────────────────────────────────────────────

export async function getVpProcurementById(
    id: string,
): Promise<VpActionResult<VpProcurementDetail>> {
    try {
        const session = await getCustomSession()
        const isVendor = session.user.role === "VENDOR"

        const r = await prisma.vpProcurement.findUnique({
            where: { id },
            select: {
                ...PR_SELECT,
                lineItems: {
                    select: {
                        id: true,
                        itemId: true,
                        description: true,
                        qty: true,
                        estimatedUnitPrice: true,
                        total: true,
                        item: { select: { code: true } },
                    },
                },
                vendorInvites: {
                    select: {
                        id: true,
                        status: true,
                        vendorId: true,
                        vendor: {
                            select: {
                                id: true,
                                vendorType: true,
                                existingVendor: { select: { name: true, id: true } },
                            },
                        },
                    },
                },
            },
        })
        if (!r) return { success: false, error: "Procurement not found" }

        // Security check for Vendors
        if (isVendor) {
            const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { vendorId: true } })
            const vpv = await prisma.vpVendor.findFirst({ where: { existingVendorId: user?.vendorId || "" }, select: { id: true } })
            const invited = r.vendorInvites.some(vi => vi.vendorId === vpv?.id)
            if (!invited || r.status === "DRAFT" || r.status === "SUBMITTED") {
                return { success: false, error: "Access denied or procurement not yet approved" }
            }
        }

        const quotes = await prisma.vpProformaInvoice.findMany({
            where: { procurementId: id },
            select: {
                id: true,
                piNumber: true,
                status: true,
                grandTotal: true,
                validityDate: true,
                paymentTerms: true,
                fulfillmentDate: true,
                vendor: {
                    select: {
                        id: true,
                        vendorType: true,
                        existingVendor: { select: { name: true } },
                    },
                },
                items: {
                    select: {
                        id: true,
                        description: true,
                        qty: true,
                        unitPrice: true,
                        total: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        })

        return {
            success: true,
            data: {
                ...mapRow(r),
                deliveryAddress: r.deliveryAddress,
                billToId: r.billToId,
                billTo: r.billTo,
                billToGstin: r.billToGstin,
                subtotal: r.subtotal,
                taxRate: r.taxRate,
                taxAmount: r.taxAmount,
                rejectionReason: r.rejectionReason,
                submittedAt: r.submittedAt,
                approvedAt: r.approvedAt,
                lineItems: r.lineItems.map((li: any) => ({
                    id: li.id,
                    itemId: li.itemId,
                    itemCode: li.item?.code ?? null,
                    description: li.description,
                    qty: li.qty,
                    estimatedUnitPrice: li.estimatedUnitPrice,
                    total: li.total,
                })),
                vendorInvites: r.vendorInvites.map((vi: any) => ({
                    id: vi.id,
                    status: vi.status,
                    vendor: {
                        id: vi.vendor.id,
                        vendorName: vi.vendor.existingVendor.name,
                        vendorType: vi.vendor.vendorType,
                    },
                })),
                quotes: quotes.map((q) => ({
                    id: q.id,
                    piNumber: q.piNumber,
                    status: q.status,
                    grandTotal: q.grandTotal,
                    validityDate: q.validityDate,
                    paymentTerms: q.paymentTerms,
                    fulfillmentDate: q.fulfillmentDate,
                    vendor: {
                        id: q.vendor.id,
                        vendorName: q.vendor.existingVendor.name,
                        vendorType: q.vendor.vendorType,
                    },
                    items: q.items,
                })),
                invoices: await prisma.vpInvoice.findMany({
                    where: { piId: { in: quotes.map(q => q.id) } },
                    select: {
                        id: true,
                        invoiceNumber: true,
                        status: true,
                        totalAmount: true,
                        vendor: { select: { existingVendor: { select: { name: true } } } },
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
                    orderBy: { createdAt: "desc" }
                }).then(list => list.map(inv => ({
                    ...inv,
                    vendor: { vendorName: inv.vendor.existingVendor.name }
                })))
            },
        }
    } catch (e) {
        console.error("[getVpProcurementById]", e)
        return { success: false, error: "Failed to fetch procurement" }
    }
}

// ── CREATE ─────────────────────────────────────────────────────

export async function createVpProcurement(
    raw: ProcurementFormValues,
): Promise<VpActionResult<{ id: string; prNumber: string }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const parsed = procurementSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const d = parsed.data
    const subtotal = d.items.reduce((s, i) => s + i.qty * i.estimatedUnitPrice, 0)
    const taxAmount = (subtotal * d.taxRate) / 100
    const grandTotal = subtotal + taxAmount

    try {
        const prNumber = await generatePrNumber()

        const pr = await prisma.vpProcurement.create({
            data: {
                prNumber,
                title: d.title,
                description: d.description || null,
                categoryId: d.categoryId || null,
                requiredByDate: d.requiredByDate ? new Date(d.requiredByDate) : null,
                deliveryAddress: d.deliveryAddress || null,
                billToId: d.billToId || null,
                billTo: d.billTo || null,
                billToGstin: d.billToGstin || null,
                subtotal,
                taxRate: d.taxRate,
                taxAmount,
                grandTotal,
                createdById: session.user.id,
                status: "DRAFT",
                lineItems: {
                    create: d.items.map((item) => ({
                        itemId: item.itemId || null,
                        description: item.description,
                        qty: item.qty,
                        estimatedUnitPrice: item.estimatedUnitPrice,
                        total: item.qty * item.estimatedUnitPrice,
                    })),
                },
                vendorInvites: {
                    create: d.vendorIds.map((vendorId) => ({
                        vendorId,
                        status: "INVITED",
                    })),
                },
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpProcurement",
            entityId: pr.id,
            description: `Created procurement ${prNumber}: ${d.title}`,
        })

        return { success: true, data: { id: pr.id, prNumber } }
    } catch (e) {
        console.error("[createVpProcurement]", e)
        return { success: false, error: "Failed to create procurement" }
    }
}

// ── SUBMIT (DRAFT → SUBMITTED) — ADMIN ────────────────────────

export async function submitVpProcurement(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const pr = await prisma.vpProcurement.findUnique({
        where: { id }, select: { status: true, prNumber: true },
    })
    if (!pr) return { success: false, error: "Procurement not found" }
    if (pr.status !== "DRAFT")
        return { success: false, error: "Only DRAFT procurements can be submitted" }

    await prisma.vpProcurement.update({
        where: { id },
        data: { status: "SUBMITTED", submittedAt: new Date() },
    })

    const bossIds = await prisma.user.findMany({
        where: { role: "BOSS" }, select: { id: true },
    }).then((u) => u.map((x) => x.id))

    await createVpNotification({
        userIds: bossIds,
        type: "PO_SUBMITTED",
        message: `Procurement Request ${pr.prNumber} has been submitted for your approval.`,
        refDocType: "VpProcurement",
        refDocId: id,
    })
    await logVpAudit({
        userId: session.user.id,
        action: "UPDATE",
        entityType: "VpProcurement",
        entityId: id,
        description: `Submitted procurement ${pr.prNumber} for approval`,
    })
    await emailProcurementSubmitted(id)

    return { success: true, data: null }
}

// ── APPROVE (SUBMITTED → APPROVED → OPEN_FOR_QUOTES) — BOSS ───

export async function approveVpProcurement(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isBoss(session.user.role))
        return { success: false, error: "Only management can approve procurement requests" }

    const pr = await prisma.vpProcurement.findUnique({
        where: { id },
        select: {
            status: true,
            prNumber: true,
            createdById: true,
            vendorInvites: {
                select: {
                    vendor: {
                        select: {
                            existingVendor: { select: { users: { select: { id: true, email: true } } } },
                        },
                    },
                },
            },
        },
    })
    if (!pr) return { success: false, error: "Procurement not found" }
    if (pr.status !== "SUBMITTED")
        return { success: false, error: "Procurement must be SUBMITTED to approve" }

    await prisma.vpProcurement.update({
        where: { id },
        data: {
            status: "OPEN_FOR_QUOTES",
            approvedAt: new Date(),
            approvedById: session.user.id,
        },
    })

    // Notify admin
    await createVpNotification({
        userIds: [pr.createdById],
        type: "PO_APPROVED",
        message: `Procurement ${pr.prNumber} approved. Vendors have been notified to submit quotes.`,
        refDocType: "VpProcurement",
        refDocId: id,
    })

    // Notify all invited vendors
    const vendorUserIds = pr.vendorInvites.flatMap(
        (vi) => vi.vendor.existingVendor.users.map((u) => u.id),
    )
    const vendorEmails = pr.vendorInvites.flatMap(
        (vi) => vi.vendor.existingVendor.users.map((u) => u.email).filter(Boolean),
    )
    if (vendorUserIds.length > 0) {
        await createVpNotification({
            userIds: vendorUserIds,
            type: "PO_SENT_TO_VENDOR",
            message: `You have been invited to submit a quote for Procurement Request ${pr.prNumber}. Please submit your Proforma Invoice.`,
            refDocType: "VpProcurement",
            refDocId: id,
        })
    }
    await logVpAudit({
        userId: session.user.id,
        action: "UPDATE",
        entityType: "VpProcurement",
        entityId: id,
        description: `Approved procurement ${pr.prNumber} and opened for quotes`,
    })
    await emailProcurementOpenForQuotes(id, vendorEmails)

    return { success: true, data: null }
}

// ── REJECT — BOSS ──────────────────────────────────────────────

export async function rejectVpProcurement(
    id: string,
    reason: string,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isBoss(session.user.role))
        return { success: false, error: "Only management can reject procurement requests" }

    if (!reason?.trim()) return { success: false, error: "Rejection reason is required" }

    const pr = await prisma.vpProcurement.findUnique({
        where: { id }, select: { status: true, prNumber: true, createdById: true },
    })
    if (!pr) return { success: false, error: "Procurement not found" }

    await prisma.vpProcurement.update({
        where: { id },
        data: { status: "CANCELLED", rejectionReason: reason },
    })

    await createVpNotification({
        userIds: [pr.createdById],
        type: "PO_REJECTED",
        message: `Procurement ${pr.prNumber} was rejected. Reason: ${reason}`,
        refDocType: "VpProcurement",
        refDocId: id,
    })

    return { success: true, data: null }
}

// ── SELECT QUOTE (mark one vendor's PI as selected) — ADMIN ────

export async function selectProcurementQuote(
    procurementId: string,
    vendorId: string,
    piId: string,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    await prisma.$transaction([
        // Mark selected vendor
        prisma.vpProcurementVendor.updateMany({
            where: { procurementId, vendorId },
            data: { status: "SELECTED", respondedAt: new Date() },
        }),
        // Mark others as not selected
        prisma.vpProcurementVendor.updateMany({
            where: { procurementId, vendorId: { not: vendorId } },
            data: { status: "DECLINED" },
        }),
        // Close procurement
        prisma.vpProcurement.update({
            where: { id: procurementId },
            data: { status: "QUOTE_SELECTED", closedAt: new Date() },
        }),
    ])

    return { success: true, data: null }
}

// ── Fetch open procurements for vendor to quote ────────────────

export async function getOpenProcurementsForVendor(): Promise<VpActionResult<{
    id: string
    prNumber: string
    title: string
    requiredByDate: Date | null
    lineItems: { id: string; description: string; qty: number }[]
}[]>
> {
    const session = await getCustomSession()
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }, select: { vendorId: true },
    })
    if (!user?.vendorId) return { success: true, data: [] }

    const vpv = await prisma.vpVendor.findFirst({
        where: { existingVendorId: user.vendorId }, select: { id: true },
    })
    if (!vpv) return { success: true, data: [] }

    try {
        const prs = await prisma.vpProcurement.findMany({
            where: {
                status: "OPEN_FOR_QUOTES",
                vendorInvites: { some: { vendorId: vpv.id, status: "INVITED" } },
            },
            select: {
                id: true,
                prNumber: true,
                title: true,
                requiredByDate: true,
                lineItems: { select: { id: true, description: true, qty: true } },
            },
        })
        return { success: true, data: prs }
    } catch (e) {
        return { success: false, error: "Failed to fetch open procurements" }
    }
}
