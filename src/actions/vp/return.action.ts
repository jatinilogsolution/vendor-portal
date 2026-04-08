"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdmin, isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { createVpNotification } from "@/lib/vendor-portal/notify"
import { getVpVendorCategoryOptions } from "@/lib/vendor-portal/category"
import { getVpInvoiceCatalogItemDescription } from "@/lib/vendor-portal/invoice"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import {
    vpReturnSchema,
    vpVendorReturnScheduleSchema,
    VpReturnFormValues,
    VpVendorReturnScheduleValues,
} from "@/validations/vp/return"

export type VpReturnRow = {
    id: string
    status: string
    expectedPickupDate: Date | null
    completedAt: Date | null
    pickupPersonName: string | null
    pickupPersonPhone: string | null
    notes: string | null
    createdAt: Date
    vendor: {
        id: string
        name: string
    }
    invoice: {
        id: string
        invoiceNumber: string | null
        companyName: string | null
    } | null
    _count: { items: number }
}

export type VpReturnDetail = VpReturnRow & {
    createdBy: { id: string; name: string } | null
    invoiceStatus: string | null
    invoiceTotalAmount: number | null
    po: {
        id: string
        poNumber: string
        status: string
    } | null
    documents: {
        id: string
        filePath: string
        uploadedAt: Date
    }[]
    items: {
        id: string
        itemId: string | null
        itemCode: string | null
        itemName: string | null
        description: string
        qty: number
        reason: string | null
        invoiceLineItemId: string | null
        invoiceLineDescription: string | null
    }[]
}

export type VpReturnInvoiceOption = {
    id: string
    invoiceNumber: string | null
    companyName: string | null
    createdAt: Date
}

export type VpReturnInvoiceLineOption = {
    id: string
    itemId: string | null
    itemCode: string | null
    itemName: string | null
    description: string
    qty: number
    alreadyReturnedQty: number
    availableQty: number
}

const RETURN_SELECT = {
    id: true,
    status: true,
    expectedPickupDate: true,
    completedAt: true,
    pickupPersonName: true,
    pickupPersonPhone: true,
    notes: true,
    createdAt: true,
    _count: { select: { items: true } },
    vendor: {
        select: {
            id: true,
            existingVendor: { select: { name: true } },
        },
    },
    invoice: {
        select: {
            id: true,
            invoiceNumber: true,
            company: { select: { name: true } },
        },
    },
} as const

function isNonEmptyString(value: string | undefined | null): value is string {
    return typeof value === "string" && value.trim().length > 0
}

function mapReturnRow(row: any): VpReturnRow {
    return {
        id: row.id,
        status: row.status,
        expectedPickupDate: row.expectedPickupDate,
        completedAt: row.completedAt,
        pickupPersonName: row.pickupPersonName,
        pickupPersonPhone: row.pickupPersonPhone,
        notes: row.notes,
        createdAt: row.createdAt,
        vendor: {
            id: row.vendor.id,
            name: row.vendor.existingVendor.name,
        },
        invoice: row.invoice
            ? {
                id: row.invoice.id,
                invoiceNumber: row.invoice.invoiceNumber,
                companyName: row.invoice.company?.name ?? null,
            }
            : null,
        _count: row._count,
    }
}

async function getVpVendorIdForSession(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { vendorId: true },
    })
    if (!user?.vendorId) return null

    const vpVendor = await prisma.vpVendor.findFirst({
        where: { existingVendorId: user.vendorId },
        select: { id: true },
    })
    return vpVendor?.id ?? null
}

export async function getVpReturns(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpReturnRow>>> {
    try {
        const session = await getCustomSession()
        const page = Math.max(1, params.page ?? 1)
        const per_page = Math.min(100, params.per_page ?? 20)
        const skip = (page - 1) * per_page

        const where: any = {}
        if (params.status) where.status = params.status
        if (params.vendorId) where.vendorId = params.vendorId
        if (params.from) where.expectedPickupDate = { ...where.expectedPickupDate, gte: new Date(params.from) }
        if (params.to) where.expectedPickupDate = { ...where.expectedPickupDate, lte: new Date(params.to) }

        if (session.user.role === "VENDOR") {
            const vpVendorId = await getVpVendorIdForSession(session.user.id)
            if (!vpVendorId) {
                return {
                    success: true,
                    data: { data: [], meta: { page, per_page, total: 0, total_pages: 0 } },
                }
            }
            where.vendorId = vpVendorId
        }

        const [total, rows] = await Promise.all([
            prisma.vpReturnRecord.count({ where }),
            prisma.vpReturnRecord.findMany({
                where,
                skip,
                take: per_page,
                orderBy: [
                    { expectedPickupDate: "asc" },
                    { createdAt: "desc" },
                ],
                select: RETURN_SELECT,
            }),
        ])

        return {
            success: true,
            data: {
                data: rows.map(mapReturnRow),
                meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
            },
        }
    } catch (error) {
        console.error("[getVpReturns]", error)
        return { success: false, error: "Failed to fetch returns" }
    }
}

export async function getVpReturnById(
    id: string,
): Promise<VpActionResult<VpReturnDetail>> {
    try {
        const session = await getCustomSession()
        const row = await prisma.vpReturnRecord.findUnique({
            where: { id },
            select: {
                ...RETURN_SELECT,
                invoice: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        status: true,
                        totalAmount: true,
                        company: { select: { name: true } },
                        purchaseOrder: {
                            select: {
                                id: true,
                                poNumber: true,
                                status: true,
                            },
                        },
                        documents: {
                            select: {
                                id: true,
                                filePath: true,
                                uploadedAt: true,
                            },
                            orderBy: { uploadedAt: "desc" },
                        },
                    },
                },
                createdBy: { select: { id: true, name: true } },
                items: {
                    select: {
                        id: true,
                        description: true,
                        qty: true,
                        reason: true,
                        itemId: true,
                        item: { select: { code: true, name: true } },
                        invoiceLineItemId: true,
                        invoiceLineItem: { select: { description: true } },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        })
        if (!row) return { success: false, error: "Return record not found" }

        if (session.user.role === "VENDOR") {
            const vpVendorId = await getVpVendorIdForSession(session.user.id)
            if (!vpVendorId || row.vendor.id !== vpVendorId) {
                return { success: false, error: "Access denied" }
            }
        }

        return {
            success: true,
            data: {
                ...mapReturnRow(row),
                createdBy: row.createdBy,
                invoiceStatus: row.invoice?.status ?? null,
                invoiceTotalAmount: row.invoice?.totalAmount ?? null,
                po: row.invoice?.purchaseOrder
                    ? {
                        id: row.invoice.purchaseOrder.id,
                        poNumber: row.invoice.purchaseOrder.poNumber,
                        status: row.invoice.purchaseOrder.status,
                    }
                    : null,
                documents: (row.invoice?.documents ?? []).map((document) => ({
                    id: document.id,
                    filePath: document.filePath,
                    uploadedAt: document.uploadedAt,
                })),
                items: row.items.map((item) => ({
                    id: item.id,
                    itemId: item.itemId,
                    itemCode: item.item?.code ?? null,
                    itemName: item.item?.name ?? null,
                    description: item.description,
                    qty: item.qty,
                    reason: item.reason,
                    invoiceLineItemId: item.invoiceLineItemId,
                    invoiceLineDescription: item.invoiceLineItem?.description ?? null,
                })),
            },
        }
    } catch (error) {
        console.error("[getVpReturnById]", error)
        return { success: false, error: "Failed to fetch return" }
    }
}

export async function getVpInvoicesForReturn(
    vendorId: string,
): Promise<VpActionResult<VpReturnInvoiceOption[]>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Only admins can access invoice options" }
    }

    try {
        const invoices = await prisma.vpInvoice.findMany({
            where: {
                vendorId,
                status: { not: "REJECTED" },
            },
            select: {
                id: true,
                invoiceNumber: true,
                createdAt: true,
                company: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        })

        return {
            success: true,
            data: invoices.map((invoice) => ({
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                companyName: invoice.company?.name ?? null,
                createdAt: invoice.createdAt,
            })),
        }
    } catch (error) {
        console.error("[getVpInvoicesForReturn]", error)
        return { success: false, error: "Failed to fetch vendor invoices" }
    }
}

export async function getVpInvoiceLineItemsForReturn(
    invoiceId: string,
): Promise<VpActionResult<VpReturnInvoiceLineOption[]>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Only admins can access invoice item options" }
    }

    try {
        const invoice = await prisma.vpInvoice.findUnique({
            where: { id: invoiceId },
            select: { id: true },
        })
        if (!invoice) return { success: false, error: "Invoice not found" }

        const items = await prisma.vpInvoiceLineItem.findMany({
            where: { invoiceId },
            select: {
                id: true,
                description: true,
                qty: true,
                poLineItem: {
                    select: {
                        itemId: true,
                        item: { select: { code: true, name: true } },
                    },
                },
                returnItems: {
                    where: {
                        returnRecord: {
                            status: { not: "CANCELLED" },
                        },
                    },
                    select: { qty: true },
                },
            },
            orderBy: { createdAt: "asc" },
        })

        return {
            success: true,
            data: items.map((item) => {
                const alreadyReturnedQty = item.returnItems.reduce((sum, row) => sum + row.qty, 0)
                return {
                    id: item.id,
                    itemId: item.poLineItem?.itemId ?? null,
                    itemCode: item.poLineItem?.item?.code ?? null,
                    itemName: item.poLineItem?.item?.name ?? null,
                    description: item.description,
                    qty: item.qty,
                    alreadyReturnedQty,
                    availableQty: Math.max(0, item.qty - alreadyReturnedQty),
                }
            }),
        }
    } catch (error) {
        console.error("[getVpInvoiceLineItemsForReturn]", error)
        return { success: false, error: "Failed to fetch invoice line items" }
    }
}

export async function createVpReturn(
    raw: VpReturnFormValues,
): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role)) {
        return { success: false, error: "Only admins can record returns" }
    }

    const parsed = vpReturnSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const data = parsed.data

    const vendor = await prisma.vpVendor.findUnique({
        where: { id: data.vendorId },
        select: {
            id: true,
            existingVendor: {
                select: {
                    name: true,
                    users: { select: { id: true } },
                },
            },
        },
    })
    if (!vendor) return { success: false, error: "Vendor not found" }

    let invoice: { id: string; invoiceNumber: string | null } | null = null
    if (data.invoiceId) {
        invoice = await prisma.vpInvoice.findUnique({
            where: { id: data.invoiceId },
            select: { id: true, vendorId: true, invoiceNumber: true },
        }).then((result) => {
            if (!result || result.vendorId !== data.vendorId) return null
            return { id: result.id, invoiceNumber: result.invoiceNumber }
        })
        if (!invoice) return { success: false, error: "Selected invoice does not belong to this vendor" }
    }

    const assignedCategories = await getVpVendorCategoryOptions(data.vendorId)
    if (!assignedCategories) return { success: false, error: "Vendor configuration not found" }

    const itemIds = !data.invoiceId
        ? [...new Set(data.items.map((item) => item.itemId).filter(isNonEmptyString))]
        : []
    const allowedItems = itemIds.length > 0
        ? await prisma.vpItem.findMany({
            where: {
                id: { in: itemIds },
                categoryId: { in: assignedCategories.map((category) => category.id) },
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
        })
        : []
    if (allowedItems.length !== itemIds.length) {
        return { success: false, error: "One or more selected items are not assigned to this vendor" }
    }
    const allowedItemMap = new Map(allowedItems.map((item) => [item.id, item]))

    const invoiceLineItemIds = [...new Set(
        data.items.map((item) => item.invoiceLineItemId).filter(isNonEmptyString),
    )]
    const invoiceLineMap = new Map<string, {
        id: string
        itemId: string | null
        description: string
        qty: number
        returnedQty: number
    }>()

    if (invoiceLineItemIds.length > 0) {
        if (!data.invoiceId) {
            return { success: false, error: "Choose an invoice before linking return rows to invoice items" }
        }

        const invoiceLineItems = await prisma.vpInvoiceLineItem.findMany({
            where: {
                invoiceId: data.invoiceId,
                id: { in: invoiceLineItemIds },
            },
            select: {
                id: true,
                description: true,
                qty: true,
                poLineItem: { select: { itemId: true } },
                returnItems: {
                    where: {
                        returnRecord: {
                            status: { not: "CANCELLED" },
                        },
                    },
                    select: { qty: true },
                },
            },
        })

        if (invoiceLineItems.length !== invoiceLineItemIds.length) {
            return { success: false, error: "One or more selected invoice items are invalid" }
        }

        for (const invoiceLineItem of invoiceLineItems) {
            invoiceLineMap.set(invoiceLineItem.id, {
                id: invoiceLineItem.id,
                itemId: invoiceLineItem.poLineItem?.itemId ?? null,
                description: invoiceLineItem.description,
                qty: invoiceLineItem.qty,
                returnedQty: invoiceLineItem.returnItems.reduce((sum, row) => sum + row.qty, 0),
            })
        }
    }

    const requestedInvoiceLineQtyMap = new Map<string, number>()
    for (const item of data.items) {
        if (!item.invoiceLineItemId) continue
        requestedInvoiceLineQtyMap.set(
            item.invoiceLineItemId,
            (requestedInvoiceLineQtyMap.get(item.invoiceLineItemId) ?? 0) + item.qty,
        )
    }

    try {
        const normalizedItems = data.items.map((item) => {
            const invoiceLineItem = item.invoiceLineItemId
                ? invoiceLineMap.get(item.invoiceLineItemId)
                : null

            if (data.invoiceId && !invoiceLineItem) {
                throw new Error("Selected invoice item is invalid")
            }

            if (invoiceLineItem) {
                const availableQty = Math.max(0, invoiceLineItem.qty - invoiceLineItem.returnedQty)
                const requestedQtyAgainstInvoiceLine = requestedInvoiceLineQtyMap.get(invoiceLineItem.id) ?? item.qty
                if (requestedQtyAgainstInvoiceLine > availableQty + 0.0001) {
                    throw new Error(`Return qty for "${invoiceLineItem.description}" exceeds the invoice quantity still available to return`)
                }
            }

            const selectedItem = item.itemId ? allowedItemMap.get(item.itemId) : null
            const customDescription = item.customDescription?.trim()

            return {
                itemId: (invoiceLineItem?.itemId ?? item.itemId) || null,
                invoiceLineItemId: item.invoiceLineItemId || null,
                description: invoiceLineItem?.description
                    ?? (selectedItem ? getVpInvoiceCatalogItemDescription(selectedItem) : customDescription ?? ""),
                qty: item.qty,
                reason: item.reason?.trim() || null,
            }
        })

        const returnRecord = await prisma.vpReturnRecord.create({
            data: {
                vendorId: data.vendorId,
                invoiceId: data.invoiceId || null,
                expectedPickupDate: new Date(data.expectedPickupDate),
                pickupPersonName: data.pickupPersonName?.trim() || null,
                pickupPersonPhone: data.pickupPersonPhone?.trim() || null,
                notes: data.notes?.trim() || null,
                createdById: session.user.id,
                items: {
                    create: normalizedItems,
                },
            },
        })

        const vendorUserIds = vendor.existingVendor.users.map((user) => user.id)
        await createVpNotification({
            userIds: vendorUserIds,
            type: "RETURN_CREATED",
            message: `A return pickup has been scheduled${invoice?.invoiceNumber ? ` for invoice ${invoice.invoiceNumber}` : ""}. Expected pickup: ${new Date(data.expectedPickupDate).toLocaleDateString("en-IN")}.`,
            refDocType: "VpReturnRecord",
            refDocId: returnRecord.id,
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpReturnRecord",
            entityId: returnRecord.id,
            description: `Created return pickup for vendor ${vendor.existingVendor.name}`,
        })

        return { success: true, data: { id: returnRecord.id } }
    } catch (error) {
        console.error("[createVpReturn]", error)
        if (error instanceof Error && error.message) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "Failed to create return record" }
    }
}

export async function completeVpReturn(
    id: string,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role)) {
        return { success: false, error: "Only admins can complete returns" }
    }

    const existing = await prisma.vpReturnRecord.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
            vendor: {
                select: {
                    existingVendor: {
                        select: {
                            name: true,
                            users: { select: { id: true } },
                        },
                    },
                },
            },
        },
    })
    if (!existing) return { success: false, error: "Return record not found" }
    if (existing.status === "COMPLETED") return { success: false, error: "Return is already completed" }

    try {
        await prisma.vpReturnRecord.update({
            where: { id },
            data: {
                status: "COMPLETED",
                completedAt: new Date(),
            },
        })

        await createVpNotification({
            userIds: existing.vendor.existingVendor.users.map((user) => user.id),
            type: "RETURN_COMPLETED",
            message: `The scheduled return pickup has been marked completed.`,
            refDocType: "VpReturnRecord",
            refDocId: id,
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpReturnRecord",
            entityId: id,
            description: `Completed return pickup for vendor ${existing.vendor.existingVendor.name}`,
        })

        return { success: true, data: null }
    } catch (error) {
        console.error("[completeVpReturn]", error)
        return { success: false, error: "Failed to complete return" }
    }
}

export async function vendorUpdateVpReturnSchedule(
    id: string,
    raw: VpVendorReturnScheduleValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR") {
        return { success: false, error: "Only vendors can update return pickup details" }
    }

    const parsed = vpVendorReturnScheduleSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const data = parsed.data
    const vpVendorId = await getVpVendorIdForSession(session.user.id)
    if (!vpVendorId) {
        return { success: false, error: "Your account is not linked to a vendor" }
    }

    const existing = await prisma.vpReturnRecord.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
            vendorId: true,
            vendor: { select: { existingVendor: { select: { name: true } } } },
        },
    })
    if (!existing) return { success: false, error: "Return record not found" }
    if (existing.vendorId !== vpVendorId) return { success: false, error: "Access denied" }
    if (existing.status !== "EXPECTED") {
        return { success: false, error: "Pickup details can only be updated while return is expected" }
    }

    try {
        await prisma.vpReturnRecord.update({
            where: { id },
            data: {
                expectedPickupDate: new Date(data.expectedPickupDate),
                pickupPersonName: data.pickupPersonName?.trim() || null,
                pickupPersonPhone: data.pickupPersonPhone?.trim() || null,
                notes: data.notes?.trim() || null,
            },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpReturnRecord",
            entityId: id,
            description: `Vendor updated pickup details for return (${existing.vendor.existingVendor.name})`,
        })

        return { success: true, data: null }
    } catch (error) {
        console.error("[vendorUpdateVpReturnSchedule]", error)
        return { success: false, error: "Failed to update pickup details" }
    }
}
