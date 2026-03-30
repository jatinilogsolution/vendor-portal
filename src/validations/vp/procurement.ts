// src/validations/vp/procurement.ts
import { z } from "zod"

export const procurementLineItemSchema = z.object({
    itemId: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Description is required"),
    qty: z.coerce.number<number>().min(0.01, "Qty must be > 0"),
    estimatedUnitPrice: z.coerce.number<number>().min(0),
    total: z.coerce.number<number>(),
})

export const procurementSchema = z.object({
    title: z.string().min(3, "Title is required"),
    companyId: z.string().min(1, "Company is required"),
    description: z.string().optional().or(z.literal("")),
    categoryIds: z.array(z.string()).default([]),
    requiredByDate: z.string().optional().or(z.literal("")),
    deliveryAddress: z.string().optional().or(z.literal("")),
    billToId: z.string().optional().or(z.literal("")),
    billTo: z.string().optional().or(z.literal("")),
    billToGstin: z.string().optional().or(z.literal("")),
    taxRate: z.coerce.number<number>().min(0).max(100).default(0),
    items: z.array(procurementLineItemSchema).min(1, "Add at least one item"),
    // Vendors to invite for quoting
    vendorIds: z.array(z.string()).min(1, "Select at least one vendor to invite"),
})

export type ProcurementLineItemValues = z.infer<typeof procurementLineItemSchema>
export type ProcurementFormValues = z.infer<typeof procurementSchema>

// Vendor PI against procurement
export const vendorPiSchema = z.object({
    procurementId: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    validityDate: z.string().optional().or(z.literal("")),
    paymentTerms: z.string().optional().or(z.literal("")),
    fulfillmentDate: z.string().optional().or(z.literal("")),
    attachmentUrls: z.array(z.string()).default([]),
    taxRate: z.coerce.number<number>().min(0).max(100).default(18),
    items: z.array(z.object({
        procurementLineItemId: z.string().optional().or(z.literal("")),
        itemId: z.string().optional().or(z.literal("")),
        description: z.string().min(1, "Description is required"),
        qty: z.coerce.number<number>().min(0.01),
        unitPrice: z.coerce.number<number>().min(0),
        total: z.coerce.number<number>(),
    })).min(1, "Add at least one item"),
})

export type VendorPiFormValues = z.infer<typeof vendorPiSchema>
