import { prisma } from "@/lib/prisma";

export type VpNotificationType =
  | "PO_SUBMITTED"
  | "PO_APPROVED"
  | "PO_REJECTED"
  | "PO_SENT_TO_VENDOR"
  | "PI_SUBMITTED"
  | "PI_APPROVED"
  | "PI_REJECTED"
  | "PI_SENT_TO_VENDOR"
  | "INVOICE_SUBMITTED"
  | "INVOICE_APPROVED"
  | "INVOICE_REJECTED"
  | "INVOICE_REVISION_REQUESTED"
  | "PAYMENT_CONFIRMED";

export async function createVpNotification(params: {
  userId: string;
  type: string;
  message: string;
  refDocType?: string | null;
  refDocId?: string | null;
}) {
  const { userId, type, message, refDocType, refDocId } = params;
  return prisma.vpNotification.create({
    data: {
      userId,
      type,
      message,
      refDocType: refDocType ?? null,
      refDocId: refDocId ?? null,
    },
  });
}

export async function createVpNotificationsForUserIds(
  userIds: string[],
  params: Omit<Parameters<typeof createVpNotification>[0], "userId">
) {
  if (userIds.length === 0) return;
  await prisma.vpNotification.createMany({
    data: userIds.map((userId) => ({
      userId,
      type: params.type,
      message: params.message,
      refDocType: params.refDocType ?? null,
      refDocId: params.refDocId ?? null,
    })),
  });
}

export async function getBossUserIds(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { role: "BOSS" },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

export async function getAdminUserIds(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

/** Get user IDs linked to a vendor (User.vendorId = existingVendorId). */
export async function getVendorUserIds(vpVendorId: string): Promise<string[]> {
  const vp = await prisma.vpVendor.findUnique({
    where: { id: vpVendorId },
    select: { existingVendorId: true },
  });
  if (!vp) return [];
  const users = await prisma.user.findMany({
    where: { vendorId: vp.existingVendorId },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

export async function getVpNotificationsForUser(userId: string, limit = 20) {
  return prisma.vpNotification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUnreadVpNotificationCount(userId: string) {
  return prisma.vpNotification.count({
    where: { userId, isRead: false },
  });
}

export async function markVpNotificationRead(id: string) {
  return prisma.vpNotification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllVpNotificationsRead(userId: string) {
  return prisma.vpNotification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
