// src/actions/vp/invoice.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdmin, isAdminOrBoss, isBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { createVpNotification } from "@/lib/vendor-portal/notify"
import {
    emailInvoiceApproved,
    emailInvoiceRejected,
    emailInvoiceSubmitted,
} from "@/lib/vp-email"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { vpInvoiceSchema, VpInvoiceFormValues } from "@/validations/vp/invoice"
import { bumpRecurringSchedule } from "./recurring.action"

// ── Types ──────────────────────────────────────────────────────

export type VpInvoiceLineItemRow = {
    id: string
    description: string
    qty: number
    unitPrice: number
    tax: number
    total: number
}

export type VpInvoiceDocumentRow = {
    id: string
    filePath: string
    uploadedAt: Date
    uploadedBy: { name: string } | null
}

export type VpInvoiceRow = {
    id: string
    invoiceNumber: string | null
    status: string
    type: string
    billType: string
    subtotal: number
    taxRate: number
    taxAmount: number
    totalAmount: number
    notes: string | null
    billToId: string | null
    billTo: string | null
    billToGstin: string | null
    recurringScheduleId: string | null
    createdAt: Date
    submittedAt: Date | null
    approvedAt: Date | null
    rejectedAt: Date | null
    vendor: {
        id: string
        vendorName: string
        vendorType: string
        billingType: string | null
        recurringCycle: string | null
    }
    poId: string | null
    poNumber: string | null
    piId: string | null
    piNumber: string | null
    createdBy: { id: string; name: string }
    reviewedBy: { id: string; name: string } | null
}

export type VpInvoiceDetail = VpInvoiceRow & {
    items: VpInvoiceLineItemRow[]
    documents: VpInvoiceDocumentRow[]
    payments: {
        id: string
        amount: number
        paymentMode: string | null
        transactionRef: string | null
        paymentDate: Date | null
        status: string
        proofUrl: string | null
        initiatedBy: { name: string } | null
    }[]
    timeline: {
        id: string
        date: Date
        actor: string
        fromStatus?: string | null
        toStatus: string | null
        notes?: string | null
    }[]
}

// ── Shared select ──────────────────────────────────────────────

const INVOICE_SELECT = {
    id: true,
    invoiceNumber: true,
    status: true,
    type: true,
    billType: true,
    subtotal: true,
    taxRate: true,
    taxAmount: true,
    totalAmount: true,
    notes: true,
    billToId: true,
    billTo: true,
    billToGstin: true,
    recurringScheduleId: true,
    createdAt: true,
    submittedAt: true,
    approvedAt: true,
    rejectedAt: true,
    poId: true,
    piId: true,
    vendor: {
        select: {
            id: true,
            vendorType: true,
            billingType: true,
            recurringCycle: true,
            existingVendor: { select: { name: true } },
        },
    },
    purchaseOrder: { select: { poNumber: true } },
    proformaInvoice: { select: { piNumber: true } },
    createdBy: { select: { id: true, name: true } },
    reviewedBy: { select: { id: true, name: true } },
} as const

function mapRow(r: any): VpInvoiceRow {
    return {
        id: r.id,
        invoiceNumber: r.invoiceNumber,
        status: r.status,
        type: r.type,
        billType: r.billType,
        subtotal: r.subtotal,
        taxRate: r.taxRate,
        taxAmount: r.taxAmount,
        totalAmount: r.totalAmount,
        notes: r.notes,
        billToId: r.billToId,
        billTo: r.billTo,
        billToGstin: r.billToGstin,
        recurringScheduleId: r.recurringScheduleId,
        createdAt: r.createdAt,
        submittedAt: r.submittedAt,
        approvedAt: r.approvedAt,
        rejectedAt: r.rejectedAt,
        poId: r.poId,
        poNumber: r.purchaseOrder?.poNumber ?? null,
        piId: r.piId,
        piNumber: r.proformaInvoice?.piNumber ?? null,
        vendor: {
            id: r.vendor.id,
            vendorName: r.vendor.existingVendor.name,
            vendorType: r.vendor.vendorType,
            billingType: r.vendor.billingType,
            recurringCycle: r.vendor.recurringCycle,
        },
        createdBy: { id: r.createdBy.id, name: r.createdBy.name },
        reviewedBy: r.reviewedBy
            ? { id: r.reviewedBy.id, name: r.reviewedBy.name }
            : null,
    }
}

// ── Number generator ───────────────────────────────────────────

async function generateInvoiceRef(): Promise<string> {
    const now = new Date()
    const yr = now.getFullYear().toString().slice(-2)
    const mo = String(now.getMonth() + 1).padStart(2, "0")
    const count = await prisma.vpInvoice.count()
    return `VP-INV-${yr}${mo}-${String(count + 1).padStart(5, "0")}`
}

// ── Resolve vendor from session ────────────────────────────────

async function getVpVendorIdForSession(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId }, select: { vendorId: true },
    })
    if (!user?.vendorId) return null
    const vpv = await prisma.vpVendor.findFirst({
        where: { existingVendorId: user.vendorId }, select: { id: true },
    })
    return vpv?.id ?? null
}

// ── READ list ──────────────────────────────────────────────────

export async function getVpInvoices(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpInvoiceRow>>> {
    try {
        const session = await getCustomSession()
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.status) where.status = params.status
        if (params.vendorId) where.vendorId = params.vendorId
        if (params.type) where.type = params.type
        if (params.search) where.invoiceNumber = { contains: params.search }
        if (params.from) where.createdAt = { ...where.createdAt, gte: new Date(params.from) }
        if (params.to) where.createdAt = { ...where.createdAt, lte: new Date(params.to) }

        // VENDOR scoping
        if (session.user.role === "VENDOR") {
            const vpvId = await getVpVendorIdForSession(session.user.id)
            if (vpvId) where.vendorId = vpvId
            else return {
                success: true,
                data: { data: [], meta: { page, per_page, total: 0, total_pages: 0 } },
            }
        }

        const [total, rows] = await Promise.all([
            prisma.vpInvoice.count({ where }),
            prisma.vpInvoice.findMany({
                where, skip, take: per_page,
                orderBy: { createdAt: "desc" },
                select: INVOICE_SELECT,
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
        console.error("[getVpInvoices]", e)
        return { success: false, error: "Failed to fetch invoices" }
    }
}

// ── READ single ────────────────────────────────────────────────

export async function getVpInvoiceById(
    id: string,
): Promise<VpActionResult<VpInvoiceDetail>> {
    try {
        const r = await prisma.vpInvoice.findUnique({
            where: { id },
            select: {
                ...INVOICE_SELECT,
                lineItems: {
                    select: {
                        id: true, description: true,
                        qty: true, unitPrice: true, tax: true, total: true,
                    },
                },
                documents: {
                    select: {
                        id: true,
                        filePath: true,
                        uploadedAt: true,
                        uploadedBy: { select: { name: true } },
                    },
                    orderBy: { uploadedAt: "desc" },
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        paymentMode: true,
                        transactionRef: true,
                        paymentDate: true,
                        status: true,
                        proofUrl: true,
                        initiatedBy: { select: { name: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        })
        if (!r) return { success: false, error: "Invoice not found" }
        const logs = await prisma.log.findMany({
            where: { model: "VpInvoice", recordId: id },
            select: {
                id: true,
                createdAt: true,
                description: true,
                newData: true,
                user: { select: { name: true } },
            },
            orderBy: { createdAt: "asc" },
        })

        const timeline = logs.map((l) => {
            let toStatus: string | null = null
            if (l.newData) {
                try {
                    const parsed = JSON.parse(l.newData as string)
                    toStatus = parsed?.status || null
                } catch {
                    toStatus = null
                }
            }
            return {
                id: l.id,
                date: l.createdAt,
                actor: l.user?.name ?? "System",
                toStatus,
                notes: l.description ?? null,
            }
        })

        return {
            success: true,
            data: {
                ...mapRow(r),
                items: r.lineItems,
                documents: r.documents,
                payments: r.payments,
                timeline,
            },
        }
    } catch (e) {
        console.error("[getVpInvoiceById]", e)
        return { success: false, error: "Failed to fetch invoice" }
    }
}

// ── CREATE (VENDOR) ────────────────────────────────────────────

export async function createVpInvoice(
    raw: VpInvoiceFormValues,
): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can create invoices" }

    const parsed = vpInvoiceSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const d = parsed.data
    const vpvId = await getVpVendorIdForSession(session.user.id)
    if (!vpvId) return { success: false, error: "Your account is not linked to a vendor. Contact admin." }

    const subtotal = d.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
    const taxAmount = (subtotal * d.taxRate) / 100
    const totalAmount = subtotal + taxAmount

    try {


        const inv = await prisma.vpInvoice.create({
            data: {
                invoiceNumber: d.invoiceNumber,
                status: "DRAFT",
                type: d.type,
                billType: d.billType,
                vendorId: vpvId,
                poId: d.poId || null,
                // No piId — vendors don't link invoices to PI
                billToId: d.billToId || null,
                billTo: d.billTo || null,
                billToGstin: d.billToGstin || null,
                notes: d.notes || null,
                recurringScheduleId: d.recurringScheduleId || null,
                subtotal,
                taxRate: d.taxRate,
                taxAmount,
                totalAmount,
                createdById: session.user.id,
                lineItems: {
                    create: d.items.map((item) => ({
                        description: item.description,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        tax: item.tax,
                        total: item.qty * item.unitPrice,
                    })),
                },
            },
        })
        if (d.recurringScheduleId) {
            await bumpRecurringSchedule(d.recurringScheduleId, inv.id)
        }

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpInvoice",
            entityId: inv.id,
            newData: { status: "DRAFT" },
            description: `Vendor created invoice ${d.invoiceNumber}`,
        })

        return { success: true, data: { id: inv.id } }
    } catch (e) {
        console.error("[createVpInvoice]", e)
        return { success: false, error: "Failed to create invoice" }
    }
}

// ── UPDATE (DRAFT only — VENDOR) ───────────────────────────────

export async function updateVpInvoice(
    id: string,
    raw: VpInvoiceFormValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can update invoices" }

    const parsed = vpInvoiceSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const inv = await prisma.vpInvoice.findUnique({
        where: { id },
        select: { status: true, createdById: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }
    if (inv.status !== "DRAFT") return { success: false, error: "Only DRAFT invoices can be edited" }
    if (inv.createdById !== session.user.id)
        return { success: false, error: "You can only edit your own invoices" }

    const d = parsed.data
    const subtotal = d.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
    const taxAmount = (subtotal * d.taxRate) / 100
    const totalAmount = subtotal + taxAmount

    try {
        await prisma.vpInvoiceLineItem.deleteMany({ where: { invoiceId: id } })
        await prisma.vpInvoice.update({
            where: { id },
            data: {
                invoiceNumber: d.invoiceNumber,
                type: d.type,
                billType: d.billType,
                poId: d.poId || null,
                notes: d.notes || null,
                billToId: d.billToId || null,
                billTo: d.billTo || null,
                billToGstin: d.billToGstin || null,
                recurringScheduleId: d.recurringScheduleId || null,
                subtotal,
                taxRate: d.taxRate,
                taxAmount,
                totalAmount,
                lineItems: {
                    create: d.items.map((item) => ({
                        description: item.description,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        tax: item.tax,
                        total: item.qty * item.unitPrice,
                    })),
                },
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpInvoice",
            entityId: id,
            description: "Updated invoice (DRAFT)",
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[updateVpInvoice]", e)
        return { success: false, error: "Failed to update invoice" }
    }
}

// ── SUBMIT (DRAFT → SUBMITTED) — VENDOR ───────────────────────

export async function submitVpInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can submit invoices" }

    const inv = await prisma.vpInvoice.findUnique({
        where: { id },
        select: { status: true, invoiceNumber: true, createdById: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }
    if (inv.status !== "DRAFT")
        return { success: false, error: `Cannot submit invoice in ${inv.status} status` }
    if (inv.createdById !== session.user.id)
        return { success: false, error: "You can only submit your own invoices" }

    await prisma.vpInvoice.update({
        where: { id },
        data: { status: "SUBMITTED", submittedAt: new Date() },
    })

    // Notify admins
    const adminIds = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
    }).then((u) => u.map((x) => x.id))

    await createVpNotification({
        userIds: adminIds,
        type: "INVOICE_SUBMITTED",
        message: `Vendor Invoice ${inv.invoiceNumber} has been submitted and is awaiting review.`,
        refDocType: "VpInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpInvoice", entityId: id,
        newData: { status: "SUBMITTED" },
        description: `Submitted invoice ${inv.invoiceNumber}`,
    })
    await emailInvoiceSubmitted(id)

    return { success: true, data: null }
}

// ── START REVIEW (SUBMITTED → UNDER_REVIEW) — ADMIN ───────────

export async function startVpInvoiceReview(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Only admins or bosses can review invoices" }

    const inv = await prisma.vpInvoice.findUnique({
        where: { id }, select: { status: true, invoiceNumber: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }
    if (inv.status !== "SUBMITTED")
        return { success: false, error: "Invoice must be SUBMITTED to start review" }

    await prisma.vpInvoice.update({
        where: { id },
        data: { status: "UNDER_REVIEW", reviewedById: session.user.id },
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpInvoice", entityId: id,
        newData: { status: "UNDER_REVIEW" },
        description: `Started review of invoice ${inv.invoiceNumber}`,
    })

    return { success: true, data: null }
}

// ── APPROVE (UNDER_REVIEW → APPROVED) — BOSS ──────────────────

export async function approveVpInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const inv = await prisma.vpInvoice.findUnique({
        where: { id },
        select: { status: true, invoiceNumber: true, createdById: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }
    if (inv.status !== "UNDER_REVIEW")
        return { success: false, error: "Invoice must be UNDER_REVIEW to approve" }

    await prisma.vpInvoice.update({
        where: { id },
        data: { status: "APPROVED", approvedAt: new Date() },
    })

    await createVpNotification({
        userIds: [inv.createdById],
        type: "INVOICE_APPROVED",
        message: `Your invoice ${inv.invoiceNumber} has been approved. Payment will be initiated shortly.`,
        refDocType: "VpInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpInvoice", entityId: id,
        newData: { status: "APPROVED" },
        description: `Approved invoice ${inv.invoiceNumber}`,
    })
    await emailInvoiceApproved(id)

    return { success: true, data: null }
}

// ── REJECT (UNDER_REVIEW → REJECTED) — BOSS ───────────────────

export async function rejectVpInvoice(
    id: string,
    reason: string,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    if (!reason?.trim()) return { success: false, error: "Rejection reason is required" }

    const inv = await prisma.vpInvoice.findUnique({
        where: { id },
        select: { status: true, invoiceNumber: true, createdById: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }
    if (!["SUBMITTED", "UNDER_REVIEW"].includes(inv.status))
        return { success: false, error: `Cannot reject invoice in ${inv.status} status` }

    await prisma.vpInvoice.update({
        where: { id },
        data: { status: "REJECTED", rejectedAt: new Date() },
    })

    await createVpNotification({
        userIds: [inv.createdById],
        type: "INVOICE_REJECTED",
        message: `Your invoice ${inv.invoiceNumber} was rejected. Reason: ${reason}`,
        refDocType: "VpInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpInvoice", entityId: id,
        newData: { status: "REJECTED" },
        description: `Rejected invoice ${inv.invoiceNumber}: ${reason}`,
    })
    await emailInvoiceRejected(id, reason)

    return { success: true, data: null }
}

// ── DELETE (DRAFT only — VENDOR) ──────────────────────────────

export async function deleteVpInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can delete invoices" }

    const inv = await prisma.vpInvoice.findUnique({
        where: { id },
        select: { status: true, createdById: true, invoiceNumber: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }
    if (inv.status !== "DRAFT") return { success: false, error: "Only DRAFT invoices can be deleted" }
    if (inv.createdById !== session.user.id)
        return { success: false, error: "You can only delete your own invoices" }

    await prisma.vpInvoice.delete({ where: { id } })

    await logVpAudit({
        userId: session.user.id, action: "DELETE",
        entityType: "VpInvoice", entityId: id,
        description: `Deleted invoice ${inv.invoiceNumber}`,
    })

    return { success: true, data: null }
}

// ── UPLOAD DOCUMENT ────────────────────────────────────────────

export async function addVpInvoiceDocument(
    invoiceId: string,
    filePath: string,
): Promise<VpActionResult<{ docId: string }>> {
    const session = await getCustomSession()

    // Verify invoice exists and belongs to this user (or admin reviewing)
    const inv = await prisma.vpInvoice.findUnique({
        where: { id: invoiceId },
        select: { id: true, createdById: true, status: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }

    const isOwner = inv.createdById === session.user.id
    const isAdmin = session.user.role === "ADMIN"
    if (!isOwner && !isAdmin)
        return { success: false, error: "You cannot attach files to this invoice" }

    try {
        const doc = await prisma.vpInvoiceDocument.create({
            data: {
                invoiceId,
                filePath,
                uploadedById: session.user.id,
                uploadedAt: new Date(),
            },
        })
        return { success: true, data: { docId: doc.id } }
    } catch (e) {
        console.error("[addVpInvoiceDocument]", e)
        return { success: false, error: "Failed to save document record" }
    }
}

// ── GET vendor's own POs (for linking) ────────────────────────

export async function getVendorPosForInvoice(): Promise<VpActionResult<{ id: string; poNumber: string; grandTotal: number }[]>> {
    const session = await getCustomSession()
    const vpvId = await getVpVendorIdForSession(session.user.id)
    if (!vpvId) return { success: true, data: [] }

    try {
        const pos = await prisma.vpPurchaseOrder.findMany({
            where: {
                vendorId: vpvId,
                status: { in: ["ACKNOWLEDGED", "APPROVED", "SENT_TO_VENDOR"] },
            },
            select: { id: true, poNumber: true, grandTotal: true },
            orderBy: { createdAt: "desc" },
        })
        return { success: true, data: pos }
    } catch (e) {
        return { success: false, error: "Failed to fetch POs" }
    }
}

// ── GET vendor's own PIs (for linking) ────────────────────────

export async function getVendorPisForInvoice(): Promise<VpActionResult<{ id: string; piNumber: string; grandTotal: number }[]>
> {
    const session = await getCustomSession()
    const vpvId = await getVpVendorIdForSession(session.user.id)
    if (!vpvId) return { success: true, data: [] }

    try {
        const pis = await prisma.vpProformaInvoice.findMany({
            where: {
                vendorId: vpvId,
                status: { in: ["ACCEPTED"] },
            },
            select: { id: true, piNumber: true, grandTotal: true },
            orderBy: { createdAt: "desc" },
        })
        return { success: true, data: pis }
    } catch (e) {
        return { success: false, error: "Failed to fetch PIs" }
    }
}
