"use server";

import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { revalidatePath } from "next/cache";
import { logVpAudit } from "@/lib/vendor-portal/audit";
import * as XLSX from "xlsx";

async function requireAdmin() {
  const { user } = await getCustomSession();
  if (!user || user.role !== UserRoleEnum.ADMIN) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getVpItemData() {
  await requireAdmin();
  const [items, categories] = await Promise.all([
    prisma.vpItem.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.vpCategory.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
  ]);

  return { items, categories };
}

export async function createVpItem(formData: FormData) {
  const user = await requireAdmin();

  const code = String(formData.get("code") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const uom = String(formData.get("uom") || "").trim();
  const defaultPriceRaw = String(formData.get("defaultPrice") || "").trim();
  const hsnCode = String(formData.get("hsnCode") || "").trim();
  const rawCategoryId = String(formData.get("categoryId") || "").trim();
  const categoryId = rawCategoryId && rawCategoryId !== "__none__" ? rawCategoryId : null;
  const description = String(formData.get("description") || "").trim();

  const defaultPrice = Number(defaultPriceRaw);

  if (!code || !name || !uom || Number.isNaN(defaultPrice)) {
    return { error: "Code, name, UOM, and default price are required." };
  }

  const item = await prisma.vpItem.create({
    data: {
      code,
      name,
      uom,
      defaultPrice,
      hsnCode: hsnCode || null,
      categoryId,
      description: description || null,
    },
  });

  await logVpAudit({
    userId: user.id,
    action: "CREATE",
    entityType: "VpItem",
    entityId: item.id,
    newValue: item,
  });

  revalidatePath("/vendor-portal/admin/items");
  return { success: true };
}

export async function bulkImportVpItems(formData: FormData) {
  const user = await requireAdmin();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { error: "Please upload a valid file." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    return { error: "No sheet found in file." };
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
    defval: "",
  });

  if (rows.length === 0) {
    return { error: "No rows found in file." };
  }

  const categories = await prisma.vpCategory.findMany({
    select: { id: true, name: true },
  });
  const categoryByName = new Map(
    categories.map((c) => [c.name.toLowerCase(), c.id])
  );

  const data: any[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const code = String(row.code || row.Code || "").trim();
    const name = String(row.name || row.Name || "").trim();
    const uom = String(row.uom || row.UOM || row.unit || "").trim();
    const defaultPriceRaw = row.default_price ?? row.defaultPrice ?? row.price ?? "";
    const hsnCode = String(row.hsn_code || row.hsnCode || row.hsn || "").trim();
    const description = String(row.description || row.Description || "").trim();
    const categoryName = String(row.category || row.Category || "").trim();
    const categoryIdRaw = String(row.category_id || row.categoryId || "").trim();

    const defaultPrice = Number(defaultPriceRaw);

    if (!code || !name || !uom || Number.isNaN(defaultPrice)) {
      errors.push(`Row ${index + 2}: Missing required fields (code, name, uom, default_price).`);
      return;
    }

    let categoryId: string | null = null;
    if (categoryIdRaw) categoryId = categoryIdRaw;
    else if (categoryName) categoryId = categoryByName.get(categoryName.toLowerCase()) || null;

    data.push({
      code,
      name,
      uom,
      defaultPrice,
      hsnCode: hsnCode || null,
      categoryId,
      description: description || null,
    });
  });

  if (data.length === 0) {
    return { error: "No valid rows to import.", errors };
  }

  const result = await prisma.vpItem.createMany({
    data,
  });

  await logVpAudit({
    userId: user.id,
    action: "IMPORT",
    entityType: "VpItem",
    newValue: { inserted: result.count, errors },
  });

  revalidatePath("/vendor-portal/admin/items");
  return { success: true, inserted: result.count, errors };
}
