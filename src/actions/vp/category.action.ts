// src/actions/vp/category.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { VpActionResult } from "@/types/vendor-portal"
import { categorySchema, CategoryFormValues } from "@/validations/vp/category"

// ── Types ──────────────────────────────────────────────────────
export type VpCategoryRow = {
    id: string
    name: string
    code: string | null
    status: string
    parentId: string | null
    parentName: string | null
    _count: {
        children: number
        vendors: number
        items: number
    }
}

export type VpCategoryFlat = VpCategoryRow & { depth: number; children: VpCategoryFlat[] }

// ── Helpers ────────────────────────────────────────────────────
function buildTree(rows: VpCategoryRow[], parentId: string | null = null, depth = 0): VpCategoryFlat[] {
    return rows
        .filter((r) => r.parentId === parentId)
        .map((r) => ({
            ...r,
            depth,
            children: buildTree(rows, r.id, depth + 1),
        }))
}

// ── READ ───────────────────────────────────────────────────────
export async function getVpCategories(): Promise<VpActionResult<VpCategoryFlat[]>> {
    try {
        const rows = await prisma.vpCategory.findMany({
            select: {
                id: true,
                name: true,
                code: true,
                status: true,
                parentId: true,
                parent: { select: { name: true } },
                _count: { select: { children: true, vendors: true, items: true } },
            },
            orderBy: [{ parentId: "asc" }, { name: "asc" }],
        })

        const flat: VpCategoryRow[] = rows.map((r) => ({
            id: r.id,
            name: r.name,
            code: r.code,
            status: r.status,
            parentId: r.parentId,
            parentName: r.parent?.name ?? null,
            _count: r._count,
        }))

        return { success: true, data: buildTree(flat) }
    } catch (e) {
        console.error("[getVpCategories]", e)
        return { success: false, error: "Failed to fetch categories" }
    }
}

// Flat list for selects/comboboxes
export async function getVpCategoriesFlat(): Promise<VpActionResult<{ id: string; name: string; code: string | null; parentId: string | null }[]>
> {
    try {
        const rows = await prisma.vpCategory.findMany({
            where: { status: "ACTIVE" },
            select: { id: true, name: true, code: true, parentId: true },
            orderBy: { name: "asc" },
        })
        return { success: true, data: rows }
    } catch (e) {
        return { success: false, error: "Failed to fetch categories" }
    }
}

// ── CREATE ─────────────────────────────────────────────────────
export async function createVpCategory(
    raw: CategoryFormValues,
): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const parsed = categorySchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const { name, code, status, parentId } = parsed.data

    try {
        // Prevent duplicate code
        if (code) {
            const existing = await prisma.vpCategory.findFirst({ where: { code } })
            if (existing) return { success: false, error: "A category with this code already exists" }
        }

        const category = await prisma.vpCategory.create({
            data: {
                name,
                code: code || null,
                status,
                parentId: parentId || null,
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpCategory",
            entityId: category.id,
            newData: { name, code, status, parentId },
            description: `Created category: ${name}`,
        })

        return { success: true, data: { id: category.id } }
    } catch (e) {
        console.error("[createVpCategory]", e)
        return { success: false, error: "Failed to create category" }
    }
}

// ── UPDATE ─────────────────────────────────────────────────────
export async function updateVpCategory(
    id: string,
    raw: CategoryFormValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const parsed = categorySchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const { name, code, status, parentId } = parsed.data

    // Prevent setting itself as parent
    if (parentId === id) return { success: false, error: "A category cannot be its own parent" }

    try {
        const old = await prisma.vpCategory.findUnique({ where: { id } })
        if (!old) return { success: false, error: "Category not found" }

        await prisma.vpCategory.update({
            where: { id },
            data: {
                name,
                code: code || null,
                status,
                parentId: parentId || null,
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpCategory",
            entityId: id,
            oldData: old,
            newData: parsed.data,
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[updateVpCategory]", e)
        return { success: false, error: "Failed to update category" }
    }
}

// ── DELETE ─────────────────────────────────────────────────────
export async function deleteVpCategory(id: string): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    try {
        const category = await prisma.vpCategory.findUnique({
            where: { id },
            select: {
                name: true,
                _count: { select: { children: true, vendors: true, items: true } },
            },
        })
        if (!category) return { success: false, error: "Category not found" }

        if (category._count.children > 0)
            return { success: false, error: `Remove the ${category._count.children} sub-categories first` }
        if (category._count.vendors > 0)
            return { success: false, error: `${category._count.vendors} vendors are using this category` }
        if (category._count.items > 0)
            return { success: false, error: `${category._count.items} items are linked to this category` }

        await prisma.vpCategory.delete({ where: { id } })

        await logVpAudit({
            userId: session.user.id,
            action: "DELETE",
            entityType: "VpCategory",
            entityId: id,
            description: `Deleted category: ${category.name}`,
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[deleteVpCategory]", e)
        return { success: false, error: "Failed to delete category" }
    }
}