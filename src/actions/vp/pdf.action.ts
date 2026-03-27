// src/actions/vp/pdf.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getVpSetting } from "@/actions/vp/settings.action"
import { getBillToById } from "@/actions/vp/bill-to.action"
import { VpActionResult } from "@/types/vendor-portal"
import type { PoPdfData, PiPdfData, InvoicePdfData } from "@/lib/vp-pdf"

// Company details from settings
async function getCompanyInfo() {
    const [name, gstin, address] = await Promise.all([
        getVpSetting("GENERAL", "company_name"),
        getVpSetting("GENERAL", "company_gstin"),
        getVpSetting("GENERAL", "company_address"),
    ])
    return {
        companyName: name ?? "AWL India Pvt. Ltd.",
        companyGstin: gstin ?? "",
        companyAddress: address ?? "",
    }
}

// ── PO PDF data ────────────────────────────────────────────────

export async function getVpPoPdfData(
    id: string,
): Promise<VpActionResult<PoPdfData>> {
    try {
        const [po, company] = await Promise.all([
            prisma.vpPurchaseOrder.findUnique({
                where: { id },
                select: {
                    poNumber: true,
                    status: true,
                    subtotal: true,
                    taxRate: true,
                    taxAmount: true,
                    grandTotal: true,
                    notes: true,
                    deliveryDate: true,
                    deliveryAddress: true,
                    createdAt: true,
                    category: { select: { name: true } },
                    approvedBy: { select: { name: true } },
                    vendor: {
                        select: {
                            existingVendor: {
                                select: {
                                    name: true,
                                    gstNumber: true,
                                    contactEmail: true,
                                    Address: { select: { line1: true, city: true, state: true } },
                                },
                            },
                        },
                    },
                    items: {
                        select: {
                            description: true,
                            qty: true,
                            unitPrice: true,
                            total: true,
                        },
                    },
                },
            }),
            getCompanyInfo(),
        ])

        if (!po) return { success: false, error: "PO not found" }

        const ev = po.vendor.existingVendor
        const addr = ev.Address[0]

        return {
            success: true,
            data: {
                poNumber: po.poNumber,
                status: po.status,
                vendorName: ev.name,
                vendorGst: ev.gstNumber ?? undefined,
                vendorAddress: addr
                    ? [addr.line1, addr.city, addr.state].filter(Boolean).join(", ")
                    : undefined,
                categoryName: po.category?.name ?? null,
                deliveryDate: po.deliveryDate,
                deliveryAddress: po.deliveryAddress,
                createdAt: po.createdAt,
                approvedBy: po.approvedBy?.name ?? null,
                notes: po.notes,
                subtotal: po.subtotal,
                taxRate: po.taxRate,
                taxAmount: po.taxAmount,
                grandTotal: po.grandTotal,
                items: po.items,
                ...company,
            },
        }
    } catch (e) {
        return { success: false, error: "Failed to build PO PDF data" }
    }
}

// ── PI PDF data ────────────────────────────────────────────────

export async function getVpPiPdfData(
    id: string,
): Promise<VpActionResult<PiPdfData>> {
    try {
        const [pi, company] = await Promise.all([
            prisma.vpProformaInvoice.findUnique({
                where: { id },
                select: {
                    piNumber: true,
                    status: true,
                    subtotal: true,
                    taxRate: true,
                    taxAmount: true,
                    grandTotal: true,
                    notes: true,
                    validityDate: true,
                    paymentTerms: true,
                    createdAt: true,
                    category: { select: { name: true } },
                    approvedBy: { select: { name: true } },
                    vendor: {
                        select: {
                            existingVendor: {
                                select: { name: true, gstNumber: true },
                            },
                        },
                    },
                    items: {
                        select: {
                            description: true,
                            qty: true,
                            unitPrice: true,
                            total: true,
                        },
                    },
                },
            }),
            getCompanyInfo(),
        ])

        if (!pi) return { success: false, error: "PI not found" }

        return {
            success: true,
            data: {
                piNumber: pi.piNumber,
                status: pi.status,
                vendorName: pi.vendor.existingVendor.name,
                vendorGst: pi.vendor.existingVendor.gstNumber ?? undefined,
                validityDate: pi.validityDate,
                paymentTerms: pi.paymentTerms,
                categoryName: pi.category?.name ?? null,
                createdAt: pi.createdAt,
                approvedBy: pi.approvedBy?.name ?? null,
                notes: pi.notes,
                subtotal: pi.subtotal,
                taxRate: pi.taxRate,
                taxAmount: pi.taxAmount,
                grandTotal: pi.grandTotal,
                items: pi.items,
                ...company,
            },
        }
    } catch (e) {
        return { success: false, error: "Failed to build PI PDF data" }
    }
}

// ── Invoice PDF data ───────────────────────────────────────────

export async function getVpInvoicePdfData(
    id: string,
): Promise<VpActionResult<InvoicePdfData>> {
    try {
        const inv = await prisma.vpInvoice.findUnique({
            where: { id },
            select: {
                invoiceNumber: true,
                status: true,
                subtotal: true,
                taxRate: true,
                taxAmount: true,
                totalAmount: true,
                billToId: true,
                notes: true,
                createdAt: true,
                submittedAt: true,
                purchaseOrder: { select: { poNumber: true } },
                proformaInvoice: { select: { piNumber: true } },
                vendor: {
                    select: {
                        existingVendor: {
                            select: {
                                name: true,
                                gstNumber: true,
                                Address: { select: { line1: true, city: true, state: true } },
                            },
                        },
                    },
                },
                lineItems: {
                    select: {
                        description: true,
                        qty: true,
                        unitPrice: true,
                        tax: true,
                        total: true,
                    },
                },
                payments: {
                    select: {
                        amount: true,
                        paymentMode: true,
                        transactionRef: true,
                        paymentDate: true,
                        status: true,
                    },
                    where: { status: { in: ["COMPLETED", "INITIATED"] } },
                },
            },
        })

        if (!inv) return { success: false, error: "Invoice not found" }

        const company = await getCompanyInfo()

        let billToDetails = {
            name: company.companyName,
            address: company.companyAddress,
            gstin: company.companyGstin,
        }

        if (inv.billToId) {
            const wh = await getBillToById(inv.billToId)
            if (wh) {
                billToDetails = {
                    name: wh.name,
                    address: wh.address,
                    gstin: wh.gstin,
                }
            }
        }

        const ev = inv.vendor.existingVendor
        const vAddr = ev.Address[0]

        return {
            success: true,
            data: {
                invoiceNumber: inv.invoiceNumber ?? "DRAFT",
                status: inv.status,
                vendorName: ev.name,
                vendorGst: ev.gstNumber ?? undefined,
                vendorAddress: vAddr
                    ? [vAddr.line1, vAddr.city, vAddr.state].filter(Boolean).join(", ")
                    : undefined,
                billTo: billToDetails.name,
                billToAddress: billToDetails.address,
                billToGstin: billToDetails.gstin,
                poNumber: inv.purchaseOrder?.poNumber ?? null,
                piNumber: inv.proformaInvoice?.piNumber ?? null,
                createdAt: inv.createdAt,
                submittedAt: inv.submittedAt,
                notes: inv.notes,
                subtotal: inv.subtotal,
                taxRate: inv.taxRate,
                taxAmount: inv.taxAmount,
                totalAmount: inv.totalAmount,
                items: inv.lineItems,
                payments: inv.payments,
            },
        }
    } catch (e) {
        return { success: false, error: "Failed to build Invoice PDF data" }
    }
}
