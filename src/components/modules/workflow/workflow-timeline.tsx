"use client";

import { Check, Clock, X, AlertCircle, Forward, User, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    InvoiceStatus,
    AnnexureStatus,
    InvoiceStatusLabels,
    AnnexureStatusLabels
} from "@/utils/constant";

interface WorkflowLog {
    id: string;
    createdAt: Date | string;
    fromStatus: string | null;
    toStatus: string;
    changedBy: string;
    notes?: string | null;
    changedByUser?: {
        name?: string | null;
        email?: string | null;
    } | null;
}

interface WorkflowTimelineProps {
    logs: WorkflowLog[];
    type: "invoice" | "annexure";
}

export function WorkflowTimeline({ logs, type }: WorkflowTimelineProps) {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground text-sm">
                No status history available.
            </div>
        );
    }

    // Sort logs by date descending (newest first)
    const sortedLogs = [...logs].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const getStatusLabel = (status: string) => {
        if (type === "invoice") {
            return InvoiceStatusLabels[status as InvoiceStatus] || status;
        }
        return AnnexureStatusLabels[status as AnnexureStatus] || status;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case InvoiceStatus.APPROVED:
            case AnnexureStatus.APPROVED:
                return <Check className="h-4 w-4 text-green-600" />;
            case InvoiceStatus.PAYMENT_APPROVED:
                return <CreditCard className="h-4 w-4 text-emerald-600" />;
            case InvoiceStatus.REJECTED_BY_TADMIN:
            case InvoiceStatus.REJECTED_BY_BOSS:
            case AnnexureStatus.REJECTED_BY_BOSS:
            case AnnexureStatus.HAS_REJECTIONS:
                return <X className="h-4 w-4 text-destructive" />;
            case InvoiceStatus.PENDING_TADMIN_REVIEW:
            case AnnexureStatus.PENDING_TADMIN_REVIEW:
                return <Clock className="h-4 w-4 text-blue-600" />;
            case InvoiceStatus.PENDING_BOSS_REVIEW:
            case AnnexureStatus.PENDING_BOSS_REVIEW:
            case AnnexureStatus.PARTIALLY_APPROVED:
                return <Forward className="h-4 w-4 text-blue-600" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getIconBg = (status: string) => {
        switch (status) {
            case InvoiceStatus.APPROVED:
            case AnnexureStatus.APPROVED:
                return "bg-green-100 border-green-200";
            case InvoiceStatus.PAYMENT_APPROVED:
                return "bg-emerald-100 border-emerald-200";
            case InvoiceStatus.REJECTED_BY_TADMIN:
            case InvoiceStatus.REJECTED_BY_BOSS:
            case AnnexureStatus.REJECTED_BY_BOSS:
            case AnnexureStatus.HAS_REJECTIONS:
                return "bg-red-100 border-red-200";
            default:
                return "bg-gray-100 border-gray-200";
        }
    };

    return (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {sortedLogs.map((log, index) => (
                <div key={log.id} className="relative flex items-start gap-4 pl-0">
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border shadow-sm z-10 shrink-0",
                        getIconBg(log.toStatus)
                    )}>
                        {getStatusIcon(log.toStatus)}
                    </div>
                    <div className="flex flex-col pt-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                                Status changed to <span className="text-primary">{getStatusLabel(log.toStatus)}</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                            </span>
                        </div>
                        {log.notes && (
                            <p className="text-sm text-muted-foreground mt-1 italic">
                                "{log.notes}"
                            </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>
                                By: {log.changedByUser?.name || log.changedBy}
                                {log.changedByUser?.email && ` (${log.changedByUser.email})`}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
