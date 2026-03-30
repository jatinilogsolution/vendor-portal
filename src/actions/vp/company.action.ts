"use server"

import { getCustomSession } from "@/actions/auth.action"
import { prisma } from "@/lib/prisma"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { getVpCompanyOptions, getVpVendorCompanyConfig, VpCompanyOption } from "@/lib/vendor-portal/company"
import { isAdminOrBoss } from "@/lib/vendor-portal/roles"
import { VpActionResult, VpListParams, VpListResult } from "@/types/vendor-portal"
import { vpCompanySchema, VpCompanyFormValues } from "@/validations/vp/company"

export type VpCompanyRow = {
    id: string
    name: string
    code: string | null
    legalName: string | null
    gstin: string | null
    pan: string | null
    email: string | null
    phone: string | null
    address: string | null
    isActive: boolean
    createdAt: Date
    createdBy: { name: string } | null
    _count: {
        vendorAssignments: number
        purchaseOrders: number
        proformaInvoices: number
        invoices: number
        procurements: number
    }
}

function mapRow(row: {
    id: string
    name: string
    code: string | null
    legalName: string | null
    gstin: string | null
    pan: string | null
    email: string | null
    phone: string | null
    address: string | null
    isActive: boolean
    createdAt: Date
    createdBy: { name: string } | null
    _count: {
        vendorAssignments: number
        purchaseOrders: number
        proformaInvoices: number
        invoices: number
        procurements: number
    }
}): VpCompanyRow {
    return row
}

export async function getVpCompanies(
    params: VpListParams = {},
): Promise<VpActionResult<VpListResult<VpCompanyRow>>> {
    const page = Math.max(1, params.page ?? 1)
    const per_page = Math.min(100, params.per_page ?? 20)
    const skip = (page - 1) * per_page

    try {
        const where = {
            ...(params.search
                ? {
                    OR: [
                        { name: { contains: params.search } },
                        { code: { contains: params.search } },
                        { gstin: { contains: params.search } },
                    ],
                }
                : {}),
            ...(params.status
                ? { isActive: params.status === "ACTIVE" }
                : {}),
        }

        const [total, rows] = await Promise.all([
            prisma.vpCompany.count({ where }),
            prisma.vpCompany.findMany({
                where,
                skip,
                take: per_page,
                orderBy: [{ isActive: "desc" }, { name: "asc" }],
                select: {
                    id: true,
                    name: true,
                    code: true,
                    legalName: true,
                    gstin: true,
                    pan: true,
                    email: true,
                    phone: true,
                    address: true,
                    isActive: true,
                    createdAt: true,
                    createdBy: { select: { name: true } },
                    _count: {
                        select: {
                            vendorAssignments: true,
                            purchaseOrders: true,
                            proformaInvoices: true,
                            invoices: true,
                            procurements: true,
                        },
                    },
                },
            }),
        ])

        return {
            success: true,
            data: {
                data: rows.map(mapRow),
                meta: { page, per_page, total, total_pages: Math.ceil(total / per_page) },
            },
        }
    } catch (error) {
        console.error("[getVpCompanies]", error)
        return { success: false, error: "Failed to fetch companies" }
    }
}

export async function getVpCompanySelectionOptions(params: {
    vendorId?: string
    activeOnly?: boolean
} = {}): Promise<VpActionResult<VpCompanyOption[]>> {
    try {
        const data = await getVpCompanyOptions(params)
        return { success: true, data }
    } catch (error) {
        console.error("[getVpCompanySelectionOptions]", error)
        return { success: false, error: "Failed to fetch company options" }
    }
}

export async function upsertVpCompany(
    raw: VpCompanyFormValues,
    id?: string,
): Promise<VpActionResult<{ id: string }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const parsed = vpCompanySchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const data = {
        name: parsed.data.name,
        code: parsed.data.code || null,
        legalName: parsed.data.legalName || null,
        gstin: parsed.data.gstin || null,
        pan: parsed.data.pan || null,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
        isActive: parsed.data.isActive,
    }

    try {
        if (id) {
            const old = await prisma.vpCompany.findUnique({ where: { id } })
            if (!old) return { success: false, error: "Company not found" }

            const company = await prisma.vpCompany.update({
                where: { id },
                data,
                select: { id: true },
            })

            await logVpAudit({
                userId: session.user.id,
                action: "UPDATE",
                entityType: "VpCompany",
                entityId: company.id,
                oldData: old,
                newData: data,
                description: `Updated company ${data.name}`,
            })

            return { success: true, data: { id: company.id } }
        }

        const company = await prisma.vpCompany.create({
            data: {
                ...data,
                createdById: session.user.id,
            },
            select: { id: true },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpCompany",
            entityId: company.id,
            newData: data,
            description: `Created company ${data.name}`,
        })

        return { success: true, data: { id: company.id } }
    } catch (error) {
        console.error("[upsertVpCompany]", error)
        return { success: false, error: "Failed to save company" }
    }
}

export async function toggleVpCompanyStatus(
    id: string,
): Promise<VpActionResult<{ isActive: boolean }>> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    try {
        const current = await prisma.vpCompany.findUnique({
            where: { id },
            select: { id: true, isActive: true, name: true },
        })
        if (!current) return { success: false, error: "Company not found" }

        const updated = await prisma.vpCompany.update({
            where: { id },
            data: { isActive: !current.isActive },
            select: { isActive: true },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpCompany",
            entityId: id,
            description: `${updated.isActive ? "Activated" : "Deactivated"} company ${current.name}`,
        })

        return { success: true, data: updated }
    } catch (error) {
        console.error("[toggleVpCompanyStatus]", error)
        return { success: false, error: "Failed to update company status" }
    }
}

export async function getMyVpInvoiceCompanyConfig(): Promise<VpActionResult<{
    companies: VpCompanyOption[]
    defaultInvoiceCompanyId: string | null
    restrictInvoiceToDefaultCompany: boolean
}>> {
    const session = await getCustomSession()
    if (session.user.role !== "VENDOR") {
        return { success: false, error: "Only vendors can access invoice company configuration" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { vendorId: true },
        })
        if (!user?.vendorId) {
            return {
                success: true,
                data: {
                    companies: [],
                    defaultInvoiceCompanyId: null,
                    restrictInvoiceToDefaultCompany: false,
                },
            }
        }

        const vpVendor = await prisma.vpVendor.findFirst({
            where: { existingVendorId: user.vendorId },
            select: { id: true },
        })
        if (!vpVendor) {
            return {
                success: true,
                data: {
                    companies: [],
                    defaultInvoiceCompanyId: null,
                    restrictInvoiceToDefaultCompany: false,
                },
            }
        }

        const config = await getVpVendorCompanyConfig(vpVendor.id)
        return {
            success: true,
            data: config ?? {
                companies: [],
                defaultInvoiceCompanyId: null,
                restrictInvoiceToDefaultCompany: false,
            },
        }
    } catch (error) {
        console.error("[getMyVpInvoiceCompanyConfig]", error)
        return { success: false, error: "Failed to fetch vendor company configuration" }
    }
}
