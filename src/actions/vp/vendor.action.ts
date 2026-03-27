// src/actions/vp/vendor.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdminOrBoss, isAdmin } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { vpVendorSchema, VpVendorFormValues } from "@/validations/vp/vendor"

// ── Types ──────────────────────────────────────────────────────

export type VpVendorRow = {
    id: string
    portalStatus: string
    vendorType: string
    billingType: string[]
    recurringCycle: string | null
    categoryId: string | null
    categoryName: string | null
    createdAt: Date
    existingVendorId: string
    vendor: {
        name: string
        contactEmail: string | null
        contactPhone: string | null
        gstNumber: string | null
        panNumber: string | null
        isActive: boolean
        paymentTerms: string | null
        address: {
            city: string
            state: string | null
            country: string
        } | null
    }
    _count: {
        purchaseOrders: number
        proformaInvoices: number
        invoices: number
    }
}

export type VpVendorDetail = VpVendorRow & {
    createdBy: { name: string; email: string } | null
    purchaseOrders: {
        id: string
        poNumber: string
        status: string
        grandTotal: number
        createdAt: Date
    }[]
    invoices: {
        id: string
        invoiceNumber: string | null
        status: string
        totalAmount: number
        createdAt: Date
    }[]
}

// ── READ list ──────────────────────────────────────────────────

export async function getVpVendors(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpVendorRow>>> {
    try {
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.status) where.portalStatus = params.status
        if (params.categoryId) where.categoryId = params.categoryId
        if (params.type) where.vendorType = params.type
        if (params.search) {
            where.existingVendor = {
                name: { contains: params.search },
            }
        }

        const [total, rows] = await Promise.all([
            prisma.vpVendor.count({ where }),
            prisma.vpVendor.findMany({
                where,
                skip,
                take: per_page,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    portalStatus: true,
                    vendorType: true,
                    billingType: true,
                    recurringCycle: true,
                    categoryId: true,
                    createdAt: true,
                    existingVendorId: true,
                    category: { select: { name: true } },
                    existingVendor: {
                        select: {
                            name: true,
                            contactEmail: true,
                            contactPhone: true,
                            gstNumber: true,
                            panNumber: true,
                            isActive: true,
                            paymentTerms: true,
                            Address: { select: { city: true, state: true, country: true } },
                        },
                    },
                    _count: {
                        select: {
                            purchaseOrders: true,
                            proformaInvoices: true,
                            invoices: true,
                        },
                    },
                },
            }),
        ])

        const data: VpVendorRow[] = rows.map((r) => ({
            id: r.id,
            portalStatus: r.portalStatus,
            vendorType: r.vendorType,
            billingType: r.billingType ? r.billingType.split(",") : [],
            recurringCycle: r.recurringCycle,
            categoryId: r.categoryId,
            categoryName: r.category?.name ?? null,
            createdAt: r.createdAt,
            existingVendorId: r.existingVendorId,
            vendor: {
                name: r.existingVendor.name,
                contactEmail: r.existingVendor.contactEmail,
                contactPhone: r.existingVendor.contactPhone,
                gstNumber: r.existingVendor.gstNumber,
                panNumber: r.existingVendor.panNumber,
                isActive: r.existingVendor.isActive,
                paymentTerms: r.existingVendor.paymentTerms,
                address: r.existingVendor.Address[0] ?? null,
            },
            _count: r._count,
        }))

        return {
            success: true,
            data: { data, meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) } },
        }
    } catch (e) {
        console.error("[getVpVendors]", e)
        return { success: false, error: "Failed to fetch vendors" }
    }
}

// ── READ single ────────────────────────────────────────────────

export async function getVpVendorById(
    id: string,
): Promise<VpActionResult<VpVendorDetail>> {
    try {
        const r = await prisma.vpVendor.findUnique({
            where: { id },
            select: {
                id: true,
                portalStatus: true,
                vendorType: true,
                billingType: true,
                recurringCycle: true,
                categoryId: true,
                createdAt: true,
                existingVendorId: true,
                category: { select: { name: true } },
                createdBy: { select: { name: true, email: true } },
                existingVendor: {
                    select: {
                        name: true,
                        contactEmail: true,
                        contactPhone: true,
                        gstNumber: true,
                        panNumber: true,
                        isActive: true,
                        paymentTerms: true,
                        Address: { select: { city: true, state: true, country: true } },
                    },
                },
                purchaseOrders: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    select: { id: true, poNumber: true, status: true, grandTotal: true, createdAt: true },
                },
                invoices: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    select: { id: true, invoiceNumber: true, status: true, totalAmount: true, createdAt: true },
                },
                _count: {
                    select: { purchaseOrders: true, proformaInvoices: true, invoices: true },
                },
            },
        })

        if (!r) return { success: false, error: "Vendor not found" }

        return {
            success: true,
            data: {
                id: r.id,
                portalStatus: r.portalStatus,
                vendorType: r.vendorType,
                billingType: r.billingType ? r.billingType.split(",") : [],
                recurringCycle: r.recurringCycle,
                categoryId: r.categoryId,
                categoryName: r.category?.name ?? null,
                createdAt: r.createdAt,
                existingVendorId: r.existingVendorId,
                vendor: {
                    name: r.existingVendor.name,
                    contactEmail: r.existingVendor.contactEmail,
                    contactPhone: r.existingVendor.contactPhone,
                    gstNumber: r.existingVendor.gstNumber,
                    panNumber: r.existingVendor.panNumber,
                    isActive: r.existingVendor.isActive,
                    paymentTerms: r.existingVendor.paymentTerms,
                    address: r.existingVendor.Address[0] ?? null,
                },
                createdBy: r.createdBy,
                purchaseOrders: r.purchaseOrders,
                invoices: r.invoices,
                _count: r._count,
            },
        }
    } catch (e) {
        console.error("[getVpVendorById]", e)
        return { success: false, error: "Failed to fetch vendor" }
    }
}

// ── Fetch raw vendors not yet enrolled in VP (for the enroll dialog) ───────

export async function getUnenrolledVendors(): Promise<VpActionResult<{ id: string; name: string; contactEmail: string | null }[]>
> {
    try {
        // All existing vpVendor existingVendorIds
        const enrolled = await prisma.vpVendor.findMany({
            select: { existingVendorId: true },
        })
        const enrolledIds = enrolled.map((v) => v.existingVendorId)

        const vendors = await prisma.vendor.findMany({
            where: {
                isActive: true,
                id: { notIn: enrolledIds.length ? enrolledIds : undefined },
                users: {
                    some: { role: "VENDOR" }
                }
            },
            select: { id: true, name: true, contactEmail: true },
            orderBy: { name: "asc" },
        })

        return { success: true, data: vendors }
    } catch (e) {
        return { success: false, error: "Failed to fetch vendors" }
    }
}

// ── CREATE (enroll) ────────────────────────────────────────────

export async function enrollVpVendor(
    raw: VpVendorFormValues,
): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const parsed = vpVendorSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const d = parsed.data

    try {
        // Check not already enrolled
        const existing = await prisma.vpVendor.findFirst({
            where: { existingVendorId: d.existingVendorId },
        })
        if (existing) return { success: false, error: "This vendor is already enrolled in the portal" }

        const vpVendor = await prisma.vpVendor.create({
            data: {
                existingVendorId: d.existingVendorId,
                categoryId: d.categoryId || null,
                portalStatus: d.portalStatus,
                vendorType: d.vendorType,
                billingType: d.billingType?.join(",") || null,
                recurringCycle: d.billingType?.includes("RECURRING") ? (d.recurringCycle || null) : null,
                createdById: session.user.id,
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpVendor",
            entityId: vpVendor.id,
            newData: d,
            description: `Enrolled vendor ${d.existingVendorId} into portal`,
        })

        return { success: true, data: { id: vpVendor.id } }
    } catch (e) {
        console.error("[enrollVpVendor]", e)
        return { success: false, error: "Failed to enroll vendor" }
    }
}

// ── UPDATE ─────────────────────────────────────────────────────

export async function updateVpVendor(
    id: string,
    raw: VpVendorFormValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    const parsed = vpVendorSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const d = parsed.data

    try {
        const old = await prisma.vpVendor.findUnique({ where: { id } })
        if (!old) return { success: false, error: "Vendor not found" }

        await prisma.vpVendor.update({
            where: { id },
            data: {
                categoryId: d.categoryId || null,
                portalStatus: d.portalStatus,
                vendorType: d.vendorType,
                billingType: d.billingType?.join(",") || null,
                recurringCycle: d.billingType?.includes("RECURRING") ? (d.recurringCycle || null) : null,
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpVendor",
            entityId: id,
            oldData: old,
            newData: d,
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[updateVpVendor]", e)
        return { success: false, error: "Failed to update vendor" }
    }
}

// ── TOGGLE status (quick action) ───────────────────────────────

export async function toggleVpVendorStatus(
    id: string,
): Promise<VpActionResult<{ portalStatus: string }>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can change vendor status" }

    try {
        const vpv = await prisma.vpVendor.findUnique({
            where: { id }, select: { portalStatus: true },
        })
        if (!vpv) return { success: false, error: "Vendor not found" }

        const next = vpv.portalStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        await prisma.vpVendor.update({ where: { id }, data: { portalStatus: next } })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpVendor",
            entityId: id,
            description: `Status changed to ${next}`,
        })

        return { success: true, data: { portalStatus: next } }
    } catch (e) {
        return { success: false, error: "Failed to update status" }
    }
}