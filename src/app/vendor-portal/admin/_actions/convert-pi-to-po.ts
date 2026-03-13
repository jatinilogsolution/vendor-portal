"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";

async function requireAdmin() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
}

async function generatePoNumber() {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;
  const last = await prisma.vpPurchaseOrder.findFirst({
    where: { poNumber: { startsWith: prefix } },
    orderBy: { createdAt: "desc" },
    select: { poNumber: true },
  });
  if (!last?.poNumber) return `${prefix}0001`;
  const parts = last.poNumber.split("-");
  const seq = Number(parts[2] || 0) + 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

/** Convert an approved/accepted PI into a new draft PO. Admin can then edit and submit. */
export async function convertPiToPo(piId: string): Promise<{ error?: string; poId?: string; success?: boolean }> {
  const user = await requireAdmin();

  const pi = await prisma.vpProformaInvoice.findUnique({
    where: { id: piId },
    include: { items: true },
  });

  if (!pi) return { error: "Proforma invoice not found." };
  if (pi.convertedToPoId) return { error: "This PI has already been converted to a PO." };
  if (!["APPROVED", "ACCEPTED", "SENT_TO_VENDOR"].includes(pi.status)) {
    return { error: "Only approved or accepted PIs can be converted to a PO." };
  }

  const poNumber = await generatePoNumber();
  const lineItemsData = pi.items.map((item) => ({
    itemId: item.itemId,
    description: item.description,
    qty: item.qty,
    unitPrice: item.unitPrice,
    total: item.total,
  }));

  const po = await prisma.vpPurchaseOrder.create({
    data: {
      poNumber,
      status: "DRAFT",
      notes: pi.notes,
      vendorId: pi.vendorId,
      categoryId: pi.categoryId,
      deliveryDate: null,
      deliveryAddress: null,
      taxRate: pi.taxRate,
      subtotal: pi.subtotal,
      taxAmount: pi.taxAmount,
      grandTotal: pi.grandTotal,
      createdById: user.id,
      items: {
        createMany: { data: lineItemsData },
      },
    },
  });

  await prisma.vpProformaInvoice.update({
    where: { id: piId },
    data: { convertedToPoId: po.id },
  });

  await logVpAudit({
    userId: user.id,
    action: "CONVERT_PI_TO_PO",
    entityType: "VpProformaInvoice",
    entityId: pi.id,
    newValue: { piId: pi.id, newPoId: po.id, poNumber },
  });

  revalidatePath("/vendor-portal/admin/proforma-invoices");
  revalidatePath("/vendor-portal/admin/purchase-orders");
  return { success: true, poId: po.id };
}
