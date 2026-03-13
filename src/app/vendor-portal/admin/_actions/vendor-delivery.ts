"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { createVpNotificationsForUserIds, getVendorUserIds } from "@/lib/vendor-portal/notifications";

async function requireAdmin() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function sendPoToVendor(poId: string) {
  const user = await requireAdmin();
  const existing = await prisma.vpPurchaseOrder.findUnique({
    where: { id: poId },
  });
  if (!existing) return { error: "PO not found." };
  if (existing.status !== "APPROVED") {
    return { error: "Only approved POs can be sent to vendor." };
  }

  const updated = await prisma.vpPurchaseOrder.update({
    where: { id: poId },
    data: { status: "SENT_TO_VENDOR", sentToVendorAt: new Date() },
  });

  await logVpAudit({
    userId: user.id,
    action: "SEND_TO_VENDOR",
    entityType: "VpPurchaseOrder",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  const vendorUserIds = await getVendorUserIds(existing.vendorId);
  await createVpNotificationsForUserIds(vendorUserIds, {
    type: "PO_SENT_TO_VENDOR",
    message: `Purchase order ${existing.poNumber} is ready for your acknowledgement.`,
    refDocType: "VpPurchaseOrder",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/admin/purchase-orders");
  revalidatePath("/vendor-portal/vendor/purchase-orders");
  return { success: true };
}

export async function sendPiToVendor(piId: string) {
  const user = await requireAdmin();
  const existing = await prisma.vpProformaInvoice.findUnique({
    where: { id: piId },
  });
  if (!existing) return { error: "PI not found." };
  if (existing.status !== "APPROVED") {
    return { error: "Only approved PIs can be sent to vendor." };
  }

  const updated = await prisma.vpProformaInvoice.update({
    where: { id: piId },
    data: { status: "SENT_TO_VENDOR", sentToVendorAt: new Date() },
  });

  await logVpAudit({
    userId: user.id,
    action: "SEND_TO_VENDOR",
    entityType: "VpProformaInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  const vendorUserIds = await getVendorUserIds(existing.vendorId);
  await createVpNotificationsForUserIds(vendorUserIds, {
    type: "PI_SENT_TO_VENDOR",
    message: `Proforma invoice ${existing.piNumber} is ready for your response.`,
    refDocType: "VpProformaInvoice",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/admin/proforma-invoices");
  revalidatePath("/vendor-portal/vendor/proforma-invoices");
  return { success: true };
}
