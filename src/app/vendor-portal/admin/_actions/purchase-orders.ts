"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { createVpNotificationsForUserIds, getBossUserIds } from "@/lib/vendor-portal/notifications";

type PoLineItemInput = {
  itemId?: string | null;
  description: string;
  qty: number;
  unitPrice: number;
};

type CreatePoPayload = {
  vendorId: string;
  categoryId?: string | null;
  deliveryDate?: string | null;
  deliveryAddress?: string | null;
  notes?: string | null;
  taxRate?: number;
  status: "DRAFT" | "SUBMITTED";
  items: PoLineItemInput[];
};

async function requireAdmin() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
}

function calculateTotals(items: PoLineItemInput[], taxRate: number) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const grandTotal = subtotal + taxAmount;
  return { subtotal, taxAmount, grandTotal };
}

async function generatePoNumber() {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;
  const last = await prisma.vpPurchaseOrder.findFirst({
    where: { poNumber: { startsWith: prefix } },
    orderBy: { createdAt: "desc" },
    select: { poNumber: true },
  });

  if (!last?.poNumber) {
    return `${prefix}0001`;
  }

  const parts = last.poNumber.split("-");
  const seq = Number(parts[2] || 0) + 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export async function getVpPurchaseOrderData() {
  await requireAdmin();
  const [vendors, categories, items, purchaseOrders] = await Promise.all([
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
    prisma.vpPurchaseOrder.findMany({
      include: {
        vendor: { include: { existingVendor: true } },
        category: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { vendors, categories, items, purchaseOrders };
}

export async function createVpPurchaseOrder(payload: CreatePoPayload) {
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
  const poNumber = await generatePoNumber();

  const po = await prisma.vpPurchaseOrder.create({
    data: {
      poNumber,
      status: payload.status,
      notes: payload.notes || null,
      vendorId,
      categoryId,
      deliveryDate: payload.deliveryDate
        ? new Date(payload.deliveryDate)
        : null,
      deliveryAddress: payload.deliveryAddress || null,
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
    entityType: "VpPurchaseOrder",
    entityId: po.id,
    newValue: { ...po, items: normalizedItems },
  });

  revalidatePath("/vendor-portal/admin/purchase-orders");
  return { success: true };
}

export async function submitVpPurchaseOrder(poId: string) {
  const user = await requireAdmin();

  const existing = await prisma.vpPurchaseOrder.findUnique({
    where: { id: poId },
  });

  if (!existing) return { error: "Purchase order not found." };
  if (existing.status !== "DRAFT") {
    return { error: "Only draft POs can be submitted." };
  }

  const updated = await prisma.vpPurchaseOrder.update({
    where: { id: poId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });

  await logVpAudit({
    userId: user.id,
    action: "SUBMIT",
    entityType: "VpPurchaseOrder",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  const bossIds = await getBossUserIds();
  await createVpNotificationsForUserIds(bossIds, {
    type: "PO_SUBMITTED",
    message: `Purchase order ${existing.poNumber} submitted for approval.`,
    refDocType: "VpPurchaseOrder",
    refDocId: updated.id,
  });

  revalidatePath("/vendor-portal/admin/purchase-orders");
  return { success: true };
}
