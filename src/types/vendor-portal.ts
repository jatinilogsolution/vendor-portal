// src/types/vendor-portal.ts

export const VP_PO_STATUSES = [
    "DRAFT", "SUBMITTED", "APPROVED",
    "SENT_TO_VENDOR", "ACKNOWLEDGED", "CLOSED", "REJECTED",
] as const
export type VpPoStatus = (typeof VP_PO_STATUSES)[number]

export const VP_PI_STATUSES = [
    "DRAFT", "SUBMITTED", "APPROVED",
    "SENT_TO_VENDOR", "ACCEPTED", "DECLINED", "REJECTED",
] as const
export type VpPiStatus = (typeof VP_PI_STATUSES)[number]

export const VP_INVOICE_STATUSES = [
    "DRAFT", "SUBMITTED", "UNDER_REVIEW",
    "APPROVED", "REJECTED", "PAYMENT_INITIATED", "PAYMENT_CONFIRMED",
] as const
export type VpInvoiceStatus = (typeof VP_INVOICE_STATUSES)[number]

export const VP_PAYMENT_STATUSES = [
    "INITIATED", "PROCESSING", "COMPLETED", "FAILED",
] as const
export type VpPaymentStatus = (typeof VP_PAYMENT_STATUSES)[number]

export const VP_DELIVERY_STATUSES = [
    "PENDING", "PARTIAL_DELIVERY", "FULLY_DELIVERED", "APPROVED",
] as const
export type VpDeliveryStatus = (typeof VP_DELIVERY_STATUSES)[number]

export const VP_VENDOR_TYPES = ["STANDARD", "IT"] as const
export const VP_BILLING_TYPES = ["ONE_TIME", "RECURRING", "RENTAL"] as const
export const VP_RECURRING_CYCLES = ["MONTHLY", "QUARTERLY", "YEARLY"] as const
export const VP_PAYMENT_MODES = ["NEFT", "RTGS", "CHEQUE", "UPI"] as const

export type VpVendorType = (typeof VP_VENDOR_TYPES)[number]
export type VpBillingType = (typeof VP_BILLING_TYPES)[number]
export type VpRecurringCycle = (typeof VP_RECURRING_CYCLES)[number]
export type VpPaymentMode = (typeof VP_PAYMENT_MODES)[number]

export const VP_ENTITY_TYPES = [
    "VpVendor", "VpCategory", "VpItem",
    "VpPurchaseOrder", "VpProformaInvoice",
    "VpInvoice", "VpPayment", "VpDeliveryRecord",
    "VpProcurement",
] as const
export type VpEntityType = (typeof VP_ENTITY_TYPES)[number]

export const VP_NOTIFICATION_TYPES = [
    "PO_SUBMITTED", "PO_APPROVED", "PO_REJECTED", "PO_SENT_TO_VENDOR", "PO_ACKNOWLEDGED",
    "PI_SUBMITTED", "PI_APPROVED", "PI_REJECTED", "PI_SENT_TO_VENDOR", "PI_ACCEPTED", "PI_DECLINED",
    "INVOICE_SUBMITTED", "INVOICE_APPROVED", "INVOICE_REJECTED",
    "PAYMENT_INITIATED", "PAYMENT_CONFIRMED",
    "DELIVERY_CREATED", "DELIVERY_APPROVED",
] as const
export type VpNotificationType = (typeof VP_NOTIFICATION_TYPES)[number]

export type VpListParams = {
    page?: number
    per_page?: number
    search?: string
    status?: string
    from?: string
    to?: string
    vendorId?: string
    categoryId?: string
    type?: string
}

export type VpPaginationMeta = {
    page: number
    per_page: number
    total: number
    total_pages: number
}

export type VpListResult<T> = {
    data: T[]
    meta: VpPaginationMeta
}

export type VpActionResult<T = null> =
    | { success: true; data: T; message?: string }
    | { success: false; error: string }

// ── Status label maps ──────────────────────────────────────────
export const VP_PO_STATUS_LABELS: Record<VpPoStatus, string> = {
    DRAFT: "Draft", SUBMITTED: "Submitted", APPROVED: "Approved",
    SENT_TO_VENDOR: "Sent to Vendor", ACKNOWLEDGED: "Acknowledged",
    CLOSED: "Closed", REJECTED: "Rejected",
}
export const VP_INVOICE_STATUS_LABELS: Record<VpInvoiceStatus, string> = {
    DRAFT: "Draft", SUBMITTED: "Submitted", UNDER_REVIEW: "Under Review",
    APPROVED: "Approved", REJECTED: "Rejected",
    PAYMENT_INITIATED: "Payment Initiated", PAYMENT_CONFIRMED: "Payment Confirmed",
}
export const VP_PI_STATUS_LABELS: Record<VpPiStatus, string> = {
    DRAFT: "Draft", SUBMITTED: "Submitted", APPROVED: "Approved",
    SENT_TO_VENDOR: "Sent to Vendor", ACCEPTED: "Accepted",
    DECLINED: "Declined", REJECTED: "Rejected",
}
export const VP_BILLING_TYPE_LABELS: Record<VpBillingType, string> = {
    ONE_TIME: "One-Time", RECURRING: "Recurring", RENTAL: "Rental",
}
export const VP_RECURRING_CYCLE_LABELS: Record<VpRecurringCycle, string> = {
    MONTHLY: "Monthly", QUARTERLY: "Quarterly", YEARLY: "Yearly",
}