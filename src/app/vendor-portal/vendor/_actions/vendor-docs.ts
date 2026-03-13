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

export async function getVendorDocumentsData() {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return { vendor: null, invoices: [] };

  const vendor = await prisma.vpVendor.findUnique({
    where: { id: vpVendorId },
    include: { existingVendor: true },
  });

  const invoices = await prisma.vpInvoice.findMany({
    where: { vendorId: vpVendorId },
    include: { documents: true },
    orderBy: { createdAt: "desc" },
  });

  return { vendor, invoices };
}

export async function uploadVendorDocument(formData: FormData) {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return { error: "Vendor profile not found." };

  const invoiceId = String(formData.get("invoiceId") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  const fileName = String(formData.get("fileName") || "").trim();

  if (!invoiceId || !fileUrl) {
    return { error: "Invoice and file URL are required." };
  }

  const invoice = await prisma.vpInvoice.findFirst({
    where: { id: invoiceId, vendorId: vpVendorId },
  });

  if (!invoice) {
    return { error: "Invoice not found." };
  }

  const document = await prisma.vpInvoiceDocument.create({
    data: {
      invoiceId,
      filePath: fileUrl,
      uploadedById: user.id,
      uploadedAt: new Date(),
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "UPLOAD_DOCUMENT",
    entityType: "VpInvoiceDocument",
    entityId: document.id,
    newValue: { invoiceId, fileUrl, fileName },
  });

  revalidatePath("/vendor-portal/vendor/documents");
  return { success: true };
}
