"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { sendStatusChangeEmail } from "@/services/mail";

type InvoiceLineItemInput = {
  description: string;
  qty: number;
  unitPrice: number;
};

async function requireAdmin() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
}

async function getBossEmails() {
  const bosses = await prisma.user.findMany({
    where: { role: UserRoleEnum.BOSS },
    select: { email: true },
  });
  return bosses.map((b) => b.email).filter(Boolean);
}

export async function getAdminInvoiceData() {
  await requireAdmin();

  const [vendors, invoices] = await Promise.all([
    prisma.vpVendor.findMany({
      where: { portalStatus: "ACTIVE" },
      include: { existingVendor: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vpInvoice.findMany({
      include: {
        vendor: { include: { existingVendor: true } },
        purchaseOrder: { select: { poNumber: true } },
        proformaInvoice: { select: { piNumber: true } },
        createdBy: { select: { name: true, email: true } },
        documents: { select: { id: true } },
        payments: { select: { id: true, status: true }, orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { vendors, invoices };
}

/** Fetch POs and PIs for a given vp vendor (for dropdowns when creating invoice). */
export async function getPosAndPisForVendor(vendorId: string) {
  await requireAdmin();

  const [purchaseOrders, proformaInvoices] = await Promise.all([
    prisma.vpPurchaseOrder.findMany({
      where: { vendorId },
      select: { id: true, poNumber: true, status: true, grandTotal: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vpProformaInvoice.findMany({
      where: { vendorId },
      select: { id: true, piNumber: true, status: true, grandTotal: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { purchaseOrders, proformaInvoices };
}

type CreateInvoiceForVendorPayload = {
  vendorId: string;
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

export async function createInvoiceForVendor(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const user = await requireAdmin();

  const vendorId = String(formData.get("vendorId") || "").trim();
  if (!vendorId) return { error: "Vendor is required." };

  const type = (formData.get("type") as "PDF" | "DIGITAL") || "DIGITAL";
  const invoiceNumber = String(formData.get("invoiceNumber") || "").trim() || null;
  const poIdRaw = String(formData.get("poId") || "").trim();
  const piIdRaw = String(formData.get("piId") || "").trim();
  const poId = poIdRaw && poIdRaw !== "__none__" ? poIdRaw : null;
  const piId = piIdRaw && piIdRaw !== "__none__" ? piIdRaw : null;
  const notes = String(formData.get("notes") || "").trim() || null;
  const taxRate = Number(formData.get("taxRate") || 0);

  if (poId && piId) return { error: "Link to either a PO or a PI, not both." };

  const vendor = await prisma.vpVendor.findFirst({
    where: { id: vendorId },
    select: { id: true },
  });
  if (!vendor) return { error: "Vendor not found." };

  if (poId) {
    const po = await prisma.vpPurchaseOrder.findFirst({
      where: { id: poId, vendorId },
      select: { id: true },
    });
    if (!po) return { error: "Purchase order not found for this vendor." };
  }
  if (piId) {
    const pi = await prisma.vpProformaInvoice.findFirst({
      where: { id: piId, vendorId },
      select: { id: true },
    });
    if (!pi) return { error: "Proforma invoice not found for this vendor." };
  }

  if (type === "PDF") {
    const fileUrl = String(formData.get("fileUrl") || "").trim();
    const subtotal = Number(formData.get("subtotal") || 0);
    if (!fileUrl) return { error: "PDF file URL is required." };
    if (Number.isNaN(subtotal) || subtotal <= 0) return { error: "Subtotal must be greater than zero." };

    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    const invoice = await prisma.vpInvoice.create({
      data: {
        invoiceNumber,
        type: "PDF",
        status: "SUBMITTED",
        notes,
        vendorId,
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
      action: "CREATE",
      entityType: "VpInvoice",
      entityId: invoice.id,
      newValue: { ...invoice, fileUrl },
    });

    try {
      const bossEmails = await getBossEmails();
      await sendStatusChangeEmail(bossEmails, null, {
        type: "Invoice",
        entityName: invoice.invoiceNumber || invoice.id,
        toStatus: "SUBMITTED",
        changedBy: user.name || user.email || "Admin",
      });
    } catch (e) {
      console.error("Invoice submit email failed:", e);
    }

    revalidatePath("/vendor-portal/admin/invoices");
    revalidatePath("/vendor-portal/vendor/invoices");
    revalidatePath("/vendor-portal/boss/approvals");
    revalidatePath("/vendor-portal/boss/payments");
    return { success: true };
  }

  const lineItemsRaw = formData.get("lineItems");
  let lineItems: InvoiceLineItemInput[] = [];
  if (lineItemsRaw && typeof lineItemsRaw === "string") {
    try {
      lineItems = JSON.parse(lineItemsRaw) as InvoiceLineItemInput[];
    } catch {
      lineItems = [];
    }
  }

  const normalizedItems = lineItems
    .filter((item) => item?.description && item.qty > 0 && item.unitPrice >= 0)
    .map((item) => ({
      description: String(item.description).trim(),
      qty: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      tax: 0,
      total: Number(item.qty) * Number(item.unitPrice),
    }));

  if (normalizedItems.length === 0) return { error: "At least one valid line item is required." };

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const invoice = await prisma.vpInvoice.create({
    data: {
      invoiceNumber,
      type: "DIGITAL",
      status: "SUBMITTED",
      notes,
      vendorId,
      poId,
      piId,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      createdById: user.id,
      submittedAt: new Date(),
      lineItems: { createMany: { data: normalizedItems } },
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "CREATE",
    entityType: "VpInvoice",
    entityId: invoice.id,
    newValue: { ...invoice, items: normalizedItems },
  });

  try {
    const bossEmails = await getBossEmails();
    await sendStatusChangeEmail(bossEmails, null, {
      type: "Invoice",
      entityName: invoice.invoiceNumber || invoice.id,
      toStatus: "SUBMITTED",
      changedBy: user.name || user.email || "Admin",
    });
  } catch (e) {
    console.error("Invoice submit email failed:", e);
  }

  revalidatePath("/vendor-portal/admin/invoices");
  revalidatePath("/vendor-portal/vendor/invoices");
  revalidatePath("/vendor-portal/boss/approvals");
  revalidatePath("/vendor-portal/boss/payments");
  return { success: true };
}
