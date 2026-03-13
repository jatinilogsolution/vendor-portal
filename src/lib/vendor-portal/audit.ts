import { prisma } from "@/lib/prisma";

export async function logVpAudit(params: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ip?: string | null;
}) {
  const { userId, action, entityType, entityId, oldValue, newValue, ip } =
    params;

  return prisma.vpAuditLog.create({
    data: {
      userId: userId || null,
      action,
      entityType,
      entityId: entityId || null,
      oldValue: oldValue ? JSON.stringify(oldValue) : null,
      newValue: newValue ? JSON.stringify(newValue) : null,
      ip: ip || null,
    },
  });
}
