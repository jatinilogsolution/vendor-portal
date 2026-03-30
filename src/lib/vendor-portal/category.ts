import { prisma } from "@/lib/prisma"

export type VpVendorCategoryOption = {
    id: string
    name: string
}

export type VpCategoryOption = {
    id: string
    name: string
}

type VendorCategorySource = {
    categoryId?: string | null
    category?: VpVendorCategoryOption | null
    categories?: {
        category: VpVendorCategoryOption
    }[]
}

export function mapAssignedVpVendorCategories(
    vendor: VendorCategorySource,
): VpVendorCategoryOption[] {
    const assigned = vendor.categories?.map((row) => row.category) ?? []
    const fallback = vendor.categoryId && vendor.category ? [vendor.category] : []
    const combined = [...assigned, ...fallback]

    const seen = new Set<string>()
    return combined.filter((category) => {
        if (!category?.id || seen.has(category.id)) return false
        seen.add(category.id)
        return true
    })
}

export async function getVpVendorCategoryOptions(
    vpVendorId: string,
): Promise<VpVendorCategoryOption[] | null> {
    const vendor = await prisma.vpVendor.findUnique({
        where: { id: vpVendorId },
        select: {
            categoryId: true,
            category: { select: { id: true, name: true } },
            categories: {
                select: {
                    category: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { category: { name: "asc" } },
            },
        },
    })

    if (!vendor) return null
    return mapAssignedVpVendorCategories(vendor)
}

export async function validateVpVendorCategoryAccess(params: {
    vpVendorId: string
    categoryId?: string | null
    categoryIds?: string[]
    matchMode?: "all" | "any"
}): Promise<string | null> {
    const requestedCategoryIds = params.categoryIds?.filter(Boolean)
        ?? (params.categoryId ? [params.categoryId] : [])
    if (requestedCategoryIds.length === 0) return null

    const categories = await getVpVendorCategoryOptions(params.vpVendorId)
    if (!categories) return "Vendor configuration not found"

    const assignedCategoryIds = new Set(categories.map((category) => category.id))
    const matchMode = params.matchMode ?? "all"
    const isValid = matchMode === "any"
        ? requestedCategoryIds.some((categoryId) => assignedCategoryIds.has(categoryId))
        : requestedCategoryIds.every((categoryId) => assignedCategoryIds.has(categoryId))

    if (!isValid) {
        return matchMode === "any"
            ? "Selected vendor does not match any of the chosen categories"
            : "Selected category is not assigned to this vendor"
    }

    return null
}

type AssignedCategorySource = {
    categoryId?: string | null
    category?: VpCategoryOption | null
    categories?: {
        category: VpCategoryOption
    }[]
}

export function mapAssignedCategories(source: AssignedCategorySource): VpCategoryOption[] {
    const assigned = source.categories?.map((row) => row.category) ?? []
    const fallback = source.categoryId && source.category ? [source.category] : []
    const combined = [...assigned, ...fallback]
    const seen = new Set<string>()

    return combined.filter((category) => {
        if (!category?.id || seen.has(category.id)) return false
        seen.add(category.id)
        return true
    })
}
