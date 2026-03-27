// src/validations/vp/vendor.ts
import { z } from "zod"

export const vpVendorSchema = z.object({
    existingVendorId: z.string().min(1, "Please select a vendor"),
    categoryId: z.string().optional().or(z.literal("")),
    portalStatus: z.enum(["ACTIVE", "INACTIVE"]),
    vendorType: z.enum(["STANDARD", "IT"]),
    billingType: z.array(z.enum(["ONE_TIME", "RECURRING", "RENTAL"])).default([]),
    recurringCycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
    if (data.billingType?.includes("RECURRING") && !data.recurringCycle) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring cycle is required for RECURRING billing",
            path: ["recurringCycle"],
        })
    }
})

export type VpVendorFormValues = z.infer<typeof vpVendorSchema>