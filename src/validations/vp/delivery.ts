// src/validations/vp/delivery.ts
import { z } from "zod"

export const deliveryItemSchema = z.object({
    poLineItemId: z.string().min(1, "Line item is required"),
    qtyDelivered: z.number().min(0.01, "Qty must be > 0"),
    condition: z.enum(["GOOD", "DAMAGED", "PARTIAL"]),
})


export const deliveryRecordSchema = z.object({
    poId: z.string().min(1, "Purchase order is required"),
    deliveryDate: z.string().min(1, "Delivery date is required"),
    dispatchedBy: z.string().optional().or(z.literal("")),
    receivedBy: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    items: z.array(deliveryItemSchema).min(1, "Add at least one delivery item"),
})

export type DeliveryItemValues = z.infer<typeof deliveryItemSchema>
export type DeliveryRecordValues = z.infer<typeof deliveryRecordSchema>

export const vpSettingSchema = z.object({
    category: z.string().min(1, "Category is required"),
    name: z.string().min(1, "Name is required"),
    value: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
})

export type VpSettingValues = z.infer<typeof vpSettingSchema>