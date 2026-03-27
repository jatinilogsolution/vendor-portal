// src/validations/vp/purchase-order.ts
import { z } from "zod"

export const poLineItemSchema = z.object({
    itemId: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "Description is required"),
    qty: z.number().min(0.01, "Qty must be > 0"),
    unitPrice: z.number().min(0, "Price must be ≥ 0"),
    total: z.number(),
})

export const purchaseOrderSchema = z.object({
    vendorId: z.string().min(1, "Vendor is required"),
    categoryId: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    deliveryDate: z.string().optional().or(z.literal("")),
    deliveryAddress: z.string().optional().or(z.literal("")),
    billToId: z.string().optional().or(z.literal("")),
    billTo: z.string().optional().or(z.literal("")),
    billToGstin: z.string().optional().or(z.literal("")),
    taxRate: z.number().min(0).max(100),
    items: z.array(poLineItemSchema).min(1, "Add at least one line item"),
})

export type PoLineItemValues = z.infer<typeof poLineItemSchema>
export type PurchaseOrderValues = z.infer<typeof purchaseOrderSchema>

