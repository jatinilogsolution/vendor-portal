// src/actions/vp/delivery.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdmin, isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { createVpNotification } from "@/lib/vendor-portal/notify"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { deliveryRecordSchema, DeliveryRecordValues } from "@/validations/vp/delivery"

// ── Types ──────────────────────────────────────────────────────

export type VpDeliveryItemRow = {
    id: string
    poLineItemId: string
    description: string
    qtyOrdered: number
    qtyDelivered: number
    condition: string | null
}

export type VpDeliveryRow = {
    id: string
    status: string
    deliveryDate: Date | null
    dispatchedBy: string | null
    receivedBy: string | null
    notes: string | null
    createdAt: Date
    po: {
        id: string
        poNumber: string
        vendorName: string
    }
    _count: { items: number }
}

export type VpDeliveryDetail = VpDeliveryRow & {
    items: VpDeliveryItemRow[]
}

// ── Shared select ──────────────────────────────────────────────

const DELIVERY_SELECT = {
    id: true,
    status: true,
    deliveryDate: true,
    dispatchedBy: true,
    receivedBy: true,
    notes: true,
    createdAt: true,
    _count: { select: { items: true } },
    purchaseOrder: {
        select: {
            id: true,
            poNumber: true,
            vendor: { select: { existingVendor: { select: { name: true } } } },
        },
    },
} as const

function mapRow(r: any): VpDeliveryRow {
    return {
        id: r.id,
        status: r.status,
        deliveryDate: r.deliveryDate,
        dispatchedBy: r.dispatchedBy,
        receivedBy: r.receivedBy,
        notes: r.notes,
        createdAt: r.createdAt,
        _count: r._count,
        po: {
            id: r.purchaseOrder.id,
            poNumber: r.purchaseOrder.poNumber,
            vendorName: r.purchaseOrder.vendor.existingVendor.name,
        },
    }
}

// ── READ list ──────────────────────────────────────────────────

export async function getVpDeliveries(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpDeliveryRow>>> {
    try {
        const session = await getCustomSession()
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.status) where.status = params.status
        if (params.vendorId) where.purchaseOrder = { vendorId: params.vendorId }
        if (params.from) where.createdAt = { ...where.createdAt, gte: new Date(params.from) }
        if (params.to) where.createdAt = { ...where.createdAt, lte: new Date(params.to) }

        // VENDOR scoping — see their PO deliveries only
        if (session.user.role === "VENDOR") {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id }, select: { vendorId: true },
            })
            if (user?.vendorId) {
                const vpv = await prisma.vpVendor.findFirst({
                    where: { existingVendorId: user.vendorId }, select: { id: true },
                })
                if (vpv) where.purchaseOrder = { vendorId: vpv.id }
            }
        }

        const [total, rows] = await Promise.all([
            prisma.vpDeliveryRecord.count({ where }),
            prisma.vpDeliveryRecord.findMany({
                where, skip, take: per_page,
                orderBy: { createdAt: "desc" },
                select: DELIVERY_SELECT,
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
        console.error("[getVpDeliveries]", e)
        return { success: false, error: "Failed to fetch deliveries" }
    }
}

// ── READ single ────────────────────────────────────────────────

export async function getVpDeliveryById(
    id: string,
): Promise<VpActionResult<VpDeliveryDetail>> {
    try {
        const r = await prisma.vpDeliveryRecord.findUnique({
            where: { id },
            select: {
                ...DELIVERY_SELECT,
                items: {
                    select: {
                        id: true,
                        qtyDelivered: true,
                        condition: true,
                        poLineItemId: true,
                        poLineItem: { select: { description: true, qty: true } },
                    },
                },
            },
        })
        if (!r) return { success: false, error: "Delivery record not found" }

        return {
            success: true,
            data: {
                ...mapRow(r),
                items: r.items.map((i) => ({
                    id: i.id,
                    poLineItemId: i.poLineItemId,
                    description: i.poLineItem.description,
                    qtyOrdered: i.poLineItem.qty,
                    qtyDelivered: i.qtyDelivered,
                    condition: i.condition,
                })),
            },
        }
    } catch (e) {
        console.error("[getVpDeliveryById]", e)
        return { success: false, error: "Failed to fetch delivery" }
    }
}

// ── Fetch PO line items for delivery form ──────────────────────

export async function getPoLineItemsForDelivery(poId: string): Promise<VpActionResult<{
    id: string
    description: string
    qty: number
    unitPrice: number
    totalDelivered: number
}[]>
> {
    try {
        const items = await prisma.vpPoLineItem.findMany({
            where: { poId },
            select: {
                id: true,
                description: true,
                qty: true,
                unitPrice: true,
                deliveryItems: { select: { qtyDelivered: true } },
            },
        })

        return {
            success: true,
            data: items.map((i) => ({
                id: i.id,
                description: i.description,
                qty: i.qty,
                unitPrice: i.unitPrice,
                totalDelivered: i.deliveryItems.reduce((s, d) => s + d.qtyDelivered, 0),
            })),
        }
    } catch (e) {
        return { success: false, error: "Failed to fetch PO line items" }
    }
}

// ── Fetch acknowledged POs for delivery creation ───────────────

export async function getAcknowledgedPosForDelivery(): Promise<VpActionResult<{ id: string; poNumber: string; vendorName: string }[]>> {
    try {
        const pos = await prisma.vpPurchaseOrder.findMany({
            where: { status: { in: ["ACKNOWLEDGED", "APPROVED"] } },
            select: {
                id: true,
                poNumber: true,
                vendor: { select: { existingVendor: { select: { name: true } } } },
            },
            orderBy: { createdAt: "desc" },
        })
        return {
            success: true,
            data: pos.map((p) => ({
                id: p.id,
                poNumber: p.poNumber,
                vendorName: p.vendor.existingVendor.name,
            })),
        }
    } catch (e) {
        return { success: false, error: "Failed to fetch POs" }
    }
}

// ── CREATE ─────────────────────────────────────────────────────

export async function createVpDelivery(
    raw: DeliveryRecordValues,
): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can record deliveries" }

    const parsed = deliveryRecordSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const d = parsed.data

    // Validate PO exists + is acknowledged
    const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id: d.poId },
        select: {
            status: true,
            poNumber: true,
            createdById: true,
            vendor: {
                select: {
                    existingVendor: { select: { users: { select: { id: true } } } },
                },
            },
        },
    })
    if (!po) return { success: false, error: "Purchase order not found" }
    if (!["ACKNOWLEDGED", "APPROVED"].includes(po.status))
        return { success: false, error: "Delivery can only be recorded for acknowledged POs" }

    try {
        // Compute delivery status from qty
        const lineItems = await prisma.vpPoLineItem.findMany({
            where: { poId: d.poId },
            select: {
                id: true,
                qty: true,
                deliveryItems: { select: { qtyDelivered: true } },
            },
        })

        // Check totals including this new delivery
        const newDeliveryMap = new Map(
            d.items.map((i) => [i.poLineItemId, i.qtyDelivered]),
        )

        let fullyDelivered = true
        for (const li of lineItems) {
            const alreadyDelivered = li.deliveryItems.reduce((s, di) => s + di.qtyDelivered, 0)
            const newQty = newDeliveryMap.get(li.id) ?? 0
            const totalAfter = alreadyDelivered + newQty
            if (totalAfter < li.qty) fullyDelivered = false
        }

        const status = fullyDelivered ? "FULLY_DELIVERED" : "PARTIAL_DELIVERY"

        const delivery = await prisma.vpDeliveryRecord.create({
            data: {
                poId: d.poId,
                deliveryDate: new Date(d.deliveryDate),
                dispatchedBy: d.dispatchedBy || null,
                receivedBy: d.receivedBy || null,
                notes: d.notes || null,
                status,
                items: {
                    create: d.items.map((item) => ({
                        poLineItemId: item.poLineItemId,
                        qtyDelivered: item.qtyDelivered,
                        condition: item.condition,
                    })),
                },
            },
        })

        // Update PO status to reflect delivery
        await prisma.vpPurchaseOrder.update({
            where: { id: d.poId },
            data: { status: fullyDelivered ? "ACKNOWLEDGED" : po.status },
        })

        // Notify vendor users
        const vendorUserIds = po.vendor.existingVendor.users.map((u) => u.id)
        if (vendorUserIds.length > 0) {
            await createVpNotification({
                userIds: vendorUserIds,
                type: "DELIVERY_CREATED",
                message: `A delivery record has been created for PO ${po.poNumber} — status: ${status.replaceAll("_", " ")}.`,
                refDocType: "VpDeliveryRecord",
                refDocId: delivery.id,
            })
        }

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpDeliveryRecord",
            entityId: delivery.id,
            description: `Recorded delivery for PO ${po.poNumber} — ${status}`,
        })

        return { success: true, data: { id: delivery.id } }
    } catch (e) {
        console.error("[createVpDelivery]", e)
        return { success: false, error: "Failed to create delivery record" }
    }
}

// ── APPROVE (FULLY_DELIVERED → APPROVED) — ADMIN ──────────────

export async function approveVpDelivery(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Only admins can approve deliveries" }

    const delivery = await prisma.vpDeliveryRecord.findUnique({
        where: { id },
        select: {
            status: true,
            purchaseOrder: { select: { poNumber: true, createdById: true } },
        },
    })
    if (!delivery) return { success: false, error: "Delivery not found" }
    if (delivery.status !== "FULLY_DELIVERED")
        return { success: false, error: "Only fully delivered records can be approved" }

    await prisma.vpDeliveryRecord.update({
        where: { id },
        data: { status: "APPROVED" },
    })

    await logVpAudit({
        userId: session.user.id,
        action: "UPDATE",
        entityType: "VpDeliveryRecord",
        entityId: id,
        description: `Approved delivery for PO ${delivery.purchaseOrder.poNumber}`,
    })

    return { success: true, data: null }
}

// Upload delivery proof (admin or vendor)
export async function uploadDeliveryProof(
  deliveryId: string,
  proofUrl:   string,
): Promise<VpActionResult<null>> {
  const session = await getCustomSession()

  await prisma.vpDeliveryRecord.update({
    where: { id: deliveryId },
    data:  { proofUrl, proofUploadedAt: new Date() },
  })

  return { success: true, data: null }
}

// Vendor marks delivery dispatched with proof
export async function vendorMarkDispatched(
  deliveryId: string,
  proofUrl:   string,
  dispatchedBy: string,
): Promise<VpActionResult<null>> {
  const session = await getCustomSession()
  if (session.user.role !== "VENDOR")
    return { success: false, error: "Only vendors can mark dispatch" }

  await prisma.vpDeliveryRecord.update({
    where: { id: deliveryId },
    data: {
      dispatchedBy,
      proofUrl,
      proofUploadedAt: new Date(),
      status: "PARTIAL_DELIVERY",
    },
  })

  return { success: true, data: null }
}
