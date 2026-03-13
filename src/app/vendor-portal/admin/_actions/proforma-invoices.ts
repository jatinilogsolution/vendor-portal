"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { createVpNotificationsForUserIds, getBossUserIds } from "@/lib/vendor-portal/notifications";

type PiLineItemInput = {
  itemId?: string | null;
  description: string;
  qty: number;
  unitPrice: number;
};

type CreatePiPayload = {
  vendorId: string;
  categoryId?: string | null;
  validityDate?: string | null;
  paymentTerms?: string | null;
  notes?: string | null;
  taxRate?: number;
  status: "DRAFT" | "SUBMITTED";
  items: PiLineItemInput[];
};

async function requireAdmin() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
}

function calculateTotals(items: PiLineItemInput[], taxRate: number) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const grandTotal = subtotal + taxAmount;
  return { subtotal, taxAmount, grandTotal };
}

async function generatePiNumber() {
  const year = new Date().getFullYear();
  const prefix = `PI-${year}-`;
  const last = await prisma.vpProformaInvoice.findFirst({
    where: { piNumber: { startsWith: prefix } },
    orderBy: { createdAt: "desc" },
    select: { piNumber: true },
  });

  if (!last?.piNumber) {
    return `${prefix}0001`;
  }

  const parts = last.piNumber.split("-");
  const seq = Number(parts[2] || 0) + 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export async function getVpProformaInvoiceData() {
  await requireAdmin();
  const [vendors, categories, items, proformaInvoices] = await Promise.all([
    prisma.vpVendor.findMany({
      include: { existingVendor: true },
      where: { portalStatus: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vpCategory.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
    prisma.vpItem.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.vpProformaInvoice.findMany({
      include: {
        vendor: { include: { existingVendor: true } },
        category: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { vendors, categories, items, proformaInvoices };
}

export async function createVpProformaInvoice(payload: CreatePiPayload) {
  const user = await requireAdmin();

  const vendorId = payload.vendorId?.trim();
  const categoryId =
    payload.categoryId && payload.categoryId !== "__none__"
      ? payload.categoryId
      : null;

  if (!vendorId) {
    return { error: "Vendor is required." };
  }

  if (!payload.items || payload.items.length === 0) {
    return { error: "At least one line item is required." };
  }

  const normalizedItems = payload.items
    .filter((item) => item.description && item.qty > 0 && item.unitPrice >= 0)
    .map((item) => ({
      itemId: item.itemId || null,
      description: item.description.trim(),
      qty: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      total: Number(item.qty) * Number(item.unitPrice),
    }));

  if (normalizedItems.length === 0) {
    return { error: "Line items are invalid." };
  }

  const taxRate = Number(payload.taxRate || 0);
  const totals = calculateTotals(normalizedItems, taxRate);
  const piNumber = await generatePiNumber();

  const pi = await prisma.vpProformaInvoice.create({
    data: {
      piNumber,
      status: payload.status,
      notes: payload.notes || null,
      vendorId,
      categoryId,
      validityDate: payload.validityDate
        ? new Date(payload.validityDate)
        : null,
      paymentTerms: payload.paymentTerms || null,
      taxRate,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      grandTotal: totals.grandTotal,
      createdById: user.id,
      submittedAt: payload.status === "SUBMITTED" ? new Date() : null,
      items: {
        createMany: {
          data: normalizedItems,
        },
      },
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "CREATE",
    entityType: "VpProformaInvoice",
    entityId: pi.id,
    newValue: { ...pi, items: normalizedItems },
  });

  revalidatePath("/vendor-portal/admin/proforma-invoices");
  return { success: true };
}

export async function submitVpProformaInvoice(piId: string) {
  const user = await requireAdmin();

  const existing = await prisma.vpProformaInvoice.findUnique({
    where: { id: piId },
  });

  if (!existing) return { error: "Proforma invoice not found." };
  if (existing.status !== "DRAFT") {
    return { error: "Only draft PIs can be submitted." };
  }

  const updated = await prisma.vpProformaInvoice.update({
    where: { id: piId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });

  await logVpAudit({
    userId: user.id,
    action: "SUBMIT",
    entityType: "VpProformaInvoice",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  const bossIds = await getBossUserIds();
  await createVpNotificationsForUserIds(bossIds, {
    type: "PI_SUBMITTED",
    message: `Proforma invoice ${existing.piNumber} submitted for approval.`,
    refDocType: "VpProformaInvoice",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/admin/proforma-invoices");
  return { success: true };
}
