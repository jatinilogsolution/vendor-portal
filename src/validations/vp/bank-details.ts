// src/validations/vp/bank-details.ts
import { z } from "zod"

export const bankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name required"),
  accountNumber:     z.string().min(8, "Account number required"),
  ifscCode:          z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  bankName:          z.string().min(2, "Bank name required"),
  branch:            z.string().optional().or(z.literal("")),
  accountType:       z.enum(["SAVINGS", "CURRENT"]).default("CURRENT"),
})

export type BankDetailsValues = z.infer<typeof bankDetailsSchema>