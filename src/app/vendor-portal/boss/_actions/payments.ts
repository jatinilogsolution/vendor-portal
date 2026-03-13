"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { createVpNotificationsForUserIds, getVendorUserIds } from "@/lib/vendor-portal/notifications";
import { sendStatusChangeEmail } from "@/services/mail";

type InitiatePaymentPayload = {
  invoiceId: string;
  amount?: number;
  paymentMode?: string | null;
  transactionRef?: string | null;
};

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

export async function getBossPaymentsData() {
  await requireBoss();
  const invoices = await prisma.vpInvoice.findMany({
    where: {
      status: {
        in: ["APPROVED", "PAYMENT_INITIATED", "PAYMENT_PROCESSING", "PAYMENT_FAILED"],
      },
    },
    include: {
      vendor: { include: { existingVendor: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return { invoices };
}

export async function initiatePayment(payload: InitiatePaymentPayload) {
  const user = await requireBoss();

  const invoiceId = payload.invoiceId?.trim();
  if (!invoiceId) return { error: "Invoice is required." };

  const invoice = await prisma.vpInvoice.findUnique({
    where: { id: invoiceId },
    include: {
      vendor: {
        include: { existingVendor: { include: { users: { select: { email: true } } } } },
      },
    },
  });

  if (!invoice) return { error: "Invoice not found." };
  if (!["APPROVED", "PAYMENT_FAILED"].includes(invoice.status)) {
    return { error: "Invoice is not ready for payment initiation." };
  }

  const alreadyCompleted = await prisma.vpPayment.findFirst({
    where: { invoiceId: invoice.id, status: "COMPLETED" },
    select: { id: true },
  });
  if (alreadyCompleted) {
    return { error: "Payment is already completed for this invoice." };
  }

  const amount = Number(payload.amount || invoice.totalAmount);
  if (Number.isNaN(amount) || amount <= 0) {
    return { error: "Payment amount must be greater than zero." };
  }

  const payment = await prisma.vpPayment.create({
    data: {
      invoiceId: invoice.id,
      amount,
      paymentMode: payload.paymentMode?.trim() || null,
      transactionRef: payload.transactionRef?.trim() || null,
      status: "INITIATED",
      initiatedById: user.id,
    },
  });

  const updatedInvoice = await prisma.vpInvoice.update({
    where: { id: invoice.id },
    data: { status: "PAYMENT_INITIATED" },
  });

  await logVpAudit({
    userId: user.id,
    action: "CREATE",
    entityType: "VpPayment",
    entityId: payment.id,
    newValue: { payment, invoice: updatedInvoice },
  });

  try {
    const vendorEmail = resolveVendorEmail(invoice.vendor);
    if (vendorEmail) {
      await sendStatusChangeEmail(vendorEmail, invoice.vendorId, {
        type: "Invoice",
        entityName: invoice.invoiceNumber || invoice.id,
        toStatus: "PAYMENT_INITIATED",
        changedBy: user.name || user.email || "Boss",
      });
    }
  } catch (error) {
    console.error("Payment initiation email failed:", error);
  }

  revalidatePath("/vendor-portal/boss/payments");
  revalidatePath("/vendor-portal/vendor/payments");
  revalidatePath("/vendor-portal/vendor/invoices");
  return { success: true };
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "PROCESSING" | "COMPLETED" | "FAILED",
  transactionRef?: string
) {
  const user = await requireBoss();

  const payment = await prisma.vpPayment.findUnique({
    where: { id: paymentId },
    include: {
      invoice: {
        include: {
          vendor: {
            include: { existingVendor: { include: { users: { select: { email: true } } } } },
          },
        },
      },
    },
  });

  if (!payment) return { error: "Payment not found." };

  const updated = await prisma.vpPayment.update({
    where: { id: paymentId },
    data: {
      status,
      transactionRef: transactionRef?.trim() || payment.transactionRef,
      paymentDate: status === "COMPLETED" ? new Date() : payment.paymentDate,
    },
  });

  let nextInvoiceStatus = payment.invoice.status;
  if (status === "COMPLETED") nextInvoiceStatus = "PAYMENT_CONFIRMED";
  if (status === "PROCESSING") nextInvoiceStatus = "PAYMENT_PROCESSING";
  if (status === "FAILED") nextInvoiceStatus = "PAYMENT_FAILED";

  const updatedInvoice = await prisma.vpInvoice.update({
    where: { id: payment.invoiceId },
    data: { status: nextInvoiceStatus },
  });

  await logVpAudit({
    userId: user.id,
    action: "UPDATE",
    entityType: "VpPayment",
    entityId: updated.id,
    oldValue: payment,
    newValue: { payment: updated, invoice: updatedInvoice },
  });

  if (status === "COMPLETED") {
    const vendorUserIds = await getVendorUserIds(payment.invoice.vendorId);
    await createVpNotificationsForUserIds(vendorUserIds, {
      type: "PAYMENT_CONFIRMED",
      message: `Payment confirmed for invoice ${payment.invoice.invoiceNumber || payment.invoice.id}.`,
      refDocType: "VpInvoice",
      refDocId: payment.invoice.id,
    });
  }

  try {
    const vendorEmail = resolveVendorEmail(payment.invoice.vendor);
    if (vendorEmail) {
      await sendStatusChangeEmail(vendorEmail, payment.invoice.vendorId, {
        type: "Invoice",
        entityName: payment.invoice.invoiceNumber || payment.invoice.id,
        toStatus: nextInvoiceStatus,
        changedBy: user.name || user.email || "Boss",
      });
    }
  } catch (error) {
    console.error("Payment status email failed:", error);
  }

  revalidatePath("/vendor-portal/boss/payments");
  revalidatePath("/vendor-portal/vendor/payments");
  revalidatePath("/vendor-portal/vendor/invoices");
  return { success: true };
}
