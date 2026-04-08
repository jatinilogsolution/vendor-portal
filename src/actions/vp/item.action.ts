// src/actions/vp/item.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { getVpVendorCategoryOptions } from "@/lib/vendor-portal/category"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { itemSchema, ItemFormValues } from "@/validations/vp/item"

export type VpItemRow = {
    id: string
    code: string
    name: string
    uom: string
    defaultPrice: number
    hsnCode: string | null
    description: string | null
    categoryId: string | null
    categoryName: string | null
    _count: { poLineItems: number; piLineItems: number }
}

export type VpInvoiceSelectableItem = {
    id: string
    code: string
    name: string
    uom: string
    defaultPrice: number
    description: string | null
    categoryId: string | null
    categoryName: string | null
}

// ── READ ───────────────────────────────────────────────────────
export async function getVpItems(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpItemRow>>> {
    try {
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.search) {
            where.OR = [
                { id: { contains: params.search } },
                { name: { contains: params.search } },
                { code: { contains: params.search } },
                { hsnCode: { contains: params.search } },
                { description: { contains: params.search } },
            ]
        }
        if (params.categoryId) where.categoryId = params.categoryId

        const [total, rows] = await Promise.all([
            prisma.vpItem.count({ where }),
            prisma.vpItem.findMany({
                where,
                skip,
                take: per_page,
                select: {
                    id: true,
                    code: true,
                    name: true,
                    uom: true,
                    defaultPrice: true,
                    hsnCode: true,
                    description: true,
                    categoryId: true,
                    category: { select: { name: true } },
                    _count: { select: { poLineItems: true, piLineItems: true } },
                },
                orderBy: { name: "asc" },
            }),
        ])

        return {
            success: true,
            data: {
                data: rows.map((r) => ({
                    id: r.id,
                    code: r.code,
                    name: r.name,
                    uom: r.uom,
                    defaultPrice: r.defaultPrice,
                    hsnCode: r.hsnCode,
                    description: r.description,
                    categoryId: r.categoryId,
                    categoryName: r.category?.name ?? null,
                    _count: r._count,
                })),
                meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
            },
        }
    } catch (e) {
        console.error("[getVpItems]", e)
        return { success: false, error: "Failed to fetch items" }
    }
}

// For select dropdowns (filtered by category)
export async function getVpItemsForSelect(
    categoryIds?: string | string[],
): Promise<VpActionResult<{ id: string; code: string; name: string; uom: string; defaultPrice: number }[]>
> {
    try {
        const normalizedCategoryIds = Array.isArray(categoryIds)
            ? [...new Set(categoryIds.filter(Boolean))]
            : categoryIds ? [categoryIds] : []
        const items = await prisma.vpItem.findMany({
            where: normalizedCategoryIds.length > 0
                ? { categoryId: { in: normalizedCategoryIds } }
                : undefined,
            select: { id: true, code: true, name: true, uom: true, defaultPrice: true },
            orderBy: { name: "asc" },
        })
        return { success: true, data: items }
    } catch (e) {
        return { success: false, error: "Failed to fetch items" }
    }
}

export async function getMyVpInvoiceItemOptions(): Promise<VpActionResult<VpInvoiceSelectableItem[]>> {
    try {
        const session = await getCustomSession()
        if (session.user.role !== "VENDOR") {
            return { success: false, error: "Only vendors can access invoice item options" }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { vendorId: true },
        })
        if (!user?.vendorId) {
            return { success: false, error: "Your account is not linked to a vendor. Contact admin." }
        }

        const vpVendor = await prisma.vpVendor.findFirst({
            where: { existingVendorId: user.vendorId },
            select: { id: true },
        })
        if (!vpVendor) {
            return { success: false, error: "Vendor configuration not found" }
        }

        const assignedCategories = await getVpVendorCategoryOptions(vpVendor.id)
        if (!assignedCategories) {
            return { success: false, error: "Vendor configuration not found" }
        }

        const categoryIds = [...new Set(assignedCategories.map((category) => category.id).filter(Boolean))]
        if (categoryIds.length === 0) {
            return { success: true, data: [] }
        }

        const items = await prisma.vpItem.findMany({
            where: { categoryId: { in: categoryIds } },
            select: {
                id: true,
                code: true,
                name: true,
                uom: true,
                defaultPrice: true,
                description: true,
                categoryId: true,
                category: { select: { name: true } },
            },
            orderBy: [
                { category: { name: "asc" } },
                { name: "asc" },
            ],
        })

        return {
            success: true,
            data: items.map((item) => ({
                id: item.id,
                code: item.code,
                name: item.name,
                uom: item.uom,
                defaultPrice: item.defaultPrice,
                description: item.description,
                categoryId: item.categoryId,
                categoryName: item.category?.name ?? null,
            })),
        }
    } catch (e) {
        console.error("[getMyVpInvoiceItemOptions]", e)
        return { success: false, error: "Failed to fetch invoice items" }
    }
}

// ── CREATE ─────────────────────────────────────────────────────
export async function createVpItem(raw: ItemFormValues): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) return { success: false, error: "Insufficient permissions" }

    const parsed = itemSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const { code, name, uom, defaultPrice, hsnCode, description, categoryId } = parsed.data

    try {
        const existing = await prisma.vpItem.findFirst({ where: { code } })
        if (existing) return { success: false, error: "An item with this code already exists" }

        const item = await prisma.vpItem.create({
            data: {
                code,
                name,
                uom,
                defaultPrice,
                hsnCode: hsnCode || null,
                description: description || null,
                categoryId: categoryId || null,
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpItem",
            entityId: item.id,
            newData: parsed.data,
            description: `Created item: ${name} (${code})`,
        })

        return { success: true, data: { id: item.id } }
    } catch (e) {
        console.error("[createVpItem]", e)
        return { success: false, error: "Failed to create item" }
    }
}

// ── UPDATE ─────────────────────────────────────────────────────
export async function updateVpItem(
    id: string,
    raw: ItemFormValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) return { success: false, error: "Insufficient permissions" }

    const parsed = itemSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const { code, name, uom, defaultPrice, hsnCode, description, categoryId } = parsed.data

    try {
        const old = await prisma.vpItem.findUnique({ where: { id } })
        if (!old) return { success: false, error: "Item not found" }

        // Code uniqueness check (excluding self)
        if (code !== old.code) {
            const dup = await prisma.vpItem.findFirst({ where: { code, id: { not: id } } })
            if (dup) return { success: false, error: "An item with this code already exists" }
        }

        await prisma.vpItem.update({
            where: { id },
            data: {
                code, name, uom, defaultPrice,
                hsnCode: hsnCode || null,
                description: description || null,
                categoryId: categoryId || null,
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpItem",
            entityId: id,
            oldData: old,
            newData: parsed.data,
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[updateVpItem]", e)
        return { success: false, error: "Failed to update item" }
    }
}

// ── DELETE ─────────────────────────────────────────────────────
export async function deleteVpItem(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) return { success: false, error: "Insufficient permissions" }

    try {
        const item = await prisma.vpItem.findUnique({
            where: { id },
            select: { name: true, _count: { select: { poLineItems: true, piLineItems: true } } },
        })
        if (!item) return { success: false, error: "Item not found" }

        const used = item._count.poLineItems + item._count.piLineItems
        if (used > 0)
            return { success: false, error: `This item is used in ${used} PO/PI line item(s). Remove them first.` }

        await prisma.vpItem.delete({ where: { id } })

        await logVpAudit({
            userId: session.user.id,
            action: "DELETE",
            entityType: "VpItem",
            entityId: id,
            description: `Deleted item: ${item.name}`,
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[deleteVpItem]", e)
        return { success: false, error: "Failed to delete item" }
    }
}
