// src/validations/vp/item.ts
import { z } from "zod"

export const UOM_OPTIONS = [
    "PCS", "KG", "MTR", "LTR", "HRS", "DAYS",
    "SET", "BOX", "PKT", "TON", "SQM", "RMT",
] as const

export const itemSchema = z.object({
    code: z.string().min(1, "Code is required").max(50),
    name: z.string().min(2, "Name is required").max(200),
    uom: z.string().min(1, "UOM is required"),
    defaultPrice: z.number().min(0, "Price must be positive"),
    hsnCode: z.string().max(20).optional().or(z.literal("")),
    description: z.string().max(500).optional().or(z.literal("")),
    categoryId: z.string().optional().or(z.literal("")),
})

export type ItemFormValues = z.infer<typeof itemSchema>