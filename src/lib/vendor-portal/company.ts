import { prisma } from "@/lib/prisma"

export type VpCompanyOption = {
    id: string
    name: string
    code: string | null
    gstin: string | null
    pan: string | null
    address: string | null
    legalName: string | null
}

export type VpVendorCompanyConfig = {
    companyIds: string[]
    companies: VpCompanyOption[]
    defaultInvoiceCompanyId: string | null
    restrictInvoiceToDefaultCompany: boolean
}

function mapCompanyOption(company: {
    id: string
    name: string
    code: string | null
    gstin: string | null
    pan: string | null
    address: string | null
    legalName: string | null
}): VpCompanyOption {
    return {
        id: company.id,
        name: company.name,
        code: company.code,
        gstin: company.gstin,
        pan: company.pan,
        address: company.address,
        legalName: company.legalName,
    }
}

export async function getVpCompanyOptions(params: {
    activeOnly?: boolean
    vendorId?: string
} = {}): Promise<VpCompanyOption[]> {
    const rows = await prisma.vpCompany.findMany({
        where: {
            ...(params.activeOnly ? { isActive: true } : {}),
            ...(params.vendorId
                ? { vendorAssignments: { some: { vendorId: params.vendorId } } }
                : {}),
        },
        orderBy: [{ name: "asc" }],
        select: {
            id: true,
            name: true,
            code: true,
            gstin: true,
            pan: true,
            address: true,
            legalName: true,
        },
    })

    return rows.map(mapCompanyOption)
}

export async function getVpVendorCompanyConfig(vpVendorId: string): Promise<VpVendorCompanyConfig | null> {
    const vendor = await prisma.vpVendor.findUnique({
        where: { id: vpVendorId },
        select: {
            defaultInvoiceCompanyId: true,
            restrictInvoiceToDefaultCompany: true,
            companies: {
                select: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            gstin: true,
                            pan: true,
                            address: true,
                            legalName: true,
                        },
                    },
                },
                orderBy: { company: { name: "asc" } },
            },
        },
    })

    if (!vendor) return null

    const companies = vendor.companies.map((row) => mapCompanyOption(row.company))
    return {
        companyIds: companies.map((company) => company.id),
        companies,
        defaultInvoiceCompanyId: vendor.defaultInvoiceCompanyId,
        restrictInvoiceToDefaultCompany: vendor.restrictInvoiceToDefaultCompany,
    }
}

export async function validateVpVendorCompanyAccess(params: {
    vpVendorId: string
    companyId: string
    requireDefaultForInvoice?: boolean
}): Promise<string | null> {
    const config = await getVpVendorCompanyConfig(params.vpVendorId)
    if (!config) return "Vendor configuration not found"
    if (!params.companyId) return "Company is required"
    if (!config.companyIds.includes(params.companyId)) {
        return "Selected company is not assigned to this vendor"
    }
    if (
        params.requireDefaultForInvoice &&
        config.restrictInvoiceToDefaultCompany &&
        config.defaultInvoiceCompanyId &&
        params.companyId !== config.defaultInvoiceCompanyId
    ) {
        return "This vendor can only raise invoices for the configured default company"
    }
    return null
}

export async function getCompanyForDocument(companyId?: string | null): Promise<VpCompanyOption | null> {
    if (!companyId) return null
    const company = await prisma.vpCompany.findUnique({
        where: { id: companyId },
        select: {
            id: true,
            name: true,
            code: true,
            gstin: true,
            pan: true,
            address: true,
            legalName: true,
        },
    })
    return company ? mapCompanyOption(company) : null
}
