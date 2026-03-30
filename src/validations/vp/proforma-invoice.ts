// src/validations/vp/proforma-invoice.ts
import { z } from "zod"

export const piLineItemSchema = z.object({
    itemId: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Description is required"),
    qty: z.number().min(0.01, "Qty must be > 0"),
    unitPrice: z.number().min(0, "Price must be ≥ 0"),
    total: z.number(),
})

export const proformaInvoiceSchema = z.object({
    vendorId: z.string().min(1, "Vendor is required"),
    companyId: z.string().min(1, "Company is required"),
    categoryId: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    validityDate: z.string().optional().or(z.literal("")),
    paymentTerms: z.string().optional().or(z.literal("")),
    taxRate: z.number().min(0).max(100),
    billToId: z.string().optional().or(z.literal("")),
    billTo: z.string().optional().or(z.literal("")),
    billToGstin: z.string().optional().or(z.literal("")),
    items: z.array(piLineItemSchema).min(1, "Add at least one line item"),
})

export type PiLineItemValues = z.infer<typeof piLineItemSchema>
export type ProformaInvoiceValues = z.infer<typeof proformaInvoiceSchema>
