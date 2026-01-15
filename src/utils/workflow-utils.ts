import { InvoiceStatus, UserRoleEnum, AnnexureStatus } from "./constant";

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
                    return status.replace(/_/g, " ");
            }
        }
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
                default:
                    return status.replace(/_/g, " ");
            }
        }
    }

    // Default: format the enum key nicely
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}
