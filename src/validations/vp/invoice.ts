 

// // src/validations/vp/invoice.ts
// import { z } from "zod"

// export const vpInvoiceLineItemSchema = z.object({
//     description: z.string().min(1, "Description is required"),
//     qty: z.coerce.number().min(0.01, "Qty must be > 0"),
//     unitPrice: z.coerce.number().min(0, "Price must be ≥ 0"),
//     tax: z.coerce.number().min(0).max(100).default(0),
//     total: z.coerce.number(),
// })

// export const vpInvoiceSchema = z.object({
//     invoiceNumber: z.string().min(1, "Invoice number is required"),
//     type: z.enum(["PDF", "DIGITAL"]).default("DIGITAL"),
//     // Bill to
//     billTo: z.string().optional().or(z.literal("")),
//     billToGstin: z.string().optional().or(z.literal("")),
//     billToAddress: z.string().optional().or(z.literal("")),
//     // Optional links
//     poId: z.string().optional().or(z.literal("")),
//     piId: z.string().optional().or(z.literal("")),
//     notes: z.string().optional().or(z.literal("")),
//     taxRate: z.coerce.number().min(0).max(100).default(18),
//     items: z.array(vpInvoiceLineItemSchema).min(1, "Add at least one line item"),
// })

// export type VpInvoiceLineItemValues = z.infer<typeof vpInvoiceLineItemSchema>
// export type VpInvoiceFormValues = z.infer<typeof vpInvoiceSchema>

// export const vpPaymentSchema = z.object({
//     amount: z.coerce.number().min(1, "Amount is required"),
//     paymentMode: z.enum(["NEFT", "RTGS", "CHEQUE", "UPI"]),
//     transactionRef: z.string().optional().or(z.literal("")),
//     paymentDate: z.string().min(1, "Payment date is required"),
// })

// export type VpPaymentFormValues = z.infer<typeof vpPaymentSchema>


// src/validations/vp/invoice.ts
import { z } from "zod"

export const vpInvoiceLineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty:         z.coerce.number<number>().min(0.01, "Qty must be > 0"),
  unitPrice:   z.coerce.number<number>().min(0, "Price must be ≥ 0"),
  tax:         z.coerce.number<number>().min(0).max(100).default(0),
  total:       z.coerce.number<number>(),
})

export const vpInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  // ADVANCE removed — only STANDARD and RECURRING
  billType:      z.enum(["STANDARD", "RECURRING"]).default("STANDARD"),
  type:          z.enum(["PDF", "DIGITAL"]).default("DIGITAL"),
  // Bill-to (vendor selects from warehouse API)
  billToId:      z.string().optional().or(z.literal("")),
  billTo:        z.string().optional().or(z.literal("")),
  billToGstin:   z.string().optional().or(z.literal("")),
  // PO link only — no PI for vendor invoice
  poId:          z.string().optional().or(z.literal("")),
  notes:         z.string().optional().or(z.literal("")),
  taxRate:       z.coerce.number<number>().min(0).max(100).default(18),
  recurringScheduleId: z.string().optional().or(z.literal("")),
  items:         z.array(vpInvoiceLineItemSchema).min(1, "Add at least one line item"),
})

export type VpInvoiceLineItemValues = z.infer<typeof vpInvoiceLineItemSchema>
export type VpInvoiceFormValues     = z.infer<typeof vpInvoiceSchema>

export const vpPaymentSchema = z.object({
  amount:         z.coerce.number<number>().min(1, "Amount is required"),
  paymentMode:    z.enum(["NEFT", "RTGS", "CHEQUE", "UPI"]),
  transactionRef: z.string().optional().or(z.literal("")),
  paymentDate:    z.string().min(1, "Payment date is required"),
  proofUrl:       z.string().optional().or(z.literal("")),
})

export type VpPaymentFormValues = z.infer<typeof vpPaymentSchema>
