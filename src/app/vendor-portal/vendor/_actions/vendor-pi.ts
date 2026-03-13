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

export async function getVendorProformaInvoices() {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return [];

  return prisma.vpProformaInvoice.findMany({
    where: { vendorId: vpVendorId, status: "SENT_TO_VENDOR" },
    include: { items: true },
    orderBy: { sentToVendorAt: "desc" },
  });
}

export async function acceptProformaInvoice(piId: string) {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return { error: "Vendor profile not found." };

  const existing = await prisma.vpProformaInvoice.findFirst({
    where: { id: piId, vendorId: vpVendorId },
  });
  if (!existing) return { error: "PI not found." };
  if (existing.status !== "SENT_TO_VENDOR") {
    return { error: "PI is not pending vendor response." };
  }

  const updated = await prisma.vpProformaInvoice.update({
    where: { id: piId },
    data: { status: "ACCEPTED", acceptedAt: new Date() },
  });

  await logVpAudit({
    userId: user.id,
    action: "ACCEPT",
    entityType: "VpProformaInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  revalidatePath("/vendor-portal/vendor/proforma-invoices");
  revalidatePath("/vendor-portal/admin/proforma-invoices");
  return { success: true };
}

export async function declineProformaInvoice(piId: string, reason: string) {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return { error: "Vendor profile not found." };

  const existing = await prisma.vpProformaInvoice.findFirst({
    where: { id: piId, vendorId: vpVendorId },
  });
  if (!existing) return { error: "PI not found." };
  if (existing.status !== "SENT_TO_VENDOR") {
    return { error: "PI is not pending vendor response." };
  }

  const updated = await prisma.vpProformaInvoice.update({
    where: { id: piId },
    data: {
      status: "DECLINED",
      declinedAt: new Date(),
      rejectionReason: reason || existing.rejectionReason || existing.notes,
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "DECLINE",
    entityType: "VpProformaInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: { ...updated, rejectionReason: reason },
  });

  revalidatePath("/vendor-portal/vendor/proforma-invoices");
  revalidatePath("/vendor-portal/admin/proforma-invoices");
  return { success: true };
}
