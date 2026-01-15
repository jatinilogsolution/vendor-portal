import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    InvoiceStatus,
    AnnexureStatus,
    FileGroupStatus,
    InvoiceStatusLabels,
    AnnexureStatusLabels,
    FileGroupStatusLabels,
    InvoiceStatusColors,
    FileGroupStatusColors
} from "@/utils/constant";
import { getRoleSpecificStatusLabel } from "@/utils/workflow-utils";

interface StatusBadgeProps {
    status: string;
    type: "invoice" | "annexure" | "fileGroup";
    className?: string;
    role?: string;
}

export function WorkflowStatusBadge({ status, type, className, role }: StatusBadgeProps) {
    let label = status;
    let colorClass = "bg-gray-100 text-gray-800";

    const displayLabel = role 
        ? getRoleSpecificStatusLabel(status, role, type)
        : (type === "invoice" ? InvoiceStatusLabels[status as InvoiceStatus] 
           : type === "annexure" ? AnnexureStatusLabels[status as AnnexureStatus]
           : FileGroupStatusLabels[status as FileGroupStatus]) || status;

    if (type === "invoice") {
        colorClass = InvoiceStatusColors[status as InvoiceStatus] || colorClass;
    } else if (type === "annexure") {
        // Map annexure status colors to similar invoice colors for consistency
        const statusMap: Record<string, InvoiceStatus> = {
            [AnnexureStatus.DRAFT]: InvoiceStatus.DRAFT,
            [AnnexureStatus.PENDING_TADMIN_REVIEW]: InvoiceStatus.PENDING_TADMIN_REVIEW,
            [AnnexureStatus.PARTIALLY_APPROVED]: InvoiceStatus.PENDING_BOSS_REVIEW,
            [AnnexureStatus.HAS_REJECTIONS]: InvoiceStatus.REJECTED_BY_TADMIN,
            [AnnexureStatus.PENDING_BOSS_REVIEW]: InvoiceStatus.PENDING_BOSS_REVIEW,
            [AnnexureStatus.REJECTED_BY_BOSS]: InvoiceStatus.REJECTED_BY_BOSS,
            [AnnexureStatus.APPROVED]: InvoiceStatus.APPROVED,
        };
        colorClass = InvoiceStatusColors[statusMap[status]] || colorClass;
    } else if (type === "fileGroup") {
        colorClass = FileGroupStatusColors[status as FileGroupStatus] || colorClass;
    }

    return (
        <Badge variant="outline" className={cn("px-2 py-0.5 font-medium border shadow-xs", colorClass, className)}>
            {displayLabel}
        </Badge>
    );
}
