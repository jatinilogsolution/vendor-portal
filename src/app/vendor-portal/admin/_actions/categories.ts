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

export async function getVpCategories() {
  await requireAdmin();
  return prisma.vpCategory.findMany({
    include: { parent: true },
    orderBy: { name: "asc" },
  });
}

export async function createVpCategory(formData: FormData) {
  const user = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim();
  const rawParentId = String(formData.get("parentId") || "").trim();
  const parentId = rawParentId && rawParentId !== "__none__" ? rawParentId : null;

  if (!name) {
    return { error: "Category name is required" };
  }

  const category = await prisma.vpCategory.create({
    data: {
      name,
      code: code || null,
      parentId,
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "CREATE",
    entityType: "VpCategory",
    entityId: category.id,
    newValue: category,
  });

  revalidatePath("/vendor-portal/admin/categories");
  return { success: true };
}

export async function updateVpCategoryStatus(formData: FormData) {
  const user = await requireAdmin();

  const categoryId = String(formData.get("categoryId") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!categoryId) {
    return { error: "Category not found" };
  }

  const existing = await prisma.vpCategory.findUnique({
    where: { id: categoryId },
  });

  if (!existing) {
    return { error: "Category not found" };
  }

  const updated = await prisma.vpCategory.update({
    where: { id: categoryId },
    data: { status: status || existing.status },
  });

  await logVpAudit({
    userId: user.id,
    action: "UPDATE",
    entityType: "VpCategory",
    entityId: updated.id,
    oldValue: existing,
    newValue: updated,
  });

  revalidatePath("/vendor-portal/admin/categories");
  return { success: true };
}
