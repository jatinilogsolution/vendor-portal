// src/validations/vp/vendor.ts
import { z } from "zod"

export const vpVendorSchema = z.object({
    existingVendorId: z.string().min(1, "Please select a vendor"),
    categoryIds: z.array(z.string()).default([]),
    portalStatus: z.enum(["ACTIVE", "INACTIVE"]),
    vendorType: z.enum(["STANDARD", "IT"]),
    billingType: z.array(z.enum(["ONE_TIME", "RECURRING", "RENTAL"])).default([]),
    recurringCycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]).optional().or(z.literal("")),
    companyIds: z.array(z.string()).min(1, "Assign at least one company"),
    defaultInvoiceCompanyId: z.string().optional().or(z.literal("")),
    restrictInvoiceToDefaultCompany: z.boolean().default(false),
}).superRefine((data, ctx) => {
    if (data.billingType?.includes("RECURRING") && !data.recurringCycle) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring cycle is required for RECURRING billing",
            path: ["recurringCycle"],
        })
    }

    if (data.defaultInvoiceCompanyId && !data.companyIds.includes(data.defaultInvoiceCompanyId)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Default invoice company must be one of the assigned companies",
            path: ["defaultInvoiceCompanyId"],
        })
    }

    if (data.restrictInvoiceToDefaultCompany && !data.defaultInvoiceCompanyId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select a default invoice company before restricting vendor invoices",
            path: ["defaultInvoiceCompanyId"],
        })
    }
})

export type VpVendorFormValues = z.infer<typeof vpVendorSchema>
