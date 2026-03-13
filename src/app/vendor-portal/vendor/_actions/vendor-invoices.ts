"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { createVpNotificationsForUserIds, getBossUserIds } from "@/lib/vendor-portal/notifications";
import { sendStatusChangeEmail } from "@/services/mail";

type InvoiceLineItemInput = {
  description: string;
  qty: number;
  unitPrice: number;
};

type CreateInvoicePayload = {
  type: "PDF" | "DIGITAL";
  invoiceNumber?: string | null;
  poId?: string | null;
  piId?: string | null;
  notes?: string | null;
  taxRate?: number;
  subtotal?: number;
  fileUrl?: string | null;
  lineItems?: InvoiceLineItemInput[];
};

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

async function getBossEmails() {
  const bosses = await prisma.user.findMany({
    where: { role: UserRoleEnum.BOSS },
    select: { email: true },
  });
  return bosses.map((boss) => boss.email).filter(Boolean);
}

export async function getVendorInvoiceData() {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) {
    return { vendor: null, purchaseOrders: [], proformaInvoices: [], invoices: [] };
  }

  const [vendor, purchaseOrders, proformaInvoices, invoices] = await Promise.all([
    prisma.vpVendor.findUnique({
      where: { id: vpVendorId },
      include: { existingVendor: true },
    }),
    prisma.vpPurchaseOrder.findMany({
      where: {
        vendorId: vpVendorId,
        status: { in: ["ACKNOWLEDGED", "SENT_TO_VENDOR", "APPROVED"] },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vpProformaInvoice.findMany({
      where: {
        vendorId: vpVendorId,
        status: { in: ["ACCEPTED", "SENT_TO_VENDOR", "APPROVED"] },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vpInvoice.findMany({
      where: { vendorId: vpVendorId },
      include: {
        documents: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { vendor, purchaseOrders, proformaInvoices, invoices };
}

export async function createVendorInvoice(payload: CreateInvoicePayload) {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return { error: "Vendor profile not found." };

  const poId = payload.poId || null;
  const piId = payload.piId || null;

  if (poId && piId) {
    return { error: "Link invoice to either a PO or a PI, not both." };
  }
  if (!poId && !piId) {
    return { error: "Please link the invoice to a PO or a PI." };
  }

  if (poId) {
    const po = await prisma.vpPurchaseOrder.findFirst({
      where: { id: poId, vendorId: vpVendorId },
      select: { id: true },
    });
    if (!po) return { error: "Purchase order not found." };
  }

  if (piId) {
    const pi = await prisma.vpProformaInvoice.findFirst({
      where: { id: piId, vendorId: vpVendorId },
      select: { id: true },
    });
    if (!pi) return { error: "Proforma invoice not found." };
  }

  const invoiceNumber = payload.invoiceNumber?.trim() || null;
  const notes = payload.notes?.trim() || null;
  const taxRate = Number(payload.taxRate || 0);

  if (payload.type === "PDF") {
    const fileUrl = payload.fileUrl?.trim();
    const subtotal = Number(payload.subtotal || 0);

    if (!fileUrl) return { error: "PDF invoice URL is required." };
    if (Number.isNaN(subtotal) || subtotal <= 0) {
      return { error: "Subtotal must be greater than zero." };
    }

    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    const invoice = await prisma.vpInvoice.create({
      data: {
        invoiceNumber,
        type: "PDF",
        status: "SUBMITTED",
        notes,
        vendorId: vpVendorId,
        poId,
        piId,
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        createdById: user.id,
        submittedAt: new Date(),
        documents: {
          create: [
            {
              filePath: fileUrl,
              uploadedById: user.id,
              uploadedAt: new Date(),
            },
          ],
        },
      },
    });

    await logVpAudit({
      userId: user.id,
      action: "SUBMIT",
      entityType: "VpInvoice",
      entityId: invoice.id,
      newValue: { ...invoice, fileUrl },
    });

    const bossIds = await getBossUserIds();
    await createVpNotificationsForUserIds(bossIds, {
      type: "INVOICE_SUBMITTED",
      message: `Invoice ${invoice.invoiceNumber || invoice.id} submitted for review.`,
      refDocType: "VpInvoice",
      refDocId: invoice.id,
    });
    try {
      const bossEmails = await getBossEmails();
      await sendStatusChangeEmail(
        bossEmails,
        null,
        {
          type: "Invoice",
          entityName: invoice.invoiceNumber || invoice.id,
          toStatus: "SUBMITTED",
          changedBy: user.name || user.email || "Vendor",
        },
      );
    } catch (error) {
      console.error("Invoice submit email failed:", error);
    }

    revalidatePath("/vendor-portal/vendor/invoices");
    revalidatePath("/vendor-portal/boss/approvals");
    revalidatePath("/vendor-portal/boss/payments");
    return { success: true };
  }

  const lineItems = payload.lineItems || [];
  const normalizedItems = lineItems
    .filter((item) => item.description && item.qty > 0 && item.unitPrice >= 0)
    .map((item) => ({
      description: item.description.trim(),
      qty: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      tax: 0,
      total: Number(item.qty) * Number(item.unitPrice),
    }));

  if (normalizedItems.length === 0) {
    return { error: "At least one valid line item is required." };
  }

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const invoice = await prisma.vpInvoice.create({
    data: {
      invoiceNumber,
      type: "DIGITAL",
      status: "SUBMITTED",
      notes,
      vendorId: vpVendorId,
      poId,
      piId,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      createdById: user.id,
      submittedAt: new Date(),
      lineItems: {
        createMany: { data: normalizedItems },
      },
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "SUBMIT",
    entityType: "VpInvoice",
    entityId: invoice.id,
    newValue: { ...invoice, items: normalizedItems },
  });

  const bossIds = await getBossUserIds();
  await createVpNotificationsForUserIds(bossIds, {
    type: "INVOICE_SUBMITTED",
    message: `Invoice ${invoice.invoiceNumber || invoice.id} submitted for review.`,
    refDocType: "VpInvoice",
    refDocId: invoice.id,
  });
  try {
    const bossEmails = await getBossEmails();
    await sendStatusChangeEmail(
      bossEmails,
      null,
      {
        type: "Invoice",
        entityName: invoice.invoiceNumber || invoice.id,
        toStatus: "SUBMITTED",
        changedBy: user.name || user.email || "Vendor",
      },
    );
  } catch (error) {
    console.error("Invoice submit email failed:", error);
  }

  revalidatePath("/vendor-portal/vendor/invoices");
  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/boss/payments");
  return { success: true };
}
