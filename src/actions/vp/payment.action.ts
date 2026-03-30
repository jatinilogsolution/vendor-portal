// src/actions/vp/payment.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { createVpNotification } from "@/lib/vendor-portal/notify"
import { emailPaymentConfirmed, emailPaymentInitiated } from "@/lib/vp-email"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { vpPaymentSchema, VpPaymentFormValues } from "@/validations/vp/invoice"

export type VpPaymentRow = {
    id: string
    amount: number
    paymentMode: string | null
    transactionRef: string | null
    notes: string | null
    paymentDate: Date | null
    status: string
    createdAt: Date
    initiatedBy: { name: string } | null
    invoice: {
        id: string
        invoiceNumber: string | null
        totalAmount: number
        vendor: {
            vendorName: string
        }
    }
}

// ── READ list ──────────────────────────────────────────────────

export async function getVpPayments(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpPaymentRow>>> {
    try {
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.status) where.status = params.status
        if (params.from) where.createdAt = { ...where.createdAt, gte: new Date(params.from) }
        if (params.to) where.createdAt = { ...where.createdAt, lte: new Date(params.to) }

        const [total, rows] = await Promise.all([
            prisma.vpPayment.count({ where }),
            prisma.vpPayment.findMany({
                where, skip, take: per_page,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    amount: true,
                    paymentMode: true,
                    transactionRef: true,
                    notes: true,
                    paymentDate: true,
                    status: true,
                    createdAt: true,
                    initiatedBy: { select: { name: true } },
                    invoice: {
                        select: {
                            id: true,
                            invoiceNumber: true,
                            totalAmount: true,
                            vendor: {
                                select: { existingVendor: { select: { name: true } } },
                            },
                        },
                    },
                },
            }),
        ])

        return {
            success: true,
            data: {
                data: rows.map((r) => ({
                    id: r.id,
                    amount: r.amount,
                    paymentMode: r.paymentMode,
                    transactionRef: r.transactionRef,
                    notes: r.notes,
                    paymentDate: r.paymentDate,
                    status: r.status,
                    createdAt: r.createdAt,
                    initiatedBy: r.initiatedBy,
                    invoice: {
                        id: r.invoice.id,
                        invoiceNumber: r.invoice.invoiceNumber,
                        totalAmount: r.invoice.totalAmount,
                        vendor: { vendorName: r.invoice.vendor.existingVendor.name },
                    },
                })),
                meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
            },
        }
    } catch (e) {
        console.error("[getVpPayments]", e)
        return { success: false, error: "Failed to fetch payments" }
    }
}

// ── INITIATE PAYMENT (APPROVED → PAYMENT_INITIATED) — BOSS ────

export async function initiateVpPayment(
    invoiceId: string,
    raw: VpPaymentFormValues,
): Promise<VpActionResult<{ paymentId: string }>> {
    const session = await getCustomSession()
    if (!isBoss(session.user.role))
        return { success: false, error: "Only management can initiate payments" }

    const parsed = vpPaymentSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const inv = await prisma.vpInvoice.findUnique({
        where: { id: invoiceId },
        select: { status: true, invoiceNumber: true, createdById: true, totalAmount: true },
    })
    if (!inv) return { success: false, error: "Invoice not found" }
    if (inv.status !== "APPROVED")
        return { success: false, error: "Invoice must be APPROVED before initiating payment" }

    const d = parsed.data

    try {
        const [payment] = await prisma.$transaction([
            prisma.vpPayment.create({
                data: {
                    invoiceId,
                    amount: d.amount,
                    paymentMode: d.paymentMode,
                    transactionRef: d.transactionRef || null,
                    notes: d.notes || null,
                    paymentDate: new Date(d.paymentDate),
                    proofUrl: d.proofUrl || null,
                    proofUploadedAt: d.proofUrl ? new Date() : null,
                    status: "INITIATED",
                    initiatedById: session.user.id,
                },
            }),
            prisma.vpInvoice.update({
                where: { id: invoiceId },
                data: { status: "PAYMENT_INITIATED" },
            }),
        ])

        await createVpNotification({
            userIds: [inv.createdById],
            type: "PAYMENT_INITIATED",
            message: `Payment of ₹${d.amount.toLocaleString("en-IN")} has been initiated for invoice ${inv.invoiceNumber}.`,
            refDocType: "VpPayment",
            refDocId: payment.id,
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpPayment",
            entityId: payment.id,
            description: `Initiated payment ₹${d.amount} for invoice ${inv.invoiceNumber}`,
        })
        await emailPaymentInitiated(invoiceId, d.amount, d.notes || null)

        return { success: true, data: { paymentId: payment.id } }
    } catch (e) {
        console.error("[initiateVpPayment]", e)
        return { success: false, error: "Failed to initiate payment" }
    }
}

// ── CONFIRM PAYMENT (PAYMENT_INITIATED → PAYMENT_CONFIRMED) — BOSS

export async function confirmVpPayment(
    paymentId: string,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isBoss(session.user.role))
        return { success: false, error: "Only management can confirm payments" }

    const payment = await prisma.vpPayment.findUnique({
        where: { id: paymentId },
        select: {
            status: true,
            invoiceId: true,
            amount: true,
            notes: true,
            invoice: { select: { invoiceNumber: true, createdById: true } },
        },
    })
    if (!payment) return { success: false, error: "Payment not found" }
    if (payment.status !== "INITIATED" && payment.status !== "PROCESSING")
        return { success: false, error: "Payment cannot be confirmed in its current state" }

    await prisma.$transaction([
        prisma.vpPayment.update({
            where: { id: paymentId },
            data: { status: "COMPLETED" },
        }),
        prisma.vpInvoice.update({
            where: { id: payment.invoiceId },
            data: { status: "PAYMENT_CONFIRMED" },
        }),
    ])

    await createVpNotification({
        userIds: [payment.invoice.createdById],
        type: "PAYMENT_CONFIRMED",
        message: `Payment for invoice ${payment.invoice.invoiceNumber} has been confirmed.`,
        refDocType: "VpInvoice",
        refDocId: payment.invoiceId,
    })

    await logVpAudit({
        userId: session.user.id,
        action: "UPDATE",
        entityType: "VpPayment",
        entityId: paymentId,
        description: `Confirmed payment for invoice ${payment.invoice.invoiceNumber}`,
    })
    await emailPaymentConfirmed(payment.invoiceId, payment.amount, payment.notes ?? null)

    return { success: true, data: null }
}

export async function uploadPaymentProof(
  paymentId: string,
  proofUrl:  string,
): Promise<VpActionResult<null>> {
  const session = await getCustomSession()
  if (!isBoss(session.user.role))
    return { success: false, error: "Only management can upload payment proof" }

  await prisma.vpPayment.update({
    where: { id: paymentId },
    data:  { proofUrl, proofUploadedAt: new Date() },
  })

  return { success: true, data: null }
}
