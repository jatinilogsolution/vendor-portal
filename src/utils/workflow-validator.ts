import { UserRoleEnum, AnnexureStatus, InvoiceStatus, FileGroupStatus, AnnexureStatusTransitions, InvoiceStatusTransitions } from "./constant";

/**
 * Validate if a user with a given role can transition an annexure to a new status
 */
export function canTransitionAnnexure(role: string, currentStatus: AnnexureStatus, targetStatus: AnnexureStatus): boolean {
    const allowedTransitions = AnnexureStatusTransitions[currentStatus];
    if (!allowedTransitions.includes(targetStatus)) return false;

    // Role-based restrictions
    switch (targetStatus) {
        case AnnexureStatus.PENDING_TADMIN_REVIEW:
            return role === UserRoleEnum.TVENDOR;
        case AnnexureStatus.PARTIALLY_APPROVED:
        case AnnexureStatus.HAS_REJECTIONS:
        case AnnexureStatus.PENDING_BOSS_REVIEW:
            return role === UserRoleEnum.TADMIN;
        case AnnexureStatus.REJECTED_BY_BOSS:
        case AnnexureStatus.APPROVED:
            return role === UserRoleEnum.BOSS;
        case AnnexureStatus.DRAFT:
            // Can return to draft if it has rejections and user is TVENDOR
            return role === UserRoleEnum.TVENDOR && (currentStatus === AnnexureStatus.HAS_REJECTIONS || currentStatus === AnnexureStatus.REJECTED_BY_BOSS);
        default:
            return false;
    }
}

/**
 * Validate if a user can transition an invoice to a new status
 */
export function canTransitionInvoice(role: string, currentStatus: InvoiceStatus, targetStatus: InvoiceStatus): boolean {
    const allowedTransitions = InvoiceStatusTransitions[currentStatus];
    if (!allowedTransitions.includes(targetStatus)) return false;

    switch (targetStatus) {
        case InvoiceStatus.PENDING_TADMIN_REVIEW:
            return role === UserRoleEnum.TVENDOR;
        case InvoiceStatus.REJECTED_BY_TADMIN:
        case InvoiceStatus.PENDING_BOSS_REVIEW:
            return role === UserRoleEnum.TADMIN;
        case InvoiceStatus.REJECTED_BY_BOSS:
        case InvoiceStatus.APPROVED:
        case InvoiceStatus.PAYMENT_APPROVED:
            return role === UserRoleEnum.BOSS;
        case InvoiceStatus.DRAFT:
            return role === UserRoleEnum.TVENDOR && (currentStatus === InvoiceStatus.REJECTED_BY_TADMIN || currentStatus === InvoiceStatus.REJECTED_BY_BOSS);
        default:
            return false;
    }
}

/**
 * Check if a user can review file groups in an annexure
 */
export function canReviewAnnexureGroups(role: string, annexureStatus: AnnexureStatus): boolean {
    return role === UserRoleEnum.TADMIN &&
        [AnnexureStatus.PENDING_TADMIN_REVIEW, AnnexureStatus.PARTIALLY_APPROVED, AnnexureStatus.HAS_REJECTIONS].includes(annexureStatus);
}

/**
 * Check if a user can edit an invoice
 * Restricted for TVENDOR: if it has an annexureId, they MUST edit via Annexure
 */
export function canEditInvoice(role: string, invoice: { status: InvoiceStatus; annexureId?: string | null }): { canEdit: boolean; reason?: string } {
    if (role !== UserRoleEnum.TVENDOR) return { canEdit: false, reason: "Unauthorized" };

    // Only DRAFT or REJECTED invoices can be edited
    const isEditableStatus = [
        InvoiceStatus.DRAFT,
        InvoiceStatus.REJECTED_BY_TADMIN,
        InvoiceStatus.REJECTED_BY_BOSS
    ].includes(invoice.status as InvoiceStatus);

    if (!isEditableStatus) return { canEdit: false, reason: "Invoice is not in an editable status" };

    // If it has an annexure, vendor can still update invoice metadata (number/file), 
    // but amounts are typically synced from the Annexure.
    if (invoice.annexureId && (invoice.status === InvoiceStatus.REJECTED_BY_TADMIN || invoice.status === InvoiceStatus.REJECTED_BY_BOSS)) {
        return {
            canEdit: true,
            reason: "This invoice is linked to an Annexure. You can update invoice details here, but for amount changes, please edit the Annexure."
        };
    }

    return { canEdit: true };
}

/**
 * Check if a user can edit an annexure
 */
export function canEditAnnexure(role: string, annexure: { status: AnnexureStatus; isInvoiced?: boolean }): { canEdit: boolean; reason?: string } {
    if (role !== UserRoleEnum.TVENDOR) return { canEdit: false, reason: "Unauthorized" };

    // Cannot edit if already invoiced (unless it's in a status where the invoice itself is rejected)
    // Actually, user wants to allow editing if rejected.
    const isEditableStatus = [
        AnnexureStatus.DRAFT,
        AnnexureStatus.HAS_REJECTIONS,
        AnnexureStatus.REJECTED_BY_BOSS
    ].includes(annexure.status as AnnexureStatus);

    if (!isEditableStatus) return { canEdit: false, reason: "Annexure is not in an editable status" };

    return { canEdit: true };
}
