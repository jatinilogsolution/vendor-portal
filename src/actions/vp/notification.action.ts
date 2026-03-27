// src/actions/vp/notification.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { VpActionResult, VpListResult } from "@/types/vendor-portal"

export type VpNotifRow = {
    id: string
    type: string
    message: string
    isRead: boolean
    refDocType: string | null
    refDocId: string | null
    createdAt: Date
}

// ── READ notifications for current user ────────────────────────

export async function getMyVpNotifications(params: {
    unreadOnly?: boolean
    page?: number
    per_page?: number
} = {}): Promise<VpActionResult<VpListResult<VpNotifRow>>> {
    try {
        const session = await getCustomSession()
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 30)
        const skip = (page - 1) * per_page

        const where: any = { userId: session.user.id }
        if (params.unreadOnly) where.isRead = false

        const [total, rows] = await Promise.all([
            prisma.vpNotification.count({ where }),
            prisma.vpNotification.findMany({
                where, skip, take: per_page,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    type: true,
                    message: true,
                    isRead: true,
                    refDocType: true,
                    refDocId: true,
                    createdAt: true,
                },
            }),
        ])

        return {
            success: true,
            data: {
                data: rows,
                meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
            },
        }
    } catch (e) {
        console.error("[getMyVpNotifications]", e)
        return { success: false, error: "Failed to fetch notifications" }
    }
}

// ── Unread count (for bell badge) ─────────────────────────────

export async function getUnreadVpNotifCount(): Promise<VpActionResult<{ count: number }>> {
    try {
        const session = await getCustomSession()
        const count = await prisma.vpNotification.count({
            where: { userId: session.user.id, isRead: false },
        })
        return { success: true, data: { count } }
    } catch (e) {
        return { success: false, error: "Failed to count notifications" }
    }
}

// ── MARK single as read ────────────────────────────────────────

export async function markVpNotifRead(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    await prisma.vpNotification.updateMany({
        where: { id, userId: session.user.id },
        data: { isRead: true },
    })
    return { success: true, data: null }
}

// ── MARK ALL as read ───────────────────────────────────────────

export async function markAllVpNotifsRead(): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    await prisma.vpNotification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true },
    })
    return { success: true, data: null }
}

// ── DELETE single ──────────────────────────────────────────────

export async function deleteVpNotif(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    await prisma.vpNotification.deleteMany({
        where: { id, userId: session.user.id },
    })
    return { success: true, data: null }
}