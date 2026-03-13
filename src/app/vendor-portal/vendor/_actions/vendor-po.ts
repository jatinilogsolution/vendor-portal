"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";

async function requireVendor() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.VENDOR) {
    throw new Error("Unauthorized");
  }
  return user;
}

async function getVpVendorIdForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vendorId: true },
  });
  if (!user?.vendorId) return null;
  const vpVendor = await prisma.vpVendor.findFirst({
    where: { existingVendorId: user.vendorId },
  });
  return vpVendor?.id || null;
}

export async function getVendorPurchaseOrders() {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return [];

  return prisma.vpPurchaseOrder.findMany({
    where: { vendorId: vpVendorId, status: "SENT_TO_VENDOR" },
    include: { items: true },
    orderBy: { sentToVendorAt: "desc" },
  });
}

export async function acknowledgePurchaseOrder(poId: string) {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return { error: "Vendor profile not found." };

  const existing = await prisma.vpPurchaseOrder.findFirst({
    where: { id: poId, vendorId: vpVendorId },
  });
  if (!existing) return { error: "PO not found." };
  if (existing.status !== "SENT_TO_VENDOR") {
    return { error: "PO is not pending acknowledgement." };
  }

  const updated = await prisma.vpPurchaseOrder.update({
    where: { id: poId },
    data: { status: "ACKNOWLEDGED", acknowledgedAt: new Date() },
  });

  await logVpAudit({
    userId: user.id,
    action: "ACKNOWLEDGE",
    entityType: "VpPurchaseOrder",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  revalidatePath("/vendor-portal/vendor/purchase-orders");
  revalidatePath("/vendor-portal/admin/purchase-orders");
  return { success: true };
}
