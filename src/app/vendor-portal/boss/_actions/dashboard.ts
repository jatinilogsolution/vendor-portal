"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";

async function requireBoss() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.BOSS) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getBossDashboardCounts() {
  await requireBoss();

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const [
    pendingPo,
    pendingPi,
    pendingInvoices,
    paymentQueueCount,
    poAgingOver3Days,
    invoiceAgingOver3Days,
  ] = await Promise.all([
    prisma.vpPurchaseOrder.count({ where: { status: "SUBMITTED" } }),
    prisma.vpProformaInvoice.count({ where: { status: "SUBMITTED" } }),
    prisma.vpInvoice.count({ where: { status: "SUBMITTED" } }),
    prisma.vpInvoice.count({
      where: {
        status: { in: ["APPROVED", "PAYMENT_INITIATED", "PAYMENT_PROCESSING", "PAYMENT_FAILED"] },
      },
    }),
    prisma.vpPurchaseOrder.count({
      where: { status: "SUBMITTED", submittedAt: { lt: threeDaysAgo } },
    }),
    prisma.vpInvoice.count({
      where: { status: "SUBMITTED", submittedAt: { lt: threeDaysAgo } },
    }),
  ]);

  return {
    pendingPo,
    pendingPi,
    pendingInvoices,
    paymentQueueCount,
    poAgingOver3Days,
    invoiceAgingOver3Days,
  };
}
