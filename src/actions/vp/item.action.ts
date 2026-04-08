// src/actions/vp/item.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { getVpVendorCategoryOptions } from "@/lib/vendor-portal/category"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { itemSchema, ItemFormValues } from "@/validations/vp/item"
import { createVpNotification } from "@/lib/vendor-portal/notify"
import { z } from "zod"

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

export type VpItemPriceSource = "PO" | "PI" | "INVOICE"

export type VpItemPriceHistoryRow = {
    id: string
    sourceType: VpItemPriceSource
    vendorId: string
    vendorName: string
    docId: string
    docNumber: string
    docStatus: string
    docDate: Date
    companyName: string | null
    description: string
    qty: number
    unitPrice: number
    total: number
    relatedPoNumber: string | null
    relatedPiNumber: string | null
    documentUrl: string | null
}

export type VpVendorPriceSummary = {
    vendorId: string
    vendorName: string
    minPrice: number
    maxPrice: number
    avgPrice: number
    latestPrice: number
    lastDocDate: Date
}

export type VpItemPriceInsights = {
    item: {
        id: string
        code: string
        name: string
        defaultPrice: number
        categoryName: string | null
    } | null
    lowest: VpItemPriceHistoryRow[]
    highest: VpItemPriceHistoryRow[]
    vendorSummary: VpVendorPriceSummary[]
    history: VpListResult<VpItemPriceHistoryRow>
}

export type VpUnmatchedItemGroup = {
    id: string
    vendorId: string
    vendorName: string
    description: string
    latestPrice: number
    minPrice: number
    maxPrice: number
    lastSeen: Date
    sources: VpItemPriceSource[]
    sampleDoc: {
        docId: string
        docNumber: string
        docStatus: string
        docDate: Date
        sourceType: VpItemPriceSource
    }
    count: number
}

type VpItemPriceHistoryParams = {
    itemId?: string
    vendorId?: string
    source?: VpItemPriceSource | "ALL"
    from?: string
    to?: string
    page?: number
    per_page?: number
}

type VpUnmatchedItemParams = {
    vendorId?: string
    source?: VpItemPriceSource | "ALL"
    from?: string
    to?: string
    search?: string
    page?: number
    per_page?: number
}

type VpCreateItemFromUnmatchedInput = {
    vendorId: string
    code?: string
    name: string
    uom: string
    defaultPrice: number
    hsnCode?: string
    description?: string
    categoryId?: string
}

function normalizeDescription(value: string) {
    return value.trim().replace(/\s+/g, " ").toLowerCase()
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

// ── PRICE INTELLIGENCE ─────────────────────────────────────────
export async function getVpItemPriceInsights(
    params: VpItemPriceHistoryParams,
): Promise<VpActionResult<VpItemPriceInsights>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const page = Math.max(1, params.page ?? 1)
    const per_page = Math.min(100, params.per_page ?? 20)
    const fromDate = params.from ? new Date(params.from) : null
    const toDate = params.to ? new Date(params.to) : null

    if (!params.itemId) {
        return {
            success: true,
            data: {
                item: null,
                lowest: [],
                highest: [],
                vendorSummary: [],
                history: { data: [], meta: { page, per_page, total: 0, total_pages: 0 } },
            },
        }
    }

    const item = await prisma.vpItem.findUnique({
        where: { id: params.itemId },
        select: {
            id: true,
            code: true,
            name: true,
            defaultPrice: true,
            description: true,
            category: { select: { name: true } },
        },
    })

    const vendorFilter = params.vendorId ? { vendorId: params.vendorId } : undefined
    const poDateFilter = fromDate || toDate
        ? {
            createdAt: {
                ...(fromDate ? { gte: fromDate } : {}),
                ...(toDate ? { lte: toDate } : {}),
            },
        }
        : undefined
    const invoiceDescriptions = item
        ? [item.name, item.description].filter((value): value is string => Boolean(value && value.trim()))
        : []
    const invoiceDescriptionSeeds = Array.from(new Set(
        [
            ...invoiceDescriptions,
            ...(item?.code ? invoiceDescriptions.map((value) => `${value.trim()} (${item.code})`) : []),
            ...(item?.code ? [item.code] : []),
        ].filter((value): value is string => Boolean(value && value.trim())),
    ))
    const invoiceDescriptionVariants = Array.from(
        new Set(
            invoiceDescriptionSeeds.flatMap((value) => {
                const trimmed = value.trim()
                return [trimmed, trimmed.toLowerCase(), trimmed.toUpperCase()]
            }),
        ),
    )
    const invoiceDescriptionFilters = invoiceDescriptionVariants.map((value) => ({
        poLineItemId: null,
        description: { contains: value },
    }))

    try {
        const [poRows, piRows, invRows] = await Promise.all([
            prisma.vpPoLineItem.findMany({
                where: {
                    itemId: params.itemId,
                    purchaseOrder: {
                        ...(vendorFilter ?? {}),
                        ...(poDateFilter ?? {}),
                    },
                },
                select: {
                    id: true,
                    description: true,
                    qty: true,
                    unitPrice: true,
                    total: true,
                    purchaseOrder: {
                        select: {
                            id: true,
                            poNumber: true,
                            status: true,
                            createdAt: true,
                            vendor: { select: { id: true, existingVendor: { select: { name: true } } } },
                            company: { select: { name: true } },
                        },
                    },
                },
            }),
            prisma.vpPiLineItem.findMany({
                where: {
                    itemId: params.itemId,
                    proformaInvoice: {
                        ...(vendorFilter ?? {}),
                        ...(poDateFilter ?? {}),
                    },
                },
                select: {
                    id: true,
                    description: true,
                    qty: true,
                    unitPrice: true,
                    total: true,
                    proformaInvoice: {
                        select: {
                            id: true,
                            piNumber: true,
                            status: true,
                            createdAt: true,
                            vendor: { select: { id: true, existingVendor: { select: { name: true } } } },
                            company: { select: { name: true } },
                            documents: {
                                select: { filePath: true, uploadedAt: true },
                                orderBy: { uploadedAt: "desc" },
                                take: 1,
                            },
                        },
                    },
                },
            }),
            prisma.vpInvoiceLineItem.findMany({
                where: {
                    invoice: {
                        ...(vendorFilter ?? {}),
                        ...(poDateFilter ?? {}),
                    },
                    OR: [
                        { poLineItem: { itemId: params.itemId } },
                        ...invoiceDescriptionFilters,
                    ],
                },
                select: {
                    id: true,
                    description: true,
                    qty: true,
                    unitPrice: true,
                    total: true,
                    poLineItemId: true,
                    invoice: {
                        select: {
                            id: true,
                            invoiceNumber: true,
                            status: true,
                            createdAt: true,
                            vendor: { select: { id: true, existingVendor: { select: { name: true } } } },
                            company: { select: { name: true } },
                            purchaseOrder: { select: { poNumber: true } },
                            proformaInvoice: { select: { piNumber: true } },
                            documents: {
                                select: { filePath: true, uploadedAt: true },
                                orderBy: { uploadedAt: "desc" },
                                take: 1,
                            },
                        },
                    },
                },
            }),
        ])

        const normalizedCandidateSet = new Set(
            invoiceDescriptions.map((value) => normalizeDescription(value)),
        )
        const normalizedCandidateWithCodeSet = new Set(
            invoiceDescriptionSeeds.map((value) => normalizeDescription(value)),
        )
        const codeNormalized = item?.code ? normalizeDescription(item.code) : ""

        const matchesInvoiceDescription = (value: string) => {
            const normalized = normalizeDescription(value)
            if (normalizedCandidateWithCodeSet.has(normalized)) return true
            if (normalizedCandidateSet.has(normalized)) return true
            if (codeNormalized && normalized.endsWith(`(${codeNormalized})`)) {
                const trimmed = normalized.replace(new RegExp(`\\s*\\(${codeNormalized}\\)$`), "").trim()
                if (normalizedCandidateSet.has(trimmed)) return true
            }
            return false
        }

        const filteredInvRows = invRows.filter((row) => {
            if (row.poLineItemId) return true
            return matchesInvoiceDescription(row.description)
        })

        let rows: VpItemPriceHistoryRow[] = [
            ...poRows.map((row) => ({
                id: `PO:${row.id}`,
                sourceType: "PO" as const,
                vendorId: row.purchaseOrder.vendor.id,
                vendorName: row.purchaseOrder.vendor.existingVendor.name,
                docId: row.purchaseOrder.id,
                docNumber: row.purchaseOrder.poNumber,
                docStatus: row.purchaseOrder.status,
                docDate: row.purchaseOrder.createdAt,
                companyName: row.purchaseOrder.company?.name ?? null,
                description: row.description,
                qty: row.qty,
                unitPrice: row.unitPrice,
                total: row.total,
                relatedPoNumber: row.purchaseOrder.poNumber,
                relatedPiNumber: null,
                documentUrl: null,
            })),
            ...piRows.map((row) => ({
                id: `PI:${row.id}`,
                sourceType: "PI" as const,
                vendorId: row.proformaInvoice.vendor.id,
                vendorName: row.proformaInvoice.vendor.existingVendor.name,
                docId: row.proformaInvoice.id,
                docNumber: row.proformaInvoice.piNumber,
                docStatus: row.proformaInvoice.status,
                docDate: row.proformaInvoice.createdAt,
                companyName: row.proformaInvoice.company?.name ?? null,
                description: row.description,
                qty: row.qty,
                unitPrice: row.unitPrice,
                total: row.total,
                relatedPoNumber: null,
                relatedPiNumber: row.proformaInvoice.piNumber,
                documentUrl: row.proformaInvoice.documents[0]?.filePath ?? null,
            })),
            ...filteredInvRows.map((row) => ({
                id: `INV:${row.id}`,
                sourceType: "INVOICE" as const,
                vendorId: row.invoice.vendor.id,
                vendorName: row.invoice.vendor.existingVendor.name,
                docId: row.invoice.id,
                docNumber: row.invoice.invoiceNumber ?? row.invoice.id,
                docStatus: row.invoice.status,
                docDate: row.invoice.createdAt,
                companyName: row.invoice.company?.name ?? null,
                description: row.description,
                qty: row.qty,
                unitPrice: row.unitPrice,
                total: row.total,
                relatedPoNumber: row.invoice.purchaseOrder?.poNumber ?? null,
                relatedPiNumber: row.invoice.proformaInvoice?.piNumber ?? null,
                documentUrl: row.invoice.documents[0]?.filePath ?? null,
            })),
        ]

        const allRows = rows

        if (params.source && params.source !== "ALL") {
            rows = rows.filter((row) => row.sourceType === params.source)
        }

        rows.sort((a, b) => b.docDate.getTime() - a.docDate.getTime())

        const total = rows.length
        const start = (page - 1) * per_page
        const historyRows = rows.slice(start, start + per_page)

        const invoiceRows = allRows.filter((row) => row.sourceType === "INVOICE")
        const lowest = [...invoiceRows].sort((a, b) => a.unitPrice - b.unitPrice).slice(0, 5)
        const highest = [...invoiceRows].sort((a, b) => b.unitPrice - a.unitPrice).slice(0, 5)

        const vendorMap = new Map<string, { summary: VpVendorPriceSummary; count: number }>()
        for (const row of rows) {
            const existing = vendorMap.get(row.vendorId)
            if (!existing) {
                vendorMap.set(row.vendorId, {
                    summary: {
                        vendorId: row.vendorId,
                        vendorName: row.vendorName,
                        minPrice: row.unitPrice,
                        maxPrice: row.unitPrice,
                        avgPrice: row.unitPrice,
                        latestPrice: row.unitPrice,
                        lastDocDate: row.docDate,
                    },
                    count: 1,
                })
                continue
            }
            const nextCount = existing.count + 1
            existing.summary.minPrice = Math.min(existing.summary.minPrice, row.unitPrice)
            existing.summary.maxPrice = Math.max(existing.summary.maxPrice, row.unitPrice)
            existing.summary.avgPrice = (existing.summary.avgPrice * existing.count + row.unitPrice) / nextCount
            if (row.docDate > existing.summary.lastDocDate) {
                existing.summary.lastDocDate = row.docDate
                existing.summary.latestPrice = row.unitPrice
            }
            existing.count = nextCount
        }

        const vendorSummary = Array.from(vendorMap.values())
            .map((entry) => entry.summary)
            .sort((a, b) => a.vendorName.localeCompare(b.vendorName),
        )

        return {
            success: true,
            data: {
                item: item
                    ? {
                        id: item.id,
                        code: item.code,
                        name: item.name,
                        defaultPrice: item.defaultPrice,
                        categoryName: item.category?.name ?? null,
                    }
                    : null,
                lowest,
                highest,
                vendorSummary,
                history: {
                    data: historyRows,
                    meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
                },
            },
        }
    } catch (error) {
        console.error("[getVpItemPriceInsights]", error)
        return { success: false, error: "Failed to fetch price insights" }
    }
}

export async function getVpUnmatchedItems(
    params: VpUnmatchedItemParams,
): Promise<VpActionResult<VpListResult<VpUnmatchedItemGroup>>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const page = Math.max(1, params.page ?? 1)
    const per_page = Math.min(100, params.per_page ?? 20)
    const fromDate = params.from ? new Date(params.from) : null
    const toDate = params.to ? new Date(params.to) : null

    const vendorFilter = params.vendorId ? { vendorId: params.vendorId } : undefined
    const dateFilter = fromDate || toDate
        ? {
            createdAt: {
                ...(fromDate ? { gte: fromDate } : {}),
                ...(toDate ? { lte: toDate } : {}),
            },
        }
        : undefined

    try {
        const [poRows, piRows, invRows] = await Promise.all([
            prisma.vpPoLineItem.findMany({
                where: {
                    itemId: null,
                    purchaseOrder: {
                        ...(vendorFilter ?? {}),
                        ...(dateFilter ?? {}),
                    },
                },
                select: {
                    id: true,
                    description: true,
                    qty: true,
                    unitPrice: true,
                    total: true,
                    purchaseOrder: {
                        select: {
                            id: true,
                            poNumber: true,
                            status: true,
                            createdAt: true,
                            vendor: { select: { id: true, existingVendor: { select: { name: true } } } },
                        },
                    },
                },
            }),
            prisma.vpPiLineItem.findMany({
                where: {
                    itemId: null,
                    proformaInvoice: {
                        ...(vendorFilter ?? {}),
                        ...(dateFilter ?? {}),
                    },
                },
                select: {
                    id: true,
                    description: true,
                    qty: true,
                    unitPrice: true,
                    total: true,
                    proformaInvoice: {
                        select: {
                            id: true,
                            piNumber: true,
                            status: true,
                            createdAt: true,
                            vendor: { select: { id: true, existingVendor: { select: { name: true } } } },
                        },
                    },
                },
            }),
            prisma.vpInvoiceLineItem.findMany({
                where: {
                    OR: [
                        { poLineItemId: null },
                        { poLineItem: { itemId: null } },
                    ],
                    invoice: {
                        ...(vendorFilter ?? {}),
                        ...(dateFilter ?? {}),
                    },
                },
                select: {
                    id: true,
                    description: true,
                    qty: true,
                    unitPrice: true,
                    total: true,
                    invoice: {
                        select: {
                            id: true,
                            invoiceNumber: true,
                            status: true,
                            createdAt: true,
                            vendor: { select: { id: true, existingVendor: { select: { name: true } } } },
                        },
                    },
                },
            }),
        ])

        let rows: Array<{
            sourceType: VpItemPriceSource
            vendorId: string
            vendorName: string
            description: string
            unitPrice: number
            docId: string
            docNumber: string
            docStatus: string
            docDate: Date
        }> = [
            ...poRows.map((row) => ({
                sourceType: "PO" as const,
                vendorId: row.purchaseOrder.vendor.id,
                vendorName: row.purchaseOrder.vendor.existingVendor.name,
                description: row.description,
                unitPrice: row.unitPrice,
                docId: row.purchaseOrder.id,
                docNumber: row.purchaseOrder.poNumber,
                docStatus: row.purchaseOrder.status,
                docDate: row.purchaseOrder.createdAt,
            })),
            ...piRows.map((row) => ({
                sourceType: "PI" as const,
                vendorId: row.proformaInvoice.vendor.id,
                vendorName: row.proformaInvoice.vendor.existingVendor.name,
                description: row.description,
                unitPrice: row.unitPrice,
                docId: row.proformaInvoice.id,
                docNumber: row.proformaInvoice.piNumber,
                docStatus: row.proformaInvoice.status,
                docDate: row.proformaInvoice.createdAt,
            })),
            ...invRows.map((row) => ({
                sourceType: "INVOICE" as const,
                vendorId: row.invoice.vendor.id,
                vendorName: row.invoice.vendor.existingVendor.name,
                description: row.description,
                unitPrice: row.unitPrice,
                docId: row.invoice.id,
                docNumber: row.invoice.invoiceNumber ?? row.invoice.id,
                docStatus: row.invoice.status,
                docDate: row.invoice.createdAt,
            })),
        ]

        if (params.source && params.source !== "ALL") {
            rows = rows.filter((row) => row.sourceType === params.source)
        }

        const search = params.search?.trim().toLowerCase()
        if (search) {
            rows = rows.filter((row) =>
                row.description.toLowerCase().includes(search)
                || row.vendorName.toLowerCase().includes(search),
            )
        }

        const groups = new Map<string, VpUnmatchedItemGroup>()
        for (const row of rows) {
            const key = `${row.vendorId}:${normalizeDescription(row.description)}`
            const existing = groups.get(key)
            if (!existing) {
                groups.set(key, {
                    id: key,
                    vendorId: row.vendorId,
                    vendorName: row.vendorName,
                    description: row.description,
                    latestPrice: row.unitPrice,
                    minPrice: row.unitPrice,
                    maxPrice: row.unitPrice,
                    lastSeen: row.docDate,
                    sources: [row.sourceType],
                    sampleDoc: {
                        docId: row.docId,
                        docNumber: row.docNumber,
                        docStatus: row.docStatus,
                        docDate: row.docDate,
                        sourceType: row.sourceType,
                    },
                    count: 1,
                })
                continue
            }

            existing.count += 1
            existing.minPrice = Math.min(existing.minPrice, row.unitPrice)
            existing.maxPrice = Math.max(existing.maxPrice, row.unitPrice)
            if (!existing.sources.includes(row.sourceType)) {
                existing.sources = [...existing.sources, row.sourceType]
            }
            if (row.docDate > existing.lastSeen) {
                existing.lastSeen = row.docDate
                existing.latestPrice = row.unitPrice
                existing.sampleDoc = {
                    docId: row.docId,
                    docNumber: row.docNumber,
                    docStatus: row.docStatus,
                    docDate: row.docDate,
                    sourceType: row.sourceType,
                }
            }
        }

        const allGroups = Array.from(groups.values()).sort(
            (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime(),
        )

        const total = allGroups.length
        const start = (page - 1) * per_page
        const data = allGroups.slice(start, start + per_page)

        return {
            success: true,
            data: {
                data,
                meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
            },
        }
    } catch (error) {
        console.error("[getVpUnmatchedItems]", error)
        return { success: false, error: "Failed to fetch unmatched items" }
    }
}

export async function createVpItemFromUnmatched(
    raw: VpCreateItemFromUnmatchedInput,
): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const parsed = itemSchema.extend({
        code: itemSchema.shape.code.optional().or(z.literal("")),
    }).safeParse({
        code: raw.code ?? "",
        name: raw.name,
        uom: raw.uom,
        defaultPrice: raw.defaultPrice,
        hsnCode: raw.hsnCode ?? "",
        description: raw.description ?? "",
        categoryId: raw.categoryId ?? "",
    })
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const { code, name, uom, defaultPrice, hsnCode, description, categoryId } = parsed.data

    try {
        if (code?.trim()) {
            const existing = await prisma.vpItem.findFirst({ where: { code } })
            if (existing) return { success: false, error: "An item with this code already exists" }
        }

        const item = await prisma.vpItem.create({
            data: {
                code : code!,
                name,
                uom,
                defaultPrice,
                hsnCode: hsnCode || null,
                description: description || null,
                categoryId: categoryId || null,
            },
        })

        let vendorUserIds: string[] = []
        let categoryAssigned = false
        if (raw.vendorId && categoryId) {
            const vendor = await prisma.vpVendor.findUnique({
                where: { id: raw.vendorId },
                select: {
                    id: true,
                    existingVendor: { select: { name: true, users: { select: { id: true } } } },
                    categories: { select: { categoryId: true } },
                },
            })

            if (vendor) {
                vendorUserIds = vendor.existingVendor.users.map((u) => u.id)
                const hasCategory = vendor.categories.some((c) => c.categoryId === categoryId)
                if (!hasCategory) {
                    await prisma.vpVendorCategory.create({
                        data: { vendorId: vendor.id, categoryId },
                    })
                    categoryAssigned = true
                }
            }
        }

        if (vendorUserIds.length > 0) {
            await createVpNotification({
                userIds: vendorUserIds,
                type: "ITEM_ASSIGNED",
                message: `Item "${name}" has been added to your catalog${categoryAssigned ? " and category access updated." : "."}`,
                refDocType: "VpItem",
                refDocId: item.id,
            })
        }

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpItem",
            entityId: item.id,
            newData: parsed.data,
            description: `Created item from unmatched history: ${name} (${code})`,
        })

        return { success: true, data: { id: item.id } }
    } catch (error) {
        console.error("[createVpItemFromUnmatched]", error)
        return { success: false, error: "Failed to create item" }
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
