"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";

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

export async function getVendorPaymentsData() {
  const user = await requireVendor();
  const vpVendorId = await getVpVendorIdForUser(user.id);
  if (!vpVendorId) return { invoices: [] };

  const invoices = await prisma.vpInvoice.findMany({
    where: { vendorId: vpVendorId },
    include: {
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return { invoices };
}
