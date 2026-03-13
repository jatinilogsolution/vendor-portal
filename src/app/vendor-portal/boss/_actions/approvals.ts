"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { createVpNotification, createVpNotificationsForUserIds, getVendorUserIds } from "@/lib/vendor-portal/notifications";
import { sendApprovalEmail, sendRejectionEmail } from "@/services/mail";

async function requireBoss() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.BOSS) {
    throw new Error("Unauthorized");
  }
  return user;
}

function resolveVendorEmail(vendor: {
  existingVendor?: { contactEmail?: string | null; users?: { email: string }[] };
}) {
  return (
    vendor.existingVendor?.contactEmail?.trim() ||
    vendor.existingVendor?.users?.[0]?.email ||
    ""
  );
}

export async function getBossApprovalQueues() {
  await requireBoss();
  const [purchaseOrders, proformaInvoices, invoices] = await Promise.all([
    prisma.vpPurchaseOrder.findMany({
      where: { status: "SUBMITTED" },
      include: {
        vendor: { include: { existingVendor: true } },
        items: true,
      },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.vpProformaInvoice.findMany({
      where: { status: "SUBMITTED" },
      include: {
        vendor: { include: { existingVendor: true } },
        items: true,
      },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.vpInvoice.findMany({
      where: { status: "SUBMITTED" },
      include: {
        vendor: { include: { existingVendor: true } },
        documents: true,
      },
      orderBy: { submittedAt: "desc" },
    }),
  ]);

  return { purchaseOrders, proformaInvoices, invoices };
}

export async function approvePurchaseOrder(poId: string) {
  const user = await requireBoss();
  const existing = await prisma.vpPurchaseOrder.findUnique({
    where: { id: poId },
  });
  if (!existing) return { error: "PO not found." };
  if (existing.status !== "SUBMITTED") {
    return { error: "PO is not awaiting approval." };
  }

  const updated = await prisma.vpPurchaseOrder.update({
    where: { id: poId },
    data: {
      status: "APPROVED",
      approvedById: user.id,
      approvedAt: new Date(),
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "APPROVE",
    entityType: "VpPurchaseOrder",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  await createVpNotification({
    userId: existing.createdById,
    type: "PO_APPROVED",
    message: `Purchase order ${existing.poNumber} has been approved.`,
    refDocType: "VpPurchaseOrder",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/admin/purchase-orders");
  return { success: true };
}

export async function rejectPurchaseOrder(poId: string, reason: string) {
  const user = await requireBoss();
  const existing = await prisma.vpPurchaseOrder.findUnique({
    where: { id: poId },
  });
  if (!existing) return { error: "PO not found." };
  if (existing.status !== "SUBMITTED") {
    return { error: "PO is not awaiting approval." };
  }

  const updated = await prisma.vpPurchaseOrder.update({
    where: { id: poId },
    data: {
      status: "REJECTED",
      approvedById: user.id,
      approvedAt: new Date(),
      rejectionReason: reason || existing.rejectionReason || existing.notes,
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "REJECT",
    entityType: "VpPurchaseOrder",
    entityId: updated.id,
    oldValue: existing,
    newValue: { ...updated, rejectionReason: reason },
  });

  await createVpNotification({
    userId: existing.createdById,
    type: "PO_REJECTED",
    message: `Purchase order ${existing.poNumber} was rejected.`,
    refDocType: "VpPurchaseOrder",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/admin/purchase-orders");
  return { success: true };
}

export async function approveProformaInvoice(piId: string) {
  const user = await requireBoss();
  const existing = await prisma.vpProformaInvoice.findUnique({
    where: { id: piId },
  });
  if (!existing) return { error: "PI not found." };
  if (existing.status !== "SUBMITTED") {
    return { error: "PI is not awaiting approval." };
  }

  const updated = await prisma.vpProformaInvoice.update({
    where: { id: piId },
    data: {
      status: "APPROVED",
      approvedById: user.id,
      approvedAt: new Date(),
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "APPROVE",
    entityType: "VpProformaInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  await createVpNotification({
    userId: existing.createdById,
    type: "PI_APPROVED",
    message: `Proforma invoice ${existing.piNumber} has been approved.`,
    refDocType: "VpProformaInvoice",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/admin/proforma-invoices");
  return { success: true };
}

export async function rejectProformaInvoice(piId: string, reason: string) {
  const user = await requireBoss();
  const existing = await prisma.vpProformaInvoice.findUnique({
    where: { id: piId },
  });
  if (!existing) return { error: "PI not found." };
  if (existing.status !== "SUBMITTED") {
    return { error: "PI is not awaiting approval." };
  }

  const updated = await prisma.vpProformaInvoice.update({
    where: { id: piId },
    data: {
      status: "REJECTED",
      approvedById: user.id,
      approvedAt: new Date(),
      rejectionReason: reason || existing.rejectionReason || existing.notes,
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "REJECT",
    entityType: "VpProformaInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: { ...updated, rejectionReason: reason },
  });

  await createVpNotification({
    userId: existing.createdById,
    type: "PI_REJECTED",
    message: `Proforma invoice ${existing.piNumber} was rejected.`,
    refDocType: "VpProformaInvoice",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/admin/proforma-invoices");
  return { success: true };
}

export async function approveVendorInvoice(invoiceId: string) {
  const user = await requireBoss();
  const existing = await prisma.vpInvoice.findUnique({
    where: { id: invoiceId },
    include: {
      vendor: {
        include: { existingVendor: { include: { users: { select: { email: true } } } } },
      },
    },
  });
  if (!existing) return { error: "Invoice not found." };
  if (existing.status !== "SUBMITTED") {
    return { error: "Invoice is not awaiting approval." };
  }

  const updated = await prisma.vpInvoice.update({
    where: { id: invoiceId },
    data: {
      status: "APPROVED",
      reviewedById: user.id,
      approvedAt: new Date(),
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "APPROVE",
    entityType: "VpInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  const vendorUserIds = await getVendorUserIds(existing.vendorId);
  await createVpNotificationsForUserIds(vendorUserIds, {
    type: "INVOICE_APPROVED",
    message: `Invoice ${existing.invoiceNumber || existing.id} has been approved.`,
    refDocType: "VpInvoice",
    refDocId: updated.id,
  });

  try {
    const vendorEmail = resolveVendorEmail(existing.vendor);
    if (vendorEmail) {
      await sendApprovalEmail(vendorEmail, existing.vendorId, {
        type: "Invoice",
        entityName: existing.invoiceNumber || existing.id,
        approvedBy: user.name || user.email || "Boss",
        nextStep: "Payment initiation in progress.",
      });
    }
  } catch (error) {
    console.error("Invoice approval email failed:", error);
  }

  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/vendor/invoices");
  revalidatePath("/vendor-portal/boss/payments");
  return { success: true };
}

export async function rejectVendorInvoice(invoiceId: string, reason: string) {
  const user = await requireBoss();
  const existing = await prisma.vpInvoice.findUnique({
    where: { id: invoiceId },
    include: {
      vendor: {
        include: { existingVendor: { include: { users: { select: { email: true } } } } },
      },
    },
  });
  if (!existing) return { error: "Invoice not found." };
  if (existing.status !== "SUBMITTED") {
    return { error: "Invoice is not awaiting approval." };
  }

  const trimmedReason = reason?.trim();
  const nextNotes =
    trimmedReason && trimmedReason.length > 0
      ? [existing.notes?.trim(), `Rejection: ${trimmedReason}`]
          .filter(Boolean)
          .join("\n")
      : existing.notes;

  const updated = await prisma.vpInvoice.update({
    where: { id: invoiceId },
    data: {
      status: "REJECTED",
      reviewedById: user.id,
      rejectedAt: new Date(),
      notes: nextNotes,
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "REJECT",
    entityType: "VpInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: { ...updated, rejectionReason: trimmedReason },
  });

  const vendorUserIds = await getVendorUserIds(existing.vendorId);
  await createVpNotificationsForUserIds(vendorUserIds, {
    type: "INVOICE_REJECTED",
    message: `Invoice ${existing.invoiceNumber || existing.id} was rejected.`,
    refDocType: "VpInvoice",
    refDocId: updated.id,
  });

  try {
    const vendorEmail = resolveVendorEmail(existing.vendor);
    if (vendorEmail) {
      await sendRejectionEmail(vendorEmail, existing.vendorId, {
        type: "Invoice",
        entityName: existing.invoiceNumber || existing.id,
        reason: trimmedReason || "No reason provided.",
        rejectedBy: user.name || user.email || "Boss",
      });
    }
  } catch (error) {
    console.error("Invoice rejection email failed:", error);
  }

  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/vendor/invoices");
  return { success: true };
}

export async function requestVendorInvoiceRevision(invoiceId: string, reason: string) {
  const user = await requireBoss();
  const existing = await prisma.vpInvoice.findUnique({
    where: { id: invoiceId },
    include: {
      vendor: {
        include: { existingVendor: { include: { users: { select: { email: true } } } } },
      },
    },
  });
  if (!existing) return { error: "Invoice not found." };
  if (existing.status !== "SUBMITTED") {
    return { error: "Invoice is not awaiting review." };
  }

  const trimmedReason = reason?.trim() || "Revision requested.";
  const nextNotes = [existing.notes?.trim(), `Revision: ${trimmedReason}`]
    .filter(Boolean)
    .join("\n");

  const updated = await prisma.vpInvoice.update({
    where: { id: invoiceId },
    data: {
      status: "REVISION_REQUESTED",
      reviewedById: user.id,
      notes: nextNotes,
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "REVISION_REQUESTED",
    entityType: "VpInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: { ...updated, revisionReason: trimmedReason },
  });

  const vendorUserIds = await getVendorUserIds(existing.vendorId);
  await createVpNotificationsForUserIds(vendorUserIds, {
    type: "INVOICE_REVISION_REQUESTED",
    message: `Revision requested for invoice ${existing.invoiceNumber || existing.id}.`,
    refDocType: "VpInvoice",
    refDocId: updated.id,
  });

  try {
    const vendorEmail = resolveVendorEmail(existing.vendor);
    if (vendorEmail) {
      await sendRejectionEmail(vendorEmail, existing.vendorId, {
        type: "Invoice",
        entityName: existing.invoiceNumber || existing.id,
        reason: trimmedReason,
        rejectedBy: user.name || user.email || "Boss",
      });
    }
  } catch (error) {
    console.error("Revision request email failed:", error);
  }

  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/vendor/invoices");
  return { success: true };
}
