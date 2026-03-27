// src/actions/vp/recurring.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { VpActionResult } from "@/types/vendor-portal"

export type VpRecurringRow = {
    id: string
    title: string
    cycle: string
    nextDueDate: Date
    isActive: boolean
    vendorName: string
    lastInvoiceId: string | null
    itemsSnapshot: any[]
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
        const schedules = await prisma.vpRecurringSchedule.findMany({
            where: { vendorId: vpv.id, isActive: true },
            select: {
                id: true,
                title: true,
                cycle: true,
                nextDueDate: true,
                isActive: true,
                lastInvoiceId: true,
                itemsSnapshot: true,
                vendor: { select: { existingVendor: { select: { name: true } } } },
            },
            orderBy: { nextDueDate: "asc" },
        })

        return {
            success: true,
            data: schedules.map((s) => ({
                id: s.id,
                title: s.title,
                cycle: s.cycle,
                nextDueDate: s.nextDueDate,
                isActive: s.isActive,
                vendorName: s.vendor.existingVendor.name,
                lastInvoiceId: s.lastInvoiceId,
                itemsSnapshot: JSON.parse(s.itemsSnapshot) as any[],
            })),
        }
    } catch (e) {
        return { success: false, error: "Failed to fetch recurring schedules" }
    }
}

// ── Admin: fetch all recurring schedules ──────────────────────

export async function getAllRecurringSchedules(): Promise<VpActionResult<VpRecurringRow[]>
> {
    try {
        const schedules = await prisma.vpRecurringSchedule.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                cycle: true,
                nextDueDate: true,
                isActive: true,
                lastInvoiceId: true,
                itemsSnapshot: true,
                vendor: { select: { existingVendor: { select: { name: true } } } },
            },
            orderBy: { nextDueDate: "asc" },
        })

        return {
            success: true,
            data: schedules.map((s) => ({
                id: s.id,
                title: s.title,
                cycle: s.cycle,
                nextDueDate: s.nextDueDate,
                isActive: s.isActive,
                vendorName: s.vendor.existingVendor.name,
                lastInvoiceId: s.lastInvoiceId,
                itemsSnapshot: JSON.parse(s.itemsSnapshot) as any[],
            })),
        }
    } catch (e) {
        return { success: false, error: "Failed to fetch schedules" }
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