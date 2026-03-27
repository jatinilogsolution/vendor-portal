// src/lib/vendor-portal/notify.ts
import { prisma } from "@/lib/prisma"
import { VpEntityType, VpNotificationType } from "@/types/vendor-portal"

interface CreateVpNotifParams {
    userIds: string[]
    type: VpNotificationType
    message: string
    refDocType?: VpEntityType
    refDocId?: string
}

export async function createVpNotification(p: CreateVpNotifParams) {
    if (!p.userIds.length) return
    try {
        await prisma.vpNotification.createMany({
            data: p.userIds.map((userId) => ({
                userId,
                type: p.type,
                message: p.message,
                refDocType: p.refDocType ?? null,
                refDocId: p.refDocId ?? null,
                isRead: false,
            })),
        })
    } catch (e) {
        console.error("[createVpNotification]", e)
    }
}

export async function getInternalUserIds(): Promise<string[]> {
    const users = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "BOSS"] } },
        select: { id: true },
    })
    return users.map((u) => u.id)
}