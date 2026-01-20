import { 
    InvoiceStatus, 
    UserRoleEnum, 
    AnnexureStatus, 
    InvoiceStatusLabels, 
    AnnexureStatusLabels, 
    FileGroupStatusLabels, 
    FileGroupStatus 
} from "./constant";

/**
 * Returns a role-specific status label for display in the UI.
 * For example, an "APPROVED" invoice might show as "Processing for Payment" to VENDORs.
 */
export function getRoleSpecificStatusLabel(
    status: string,
    role: string,
    type: "invoice" | "annexure" | "fileGroup"
): string {
    const isVendor = role === UserRoleEnum.TVENDOR;

    if (type === "invoice") {
        if (isVendor) {
            switch (status) {
                case InvoiceStatus.APPROVED:
                    return "Processing for Payment";
                case InvoiceStatus.PAYMENT_APPROVED:
                    return "Payment Authorized";
                case InvoiceStatus.PENDING_BOSS_REVIEW:
                case InvoiceStatus.PENDING_TADMIN_REVIEW:
                    return "Under Review";
                case InvoiceStatus.REJECTED_BY_TADMIN:
                case InvoiceStatus.REJECTED_BY_BOSS:
                    return "Needs Revision";
                default:
                    return (InvoiceStatusLabels[status as InvoiceStatus] || status.replace(/_/g, " ")).replace(/\b\w/g, (l: string) => l.toUpperCase());
            }
        }
        return InvoiceStatusLabels[status as InvoiceStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    }

    if (type === "annexure") {
        if (isVendor) {
            switch (status) {
                case AnnexureStatus.PENDING_TADMIN_REVIEW:
                case AnnexureStatus.PENDING_BOSS_REVIEW:
                    return "Under Review";
                case AnnexureStatus.HAS_REJECTIONS:
                case AnnexureStatus.REJECTED_BY_BOSS:
                    return "Needs Revision";
                case AnnexureStatus.APPROVED:
                    return "Approved";
                default:
                    return (AnnexureStatusLabels[status as AnnexureStatus] || status.replace(/_/g, " ")).replace(/\b\w/g, (l: string) => l.toUpperCase());
            }
        }
        return AnnexureStatusLabels[status as AnnexureStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    }

    if (type === "fileGroup") {
        return FileGroupStatusLabels[status as FileGroupStatus] || status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }

    // Default fallback
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase());
}
