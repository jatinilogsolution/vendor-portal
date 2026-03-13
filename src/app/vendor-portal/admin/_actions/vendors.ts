"use server";

import { prisma } from "@/lib/prisma";

import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import { Prisma } from "@/generated/prisma/client";

async function requireAdmin() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getVendorPortalVendorData() {
  await requireAdmin();

  const [vendors, vpVendors, categories] = await Promise.all([
    prisma.vendor.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.vpVendor.findMany({
      include: {
        existingVendor: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vpCategory.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
  ]);

  return { vendors, vpVendors, categories };
}

export async function createVpVendorProfile(formData: FormData) {
  const user = await requireAdmin();

  const existingVendorId = String(formData.get("existingVendorId") || "").trim();
  const rawCategoryId = String(formData.get("categoryId") || "").trim();
  const vendorType = String(formData.get("vendorType") || "STANDARD").trim();
  const rawBillingType = String(formData.get("billingType") || "").trim();
  const rawRecurringCycle = String(formData.get("recurringCycle") || "").trim();

  const categoryId = rawCategoryId && rawCategoryId !== "__none__" ? rawCategoryId : null;
  const billingType = rawBillingType && rawBillingType !== "__none__" ? rawBillingType : null;
  const recurringCycle = rawRecurringCycle && rawRecurringCycle !== "__none__" ? rawRecurringCycle : null;

  if (!existingVendorId) {
    return { error: "Vendor is required" };
  }

  const existing = await prisma.vpVendor.findFirst({
    where: { existingVendorId },
  });

  if (existing) {
    return { error: "Portal profile already exists for this vendor" };
  }

  try {
    const vpVendor = await prisma.vpVendor.create({
      data: {
        existingVendorId,
        categoryId,
        vendorType: vendorType || "STANDARD",
        billingType,
        recurringCycle,
        createdById: user.id,
      },
    });

    await logVpAudit({
      userId: user.id,
      action: "CREATE",
      entityType: "VpVendor",
      entityId: vpVendor.id,
      newValue: vpVendor,
    });

    revalidatePath("/vendor-portal/admin/vendors");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Portal profile already exists for this vendor." };
      }
    }
    return { error: "Failed to create vendor profile." };
  }
}

export async function updateVpVendorProfile(formData: FormData) {
  const user = await requireAdmin();

  const vpVendorId = String(formData.get("vpVendorId") || "").trim();
  const portalStatus = String(formData.get("portalStatus") || "").trim();
  const rawCategoryId = String(formData.get("categoryId") || "").trim();
  const vendorType = String(formData.get("vendorType") || "").trim();
  const rawBillingType = String(formData.get("billingType") || "").trim();
  const rawRecurringCycle = String(formData.get("recurringCycle") || "").trim();

  const categoryId = rawCategoryId && rawCategoryId !== "__none__" ? rawCategoryId : null;
  const billingType = rawBillingType && rawBillingType !== "__none__" ? rawBillingType : null;
  const recurringCycle = rawRecurringCycle && rawRecurringCycle !== "__none__" ? rawRecurringCycle : null;

  if (!vpVendorId) {
    return { error: "Vendor profile not found" };
  }

  const existing = await prisma.vpVendor.findUnique({
    where: { id: vpVendorId },
  });

  if (!existing) {
    return { error: "Vendor profile not found" };
  }

  try {
    const updated = await prisma.vpVendor.update({
      where: { id: vpVendorId },
      data: {
        portalStatus: portalStatus || existing.portalStatus,
        categoryId,
        vendorType: vendorType || existing.vendorType,
        billingType,
        recurringCycle,
      },
    });

    await logVpAudit({
      userId: user.id,
      action: "UPDATE",
      entityType: "VpVendor",
      entityId: updated.id,
      oldValue: existing,
      newValue: updated,
    });

    revalidatePath("/vendor-portal/admin/vendors");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update vendor profile." };
  }
}
