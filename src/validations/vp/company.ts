import { z } from "zod"

export const vpCompanySchema = z.object({
    name: z.string().min(2, "Company name is required"),
    code: z.string().optional().or(z.literal("")),
    legalName: z.string().optional().or(z.literal("")),
    gstin: z.string().optional().or(z.literal("")),
    pan: z.string().optional().or(z.literal("")),
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    isActive: z.boolean().default(true),
})

export type VpCompanyFormValues = z.infer<typeof vpCompanySchema>
