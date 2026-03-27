// src/actions/vp/proforma-invoice.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdmin, isAdminOrBoss, isBoss, isVendor } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { createVpNotification } from "@/lib/vendor-portal/notify"
import { emailPiSubmitted } from "@/lib/vp-email"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { proformaInvoiceSchema, ProformaInvoiceValues } from "@/validations/vp/proforma-invoice"
import { vendorPiSchema, VendorPiFormValues } from "@/validations/vp/procurement"

// ── Types ──────────────────────────────────────────────────────

export type VpPiLineItem = {
    id: string
    itemId: string | null
    itemCode: string | null
    itemName: string | null
    description: string
    qty: number
    unitPrice: number
    total: number
}

// ── Updated VpPiRow type — add missing fields ──────────────────
export type VpPiRow = {
  id:              string
  piNumber:        string
  status:          string
  subtotal:        number
  taxRate:         number
  taxAmount:       number
  grandTotal:      number
  notes:           string | null
  validityDate:    Date | null
  paymentTerms:    string | null
  fulfillmentDate: Date | null        // ← ADD
  procurementId:   string | null      // ← ADD
  createdAt:       Date
  categoryName:    string | null
  categoryId:      string | null      // ← ADD
  billToId:        string | null
  billTo:          string | null
  billToGstin:     string | null
  convertedToPoId: string | null
  raisedByVendor:  boolean            // ← ADD
  vendor: {
    id:          string
    vendorName:  string
    vendorType:  string
    billingType: string | null
  }
  createdBy:      { id: string; name: string }
  approvedBy:     { id: string; name: string } | null
  submittedAt:    Date | null
  approvedAt:     Date | null
  sentToVendorAt: Date | null
  acceptedAt:     Date | null
  declinedAt:     Date | null
  rejectedAt:     Date | null
  rejectionReason: string | null
  items: {
    description: string
    qty: number
    unitPrice: number
    total: number
  }[]
}
export type VpPiDetail = Omit<VpPiRow, "items"> & {
    items: VpPiLineItem[]
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

// ── PI number generator ────────────────────────────────────────

async function generatePiNumber(): Promise<string> {
    const now = new Date()
    const yr = now.getFullYear().toString().slice(-2)
    const mo = String(now.getMonth() + 1).padStart(2, "0")
    const count = await prisma.vpProformaInvoice.count()
    const seq = String(count + 1).padStart(4, "0")
    return `VP-PI-${yr}${mo}-${seq}`
}

// ── Compute totals ─────────────────────────────────────────────

function computeTotals(
    items: { qty: number; unitPrice: number }[],
    taxRate: number,
) {
    const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
    const taxAmount = (subtotal * taxRate) / 100
    const grandTotal = subtotal + taxAmount
    return { subtotal, taxAmount, grandTotal }
}

// ── Shared select shape ────────────────────────────────────────

// ── Updated PI_SELECT — add the missing fields ─────────────────
const PI_SELECT = {
  id:              true,
  piNumber:        true,
  status:          true,
  subtotal:        true,
  taxRate:         true,
  taxAmount:       true,
  grandTotal:      true,
  notes:           true,
  validityDate:    true,
  paymentTerms:    true,
  fulfillmentDate: true,        // ← ADD
  procurementId:   true,        // ← ADD
  raisedByVendor:  true,        // ← ADD
  createdAt:       true,
  convertedToPoId: true,
  submittedAt:     true,
  approvedAt:      true,
  sentToVendorAt:  true,
  acceptedAt:      true,
  declinedAt:      true,
  rejectedAt:      true,
  rejectionReason: true,
  categoryId: true,
  billToId:    true,
  billTo:      true,
  billToGstin: true,             // ← ADD
  category:   { select: { name: true } },
  vendor: {
    select: {
      id:          true,
      vendorType:  true,
      billingType: true,
      existingVendor: { select: { name: true } },
    },
  },
  createdBy:  { select: { id: true, name: true } },
  approvedBy: { select: { id: true, name: true } },
  items: {
    select: {
      description: true,
      qty: true,
      unitPrice: true,
      total: true,
    },
  },
} as const

// ── Updated mapRow — include new fields ────────────────────────
function mapRow(r: any): VpPiRow {
  return {
    id:              r.id,
    piNumber:        r.piNumber,
    status:          r.status,
    subtotal:        r.subtotal,
    taxRate:         r.taxRate,
    taxAmount:       r.taxAmount,
    grandTotal:      r.grandTotal,
    notes:           r.notes,
    validityDate:    r.validityDate,
    paymentTerms:    r.paymentTerms,
    fulfillmentDate: r.fulfillmentDate  ?? null,   // ← ADD
    procurementId:   r.procurementId   ?? null,   // ← ADD
    raisedByVendor:  r.raisedByVendor  ?? false,  // ← ADD
    createdAt:       r.createdAt,
    categoryName:    r.category?.name  ?? null,
    categoryId:      r.categoryId      ?? null,   // ← ADD
    billToId:        r.billToId        ?? null,
    billTo:          r.billTo          ?? null,
    billToGstin:     r.billToGstin     ?? null,
    convertedToPoId: r.convertedToPoId ?? null,
    vendor: {
      id:          r.vendor.id,
      vendorName:  r.vendor.existingVendor.name,
      vendorType:  r.vendor.vendorType,
      billingType: r.vendor.billingType,
    },
    createdBy:       { id: r.createdBy.id, name: r.createdBy.name },
    approvedBy:      r.approvedBy
      ? { id: r.approvedBy.id, name: r.approvedBy.name }
      : null,
    submittedAt:     r.submittedAt,
    approvedAt:      r.approvedAt,
    sentToVendorAt:  r.sentToVendorAt,
    acceptedAt:      r.acceptedAt,
    declinedAt:      r.declinedAt,
    rejectedAt:      r.rejectedAt,
    rejectionReason: r.rejectionReason,
    items: (r.items ?? []).map((i: any) => ({
      description: i.description,
      qty: i.qty,
      unitPrice: i.unitPrice,
      total: i.total,
    })),
  }
}

// ── READ list ──────────────────────────────────────────────────

// ── Updated getVpProformaInvoices — add procurementId filter ───
export async function getVpProformaInvoices(
  params: VpListParams & { procurementId?: string } = {},  // ← ADD param
): Promise<VpActionResult<VpListResult<VpPiRow>>> {
  try {
    const session  = await getCustomSession()
    const page     = Math.max(1, params.page     ?? 1)
    const per_page = Math.min(100, params.per_page ?? 20)
    const skip     = (page - 1) * per_page

    const where: any = {}
    if (params.status)        where.status        = params.status
    if (params.vendorId)      where.vendorId       = params.vendorId
    if (params.categoryId)    where.categoryId     = params.categoryId
    if (params.search)        where.piNumber       = { contains: params.search }
    if (params.from)          where.createdAt      = { ...where.createdAt, gte: new Date(params.from) }
    if (params.to)            where.createdAt      = { ...where.createdAt, lte: new Date(params.to) }
    if (params.procurementId) where.procurementId  = params.procurementId  // ← ADD

    // VENDOR sees only their own
    if (session.user.role === "VENDOR") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }, select: { vendorId: true },
      })
      if (user?.vendorId) {
        const vpv = await prisma.vpVendor.findFirst({
          where: { existingVendorId: user.vendorId }, select: { id: true },
        })
        if (vpv) where.vendorId = vpv.id
        else return {
          success: true,
          data: { data: [], meta: { page, per_page, total: 0, total_pages: 0 } },
        }
      }
    }

    const [total, rows] = await Promise.all([
      prisma.vpProformaInvoice.count({ where }),
      prisma.vpProformaInvoice.findMany({
        where, skip, take: per_page,
        orderBy: { createdAt: "desc" },
        select:  PI_SELECT,
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
    console.error("[getVpProformaInvoices]", e)
    return { success: false, error: "Failed to fetch proforma invoices" }
  }
}

// ── READ single ────────────────────────────────────────────────

export async function getVpProformaInvoiceById(
    id: string,
): Promise<VpActionResult<VpPiDetail>> {
    try {
        const r = await prisma.vpProformaInvoice.findUnique({
            where: { id },
            select: {
                ...PI_SELECT,
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
            },
        })
        if (!r) return { success: false, error: "Proforma invoice not found" }

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
                invoices: await prisma.vpInvoice.findMany({
                    where: { piId: id },
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
                    orderBy: { createdAt: "desc" }
                })
            },
        }
    } catch (e) {
        console.error("[getVpProformaInvoiceById]", e)
        return { success: false, error: "Failed to fetch proforma invoice" }
    }
}

// ── CREATE ─────────────────────────────────────────────────────

export async function createVpProformaInvoice(
    raw: ProformaInvoiceValues,
): Promise<VpActionResult<{ id: string; piNumber: string }>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can create proforma invoices" }

    const parsed = proformaInvoiceSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const d = parsed.data
    const { subtotal, taxAmount, grandTotal } = computeTotals(d.items, d.taxRate)

    try {
        const piNumber = await generatePiNumber()

        const pi = await prisma.vpProformaInvoice.create({
            data: {
                piNumber,
                status: "DRAFT",
                vendorId: d.vendorId,
                categoryId: d.categoryId || null,
                notes: d.notes || null,
                validityDate: d.validityDate ? new Date(d.validityDate) : null,
                paymentTerms: d.paymentTerms || null,
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
            entityType: "VpProformaInvoice",
            entityId: pi.id,
            description: `Created PI ${piNumber}`,
        })

        return { success: true, data: { id: pi.id, piNumber } }
    } catch (e) {
        console.error("[createVpProformaInvoice]", e)
        return { success: false, error: "Failed to create proforma invoice" }
    }
}

export async function createVendorProformaInvoice(
    raw: VendorPiFormValues,
): Promise<VpActionResult<{ id: string; piNumber: string }>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can submit quotes" }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }, select: { vendorId: true },
    })
    const vpv = user?.vendorId
        ? await prisma.vpVendor.findFirst({
            where: { existingVendorId: user.vendorId }, select: { id: true, categoryId: true },
        })
        : null

    if (!vpv) return { success: false, error: "Your account is not linked to a vendor" }

    const subtotal = raw.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
    const taxAmount = (subtotal * raw.taxRate) / 100
    const grandTotal = subtotal + taxAmount

    try {
        const piNumber = await generatePiNumber()
        const pi = await prisma.vpProformaInvoice.create({
            data: {
                piNumber,
                status: "SUBMITTED", // vendor submits directly
                raisedByVendor: true,
                vendorId: vpv.id,
                categoryId: vpv.categoryId,
                procurementId: raw.procurementId || null,
                notes: raw.notes || null,
                validityDate: raw.validityDate ? new Date(raw.validityDate) : null,
                paymentTerms: raw.paymentTerms || null,
                fulfillmentDate: raw.fulfillmentDate ? new Date(raw.fulfillmentDate) : null,
                subtotal,
                taxRate: raw.taxRate,
                taxAmount,
                grandTotal,
                createdById: session.user.id,
                submittedAt: new Date(),
                items: {
                    create: raw.items.map((item) => ({
                        itemId: item.itemId || null,
                        description: item.description,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        total: item.qty * item.unitPrice,
                    })),
                },
            },
        })

        // If linked to procurement, mark vendor as responded
        if (raw.procurementId) {
            await prisma.vpProcurementVendor.updateMany({
                where: { procurementId: raw.procurementId, vendorId: vpv.id },
                data: { status: "QUOTED", respondedAt: new Date() },
            })
        }

        // Notify admin + boss
        const internalIds = await prisma.user.findMany({
            where: { role: { in: ["ADMIN", "BOSS"] } },
            select: { id: true },
        }).then((u) => u.map((x) => x.id))

        await createVpNotification({
            userIds: internalIds,
            type: "PI_SUBMITTED",
            message: `Vendor submitted quote ${piNumber}${raw.procurementId ? " against a procurement request" : ""}.`,
            refDocType: "VpProformaInvoice",
            refDocId: pi.id,
        })
        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpProformaInvoice",
            entityId: pi.id,
            description: `Vendor submitted PI ${piNumber}`,
        })
        await emailPiSubmitted(pi.id)

        return { success: true, data: { id: pi.id, piNumber } }
    } catch (e) {
        console.error("[createVendorProformaInvoice]", e)
        return { success: false, error: "Failed to submit quote" }
    }
}

// ── UPDATE (DRAFT only) ────────────────────────────────────────

export async function updateVpProformaInvoice(
    id: string,
    raw: ProformaInvoiceValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can update proforma invoices" }

    const parsed = proformaInvoiceSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id }, select: { status: true },
    })
    if (!pi) return { success: false, error: "Proforma invoice not found" }
    if (pi.status !== "DRAFT")
        return { success: false, error: "Only DRAFT proforma invoices can be edited" }

    const d = parsed.data
    const { subtotal, taxAmount, grandTotal } = computeTotals(d.items, d.taxRate)

    try {
        await prisma.vpPiLineItem.deleteMany({ where: { piId: id } })
        await prisma.vpProformaInvoice.update({
            where: { id },
            data: {
                vendorId: d.vendorId,
                categoryId: d.categoryId || null,
                notes: d.notes || null,
                validityDate: d.validityDate ? new Date(d.validityDate) : null,
                paymentTerms: d.paymentTerms || null,
                subtotal,
                taxRate: d.taxRate,
                taxAmount,
                grandTotal,
                billToId: d.billToId || null,
                billTo: d.billTo || null,
                billToGstin: d.billToGstin || null,
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
            entityType: "VpProformaInvoice",
            entityId: id,
            description: "Updated PI (DRAFT)",
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[updateVpProformaInvoice]", e)
        return { success: false, error: "Failed to update proforma invoice" }
    }
}

// ── SUBMIT (DRAFT → SUBMITTED) — ADMIN ────────────────────────

export async function submitVpProformaInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can submit proforma invoices" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id }, select: { status: true, piNumber: true },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "DRAFT")
        return { success: false, error: `Cannot submit a PI in ${pi.status} status` }

    await prisma.vpProformaInvoice.update({
        where: { id },
        data: { status: "SUBMITTED", submittedAt: new Date() },
    })

    const bossIds = await prisma.user.findMany({
        where: { role: "BOSS" },
        select: { id: true },
    }).then((u) => u.map((x) => x.id))

    await createVpNotification({
        userIds: bossIds,
        type: "PI_SUBMITTED",
        message: `Proforma Invoice ${pi.piNumber} has been submitted for approval.`,
        refDocType: "VpProformaInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpProformaInvoice", entityId: id,
        description: `Submitted PI ${pi.piNumber}`,
    })

    return { success: true, data: null }
}

// ── APPROVE (SUBMITTED → APPROVED) — BOSS ─────────────────────

export async function approveVpProformaInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id },
        select: { status: true, piNumber: true, createdById: true },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "SUBMITTED")
        return { success: false, error: `Cannot approve a PI in ${pi.status} status` }

    await prisma.vpProformaInvoice.update({
        where: { id },
        data: { status: "APPROVED", approvedAt: new Date(), approvedById: session.user.id },
    })

    await createVpNotification({
        userIds: [pi.createdById],
        type: "PI_APPROVED",
        message: `Proforma Invoice ${pi.piNumber} has been approved. You can now send it to the vendor.`,
        refDocType: "VpProformaInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpProformaInvoice", entityId: id,
        description: `Approved PI ${pi.piNumber}`,
    })

    return { success: true, data: null }
}

// ── REJECT — BOSS ──────────────────────────────────────────────

export async function rejectVpProformaInvoice(
    id: string,
    reason: string,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    if (!reason?.trim()) return { success: false, error: "Rejection reason is required" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id },
        select: { status: true, piNumber: true, createdById: true },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "SUBMITTED")
        return { success: false, error: `Cannot reject a PI in ${pi.status} status` }

    await prisma.vpProformaInvoice.update({
        where: { id },
        data: { status: "REJECTED", rejectedAt: new Date(), rejectionReason: reason },
    })

    await createVpNotification({
        userIds: [pi.createdById],
        type: "PI_REJECTED",
        message: `Proforma Invoice ${pi.piNumber} was rejected. Reason: ${reason}`,
        refDocType: "VpProformaInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpProformaInvoice", entityId: id,
        description: `Rejected PI ${pi.piNumber}: ${reason}`,
    })

    return { success: true, data: null }
}

// ── SEND TO VENDOR (APPROVED → SENT_TO_VENDOR) — ADMIN ────────

export async function sendVpPiToVendor(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can send PIs to vendors" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id },
        select: { status: true, piNumber: true, vendorId: true },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "APPROVED")
        return { success: false, error: "PI must be approved before sending to vendor" }

    await prisma.vpProformaInvoice.update({
        where: { id },
        data: { status: "SENT_TO_VENDOR", sentToVendorAt: new Date() },
    })

    const vendorUsers = await prisma.user.findMany({
        where: {
            role: "VENDOR",
            Vendor: { vpVendors: { some: { id: pi.vendorId } } },
        },
        select: { id: true },
    })

    if (vendorUsers.length > 0) {
        await createVpNotification({
            userIds: vendorUsers.map((u) => u.id),
            type: "PI_SENT_TO_VENDOR",
            message: `A Proforma Invoice ${pi.piNumber} has been sent to you for review.`,
            refDocType: "VpProformaInvoice",
            refDocId: id,
        })
    }

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpProformaInvoice", entityId: id,
        description: `Sent PI ${pi.piNumber} to vendor`,
    })

    return { success: true, data: null }
}

// ── ACCEPT (SENT_TO_VENDOR → ACCEPTED) — VENDOR ───────────────

export async function acceptVpProformaInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can accept proforma invoices" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id },
        select: { status: true, piNumber: true, createdById: true },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "SENT_TO_VENDOR")
        return { success: false, error: "This PI is not awaiting your response" }

    await prisma.vpProformaInvoice.update({
        where: { id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
    })

    await createVpNotification({
        userIds: [pi.createdById],
        type: "PI_ACCEPTED",
        message: `Proforma Invoice ${pi.piNumber} has been accepted by the vendor.`,
        refDocType: "VpProformaInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpProformaInvoice", entityId: id,
        description: `Vendor accepted PI ${pi.piNumber}`,
    })

    return { success: true, data: null }
}

// ── DECLINE (SENT_TO_VENDOR → DECLINED) — VENDOR ──────────────

export async function declineVpProformaInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR")
        return { success: false, error: "Only vendors can decline proforma invoices" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id },
        select: { status: true, piNumber: true, createdById: true },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "SENT_TO_VENDOR")
        return { success: false, error: "This PI is not awaiting your response" }

    await prisma.vpProformaInvoice.update({
        where: { id },
        data: { status: "DECLINED", declinedAt: new Date() },
    })

    await createVpNotification({
        userIds: [pi.createdById],
        type: "PI_DECLINED",
        message: `Proforma Invoice ${pi.piNumber} was declined by the vendor.`,
        refDocType: "VpProformaInvoice",
        refDocId: id,
    })

    await logVpAudit({
        userId: session.user.id, action: "UPDATE",
        entityType: "VpProformaInvoice", entityId: id,
        description: `Vendor declined PI ${pi.piNumber}`,
    })

    return { success: true, data: null }
}

// ── CONVERT PI → PO (ACCEPTED) — ADMIN ────────────────────────

export async function convertPiToPo(
    id: string,
): Promise<VpActionResult<{ poId: string; poNumber: string }>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can convert a PI to a PO" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id },
        select: {
            status: true,
            piNumber: true,
            vendorId: true,
            categoryId: true,
            taxRate: true,
            notes: true,
            validityDate: true,
            items: {
                select: {
                    itemId: true,
                    description: true,
                    qty: true,
                    unitPrice: true,
                    total: true,
                },
            },
        },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "ACCEPTED")
        return { success: false, error: "Only ACCEPTED proforma invoices can be converted to a PO" }
    if (pi.items.length === 0)
        return { success: false, error: "PI has no line items" }

    const subtotal = pi.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
    const taxAmount = (subtotal * pi.taxRate) / 100
    const grandTotal = subtotal + taxAmount

    // Generate PO number
    const count = await prisma.vpPurchaseOrder.count()
    const now = new Date()
    const yr = now.getFullYear().toString().slice(-2)
    const mo = String(now.getMonth() + 1).padStart(2, "0")
    const poNumber = `VP-PO-${yr}${mo}-${String(count + 1).padStart(4, "0")}`

    try {
        const po = await prisma.vpPurchaseOrder.create({
            data: {
                poNumber,
                status: "DRAFT",
                vendorId: pi.vendorId,
                categoryId: pi.categoryId,
                notes: `Converted from PI ${pi.piNumber}${pi.notes ? `\n${pi.notes}` : ""}`,
                subtotal,
                taxRate: pi.taxRate,
                taxAmount,
                grandTotal,
                createdById: session.user.id,
                items: {
                    create: pi.items.map((item) => ({
                        itemId: item.itemId,
                        description: item.description,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        total: item.total,
                    })),
                },
            },
        })

        // Mark PI as converted
        await prisma.vpProformaInvoice.update({
            where: { id },
            data: { convertedToPoId: po.id },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpPurchaseOrder",
            entityId: po.id,
            description: `Converted PI ${pi.piNumber} → PO ${poNumber}`,
        })

        return { success: true, data: { poId: po.id, poNumber } }
    } catch (e) {
        console.error("[convertPiToPo]", e)
        return { success: false, error: "Failed to convert PI to PO" }
    }
}

// ── DELETE (DRAFT only) — ADMIN ───────────────────────────────

export async function deleteVpProformaInvoice(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can delete proforma invoices" }

    const pi = await prisma.vpProformaInvoice.findUnique({
        where: { id }, select: { status: true, piNumber: true },
    })
    if (!pi) return { success: false, error: "PI not found" }
    if (pi.status !== "DRAFT")
        return { success: false, error: "Only DRAFT proforma invoices can be deleted" }

    await prisma.vpProformaInvoice.delete({ where: { id } })

    await logVpAudit({
        userId: session.user.id, action: "DELETE",
        entityType: "VpProformaInvoice", entityId: id,
        description: `Deleted PI ${pi.piNumber}`,
    })

    return { success: true, data: null }
}
