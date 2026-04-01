// src/actions/vp/recurring.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { VpActionResult } from "@/types/vendor-portal"

export type VpRecurringRow = {
    id: string
    sourceType: "SCHEDULE" | "BILLING_CONFIG"
    vendorId: string
    title: string
    cycle: string
    nextDueDate: Date
    isActive: boolean
    vendorName: string
    vendorRecurringCycle: string | null
    vendorCategoryNames: string[]
    lastInvoiceId: string | null
    invoiceCount: number
    recentInvoices: {
        id: string
        invoiceNumber: string | null
        status: string
        totalAmount: number
        createdAt: Date
    }[]
    itemsSnapshot: any[]
}

export type VpRecurringInvoiceRow = {
    id: string
    invoiceNumber: string | null
    vendorId: string
    vendorName: string
    recurringScheduleId: string | null
    recurringTitle: string | null
    recurringCycle: string | null
    totalAmount: number
    status: string
    createdAt: Date
    submittedAt: Date | null
    approvedAt: Date | null
    parentInvoiceId: string | null
    latestPaymentStatus: string | null
    latestPaymentDate: Date | null
    paymentState: "PAID" | "IN_PROGRESS" | "UNPAID"
    isOverdue: boolean
}

function mapAssignedVendorCategoryNames(source: {
    category: { name: string } | null
    categories: { category: { name: string } }[]
}): string[] {
    return [...new Set([
        source.category?.name ?? null,
        ...source.categories.map((row) => row.category.name),
    ].filter((name): name is string => Boolean(name)))]
}

function addCycle(date: Date, cycle: string | null | undefined) {
    const next = new Date(date)
    if (cycle === "MONTHLY") next.setMonth(next.getMonth() + 1)
    else if (cycle === "QUARTERLY") next.setMonth(next.getMonth() + 3)
    else if (cycle === "YEARLY") next.setFullYear(next.getFullYear() + 1)
    return next
}

function buildConfigTitle(params: {
    vendorName: string
    categoryNames: string[]
}) {
    if (params.categoryNames.length === 1) {
        return `${params.vendorName} - ${params.categoryNames[0]}`
    }
    return `${params.vendorName} recurring bills`
}

function mapRecurringInvoiceSnapshots(invoice: {
    lineItems: {
        description: string
        qty: number
        unitPrice: number
    }[]
} | null | undefined) {
    return (invoice?.lineItems ?? []).map((item) => ({
        description: item.description,
        qty: item.qty,
        unitPrice: item.unitPrice,
    }))
}

function mapRecurringPaymentState(params: {
    invoiceStatus: string
    latestPaymentStatus: string | null
}): "PAID" | "IN_PROGRESS" | "UNPAID" {
    if (
        params.invoiceStatus === "PAYMENT_CONFIRMED"
        || params.latestPaymentStatus === "COMPLETED"
    ) {
        return "PAID"
    }

    if (
        params.invoiceStatus === "PAYMENT_INITIATED"
        || ["INITIATED", "PROCESSING"].includes(params.latestPaymentStatus ?? "")
    ) {
        return "IN_PROGRESS"
    }

    return "UNPAID"
}

function mapRecurringInvoiceRow(invoice: {
    id: string
    invoiceNumber: string | null
    totalAmount: number
    status: string
    createdAt: Date
    submittedAt: Date | null
    approvedAt: Date | null
    parentInvoiceId: string | null
    recurringScheduleId: string | null
    recurringSchedule: { title: string; cycle: string } | null
    payments: {
        status: string
        paymentDate: Date | null
        createdAt: Date
    }[]
    vendor: {
        id: string
        recurringCycle: string | null
        existingVendor: { name: string }
    }
}): VpRecurringInvoiceRow {
    const recurringCycle = invoice.recurringSchedule?.cycle ?? invoice.vendor.recurringCycle ?? null
    const latestPayment = invoice.payments[0] ?? null
    const paymentState = mapRecurringPaymentState({
        invoiceStatus: invoice.status,
        latestPaymentStatus: latestPayment?.status ?? null,
    })
    const isOverdue = paymentState === "UNPAID" && recurringCycle
        ? addCycle(invoice.createdAt, recurringCycle).getTime() < Date.now()
        : false

    return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        vendorId: invoice.vendor.id,
        vendorName: invoice.vendor.existingVendor.name,
        recurringScheduleId: invoice.recurringScheduleId,
        recurringTitle: invoice.recurringSchedule?.title ?? null,
        recurringCycle,
        totalAmount: invoice.totalAmount,
        status: invoice.status,
        createdAt: invoice.createdAt,
        submittedAt: invoice.submittedAt,
        approvedAt: invoice.approvedAt,
        parentInvoiceId: invoice.parentInvoiceId,
        latestPaymentStatus: latestPayment?.status ?? null,
        latestPaymentDate: latestPayment?.paymentDate ?? latestPayment?.createdAt ?? null,
        paymentState,
        isOverdue,
    }
}

function mapScheduleRow(s: {
    id: string
    title: string
    cycle: string
    nextDueDate: Date
    isActive: boolean
    lastInvoiceId: string | null
    itemsSnapshot: string
    invoices: {
        id: string
        invoiceNumber: string | null
        status: string
        totalAmount: number
        createdAt: Date
    }[]
    _count: { invoices: number }
    vendor: {
        id: string
        recurringCycle: string | null
        category: { name: string } | null
        categories: { category: { name: string } }[]
        existingVendor: { name: string }
    }
}): VpRecurringRow {
    return {
        id: s.id,
        sourceType: "SCHEDULE",
        vendorId: s.vendor.id,
        title: s.title,
        cycle: s.cycle,
        nextDueDate: s.nextDueDate,
        isActive: s.isActive,
        vendorName: s.vendor.existingVendor.name,
        vendorRecurringCycle: s.vendor.recurringCycle,
        vendorCategoryNames: mapAssignedVendorCategoryNames(s.vendor),
        lastInvoiceId: s.lastInvoiceId,
        invoiceCount: s._count.invoices,
        recentInvoices: s.invoices,
        itemsSnapshot: JSON.parse(s.itemsSnapshot) as any[],
    }
}

function mapVendorConfigRow(vendor: {
    id: string
    createdAt: Date
    recurringCycle: string | null
    category: { name: string } | null
    categories: { category: { name: string } }[]
    existingVendor: { name: string }
    invoices: {
        id: string
        invoiceNumber: string | null
        status: string
        totalAmount: number
        createdAt: Date
        lineItems: {
            description: string
            qty: number
            unitPrice: number
        }[]
    }[]
}): VpRecurringRow {
    const vendorCategoryNames = mapAssignedVendorCategoryNames(vendor)
    const recentInvoices = vendor.invoices.slice(0, 3).map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        totalAmount: invoice.totalAmount,
        createdAt: invoice.createdAt,
    }))
    const latestInvoice = vendor.invoices[0]
    const nextDueDate = latestInvoice
        ? addCycle(latestInvoice.createdAt, vendor.recurringCycle)
        : new Date()

    return {
        id: `config-${vendor.id}`,
        sourceType: "BILLING_CONFIG",
        vendorId: vendor.id,
        title: buildConfigTitle({
            vendorName: vendor.existingVendor.name,
            categoryNames: vendorCategoryNames,
        }),
        cycle: vendor.recurringCycle ?? "OTHER",
        nextDueDate,
        isActive: true,
        vendorName: vendor.existingVendor.name,
        vendorRecurringCycle: vendor.recurringCycle,
        vendorCategoryNames,
        lastInvoiceId: latestInvoice?.id ?? null,
        invoiceCount: vendor.invoices.length,
        recentInvoices,
        itemsSnapshot: mapRecurringInvoiceSnapshots(latestInvoice),
    }
}

async function getRecurringConfigRows(params: { vendorId?: string }) {
    const vendors = await prisma.vpVendor.findMany({
        where: {
            portalStatus: "ACTIVE",
            billingType: { contains: "RECURRING" },
            recurringCycle: { not: null },
            ...(params.vendorId ? { id: params.vendorId } : {}),
        },
        select: {
            id: true,
            createdAt: true,
            recurringCycle: true,
            category: { select: { name: true } },
            categories: {
                select: { category: { select: { name: true } } },
                orderBy: { category: { name: "asc" } },
            },
            existingVendor: { select: { name: true } },
            recurringSchedules: {
                where: { isActive: true },
                select: { id: true },
            },
            invoices: {
                where: { billType: "RECURRING" },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    invoiceNumber: true,
                    status: true,
                    totalAmount: true,
                    createdAt: true,
                    lineItems: {
                        select: {
                            description: true,
                            qty: true,
                            unitPrice: true,
                        },
                    },
                },
            },
        },
    })

    return vendors
        .filter((vendor) => vendor.recurringSchedules.length === 0)
        .map(mapVendorConfigRow)
}

async function getRecurringInvoiceRows(params: { vendorId?: string }) {
    const rows = await prisma.vpInvoice.findMany({
        where: {
            billType: "RECURRING",
            ...(params.vendorId ? { vendorId: params.vendorId } : {}),
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            submittedAt: true,
            approvedAt: true,
            parentInvoiceId: true,
            recurringScheduleId: true,
            recurringSchedule: {
                select: {
                    title: true,
                    cycle: true,
                },
            },
            payments: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: {
                    status: true,
                    paymentDate: true,
                    createdAt: true,
                },
            },
            vendor: {
                select: {
                    id: true,
                    recurringCycle: true,
                    existingVendor: {
                        select: { name: true },
                    },
                },
            },
        },
    })

    return rows.map(mapRecurringInvoiceRow)
}

// ── Fetch recurring schedules for vendor ───────────────────────

export async function getMyRecurringSchedules(): Promise<VpActionResult<VpRecurringRow[]>
> {
    const session = await getCustomSession()
    const user = await prisma.user.findUnique({
        where: { id: session.user.id }, select: { vendorId: true },
    })
    const vpv = user?.vendorId
        ? await prisma.vpVendor.findFirst({
            where: { existingVendorId: user.vendorId }, select: { id: true },
        })
        : null

    if (!vpv) return { success: true, data: [] }

    try {
        const [schedules, configRows] = await Promise.all([
            prisma.vpRecurringSchedule.findMany({
            where: { vendorId: vpv.id, isActive: true },
            select: {
                id: true,
                title: true,
                cycle: true,
                nextDueDate: true,
                isActive: true,
                lastInvoiceId: true,
                itemsSnapshot: true,
                invoices: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        status: true,
                        totalAmount: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 3,
                },
                _count: { select: { invoices: true } },
                vendor: {
                    select: {
                        id: true,
                        recurringCycle: true,
                        category: { select: { name: true } },
                        categories: {
                            select: { category: { select: { name: true } } },
                            orderBy: { category: { name: "asc" } },
                        },
                        existingVendor: { select: { name: true } },
                    },
                },
            },
            orderBy: { nextDueDate: "asc" },
            }),
            getRecurringConfigRows({ vendorId: vpv.id }),
        ])

        return {
            success: true,
            data: [...schedules.map(mapScheduleRow), ...configRows]
                .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime()),
        }
    } catch (e) {
        console.error("[getMyRecurringSchedules]", e)
        return { success: false, error: "Failed to fetch recurring bills" }
    }
}

export async function getMyRecurringInvoices(): Promise<VpActionResult<VpRecurringInvoiceRow[]>> {
    const session = await getCustomSession()
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { vendorId: true },
    })
    const vpv = user?.vendorId
        ? await prisma.vpVendor.findFirst({
            where: { existingVendorId: user.vendorId },
            select: { id: true },
        })
        : null

    if (!vpv) return { success: true, data: [] }

    try {
        return {
            success: true,
            data: await getRecurringInvoiceRows({ vendorId: vpv.id }),
        }
    } catch (e) {
        console.error("[getMyRecurringInvoices]", e)
        return { success: false, error: "Failed to fetch recurring invoices" }
    }
}

// ── Admin: fetch all recurring schedules ──────────────────────

export async function getAllRecurringSchedules(): Promise<VpActionResult<VpRecurringRow[]>
> {
    try {
        const [schedules, configRows] = await Promise.all([
            prisma.vpRecurringSchedule.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                cycle: true,
                nextDueDate: true,
                isActive: true,
                lastInvoiceId: true,
                itemsSnapshot: true,
                invoices: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        status: true,
                        totalAmount: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 3,
                },
                _count: { select: { invoices: true } },
                vendor: {
                    select: {
                        id: true,
                        recurringCycle: true,
                        category: { select: { name: true } },
                        categories: {
                            select: { category: { select: { name: true } } },
                            orderBy: { category: { name: "asc" } },
                        },
                        existingVendor: { select: { name: true } },
                    },
                },
            },
            orderBy: { nextDueDate: "asc" },
            }),
            getRecurringConfigRows({}),
        ])

        return {
            success: true,
            data: [...schedules.map(mapScheduleRow), ...configRows]
                .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime()),
        }
    } catch (e) {
        console.error("[getAllRecurringSchedules]", e)
        return { success: false, error: "Failed to fetch recurring bills" }
    }
}

export async function getAllRecurringInvoices(): Promise<VpActionResult<VpRecurringInvoiceRow[]>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    try {
        return {
            success: true,
            data: await getRecurringInvoiceRows({}),
        }
    } catch (e) {
        console.error("[getAllRecurringInvoices]", e)
        return { success: false, error: "Failed to fetch recurring invoices" }
    }
}

// ── Create recurring schedule (admin sets up for a vendor) ─────

export async function createRecurringSchedule(data: {
    vendorId: string
    title: string
    cycle: "MONTHLY" | "QUARTERLY" | "YEARLY"
    startDate: string
    items: { description: string; qty: number; unitPrice: number }[]
}): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!["ADMIN", "BOSS"].includes(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    try {
        const schedule = await prisma.vpRecurringSchedule.create({
            data: {
                vendorId: data.vendorId,
                title: data.title,
                cycle: data.cycle,
                nextDueDate: new Date(data.startDate),
                isActive: true,
                itemsSnapshot: JSON.stringify(data.items),
            },
        })
        return { success: true, data: { id: schedule.id } }
    } catch (e) {
        console.error("[createRecurringSchedule]", e)
        return { success: false, error: "Failed to create recurring schedule" }
    }
}

// ── Bump next due date after invoice raised ────────────────────

export async function bumpRecurringSchedule(scheduleId: string, invoiceId: string) {
    const schedule = await prisma.vpRecurringSchedule.findUnique({
        where: { id: scheduleId }, select: { cycle: true, nextDueDate: true },
    })
    if (!schedule) return

    const next = new Date(schedule.nextDueDate)
    if (schedule.cycle === "MONTHLY") next.setMonth(next.getMonth() + 1)
    if (schedule.cycle === "QUARTERLY") next.setMonth(next.getMonth() + 3)
    if (schedule.cycle === "YEARLY") next.setFullYear(next.getFullYear() + 1)

    await prisma.vpRecurringSchedule.update({
        where: { id: scheduleId },
        data: { nextDueDate: next, lastInvoiceId: invoiceId },
    })
}
