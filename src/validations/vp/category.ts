// src/validations/vp/category.ts
import { z } from "zod"

export const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    code: z.string().max(20).optional().or(z.literal("")),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
    parentId: z.string().optional().or(z.literal("")),
})

export type CategoryFormValues = z.infer<typeof categorySchema>