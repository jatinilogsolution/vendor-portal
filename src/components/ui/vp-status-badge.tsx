// src/components/vendor-portal/ui/vp-status-badge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_MAP: Record<string, { label: string; className: string }> = {
    // Generic
    ACTIVE: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" },
    INACTIVE: { label: "Inactive", className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400" },
    ARCHIVED: { label: "Archived", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400" },
    // PO / PI
    DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-600 border-slate-200" },
    SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400" },
    APPROVED: { label: "Approved", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400" },
    SENT_TO_VENDOR: { label: "Sent to Vendor", className: "bg-violet-100 text-violet-700 border-violet-200" },
    ACKNOWLEDGED: { label: "Acknowledged", className: "bg-teal-100 text-teal-700 border-teal-200" },
    CLOSED: { label: "Closed", className: "bg-slate-100 text-slate-500 border-slate-200" },
    ACCEPTED: { label: "Accepted", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    DECLINED: { label: "Declined", className: "bg-orange-100 text-orange-700 border-orange-200" },
    // Invoice
    UNDER_REVIEW: { label: "Under Review", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    PAYMENT_INITIATED: { label: "Payment Initiated", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    PAYMENT_CONFIRMED: { label: "Payment Confirmed", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    // Payment
    INITIATED: { label: "Initiated", className: "bg-blue-100 text-blue-700 border-blue-200" },
    PROCESSING: { label: "Processing", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    FAILED: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
    // Delivery
    PENDING: { label: "Pending", className: "bg-slate-100 text-slate-600 border-slate-200" },
    PARTIAL_DELIVERY: { label: "Partial", className: "bg-amber-100 text-amber-700 border-amber-200" },
    FULLY_DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    // Vendor types
    STANDARD: { label: "Standard", className: "bg-slate-100 text-slate-600 border-slate-200" },
    IT: { label: "IT", className: "bg-purple-100 text-purple-700 border-purple-200" },
    ONE_TIME: { label: "One-Time", className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    RECURRING: { label: "Recurring", className: "bg-blue-100 text-blue-700 border-blue-200" },
    RENTAL: { label: "Rental", className: "bg-orange-100 text-orange-700 border-orange-200" },
    OPEN_FOR_QUOTES: { label: "Open for Quotes", className: "bg-violet-100 text-violet-700 border-violet-200" },
    QUOTE_SELECTED: { label: "Quote Selected", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-600 border-red-200" },
    INVITED: { label: "Invited", className: "bg-blue-100 text-blue-700 border-blue-200" },
    QUOTED: { label: "Quoted", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    SELECTED: { label: "Selected", className: "bg-violet-100 text-violet-700 border-violet-200" },
    ADVANCE: { label: "Advance", className: "bg-amber-100 text-amber-700 border-amber-200" },

}

interface VpStatusBadgeProps {
    status: string
    className?: string
}

export function VpStatusBadge({ status, className }: VpStatusBadgeProps) {
    const config = STATUS_MAP[status] ?? { label: status, className: "bg-slate-100 text-slate-600" }
    return (
        <Badge
            variant="outline"
            className={cn("text-xs font-medium", config.className, className)}
        >
            {config.label}
        </Badge>
    )
}