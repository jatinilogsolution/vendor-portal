import { z } from "zod"

export const vpReturnItemSchema = z.object({
  itemId: z.string().optional().or(z.literal("")),
  invoiceLineItemId: z.string().optional().or(z.literal("")),
  customDescription: z.string().optional().or(z.literal("")),
  qty: z.coerce.number().min(0.01, "Qty must be > 0"),
  reason: z.string().optional().or(z.literal("")),
})

export const vpReturnSchema = z.object({
  vendorId: z.string().min(1, "Vendor is required"),
  invoiceId: z.string().optional().or(z.literal("")),
  expectedPickupDate: z.string().min(1, "Expected pickup date is required"),
  pickupPersonName: z.string().optional().or(z.literal("")),
  pickupPersonPhone: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  items: z.array(vpReturnItemSchema).min(1, "Add at least one return item"),
}).superRefine((data, ctx) => {
  data.items.forEach((item, index) => {
    if (data.invoiceId) {
      if (!item.invoiceLineItemId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select an item from the chosen invoice",
          path: ["items", index, "invoiceLineItemId"],
        })
      }
      return
    }

    if (!item.customDescription?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a custom item description",
        path: ["items", index, "customDescription"],
      })
    }
  })
})

export const vpVendorReturnScheduleSchema = z.object({
  expectedPickupDate: z.string().min(1, "Expected pickup date is required"),
  pickupPersonName: z.string().optional().or(z.literal("")),
  pickupPersonPhone: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

export type VpReturnItemValues = z.infer<typeof vpReturnItemSchema>
export type VpReturnFormValues = z.infer<typeof vpReturnSchema>
export type VpReturnFormInputValues = z.input<typeof vpReturnSchema>
export type VpVendorReturnScheduleValues = z.infer<typeof vpVendorReturnScheduleSchema>
