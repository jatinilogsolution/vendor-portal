"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    InvoiceStatus,
    AnnexureStatus,
    InvoiceStatusLabels,
    AnnexureStatusLabels,
    InvoiceStatusColors,
} from "@/utils/constant";
import { cn } from "@/lib/utils";
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard,
    History
} from "lucide-react";

interface WorkflowStat {
    label: string;
    count: number;
    status: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
    isActive?: boolean;
}

interface WorkflowStatsDashboardProps {
    stats: WorkflowStat[];
    title?: string;
}

export function WorkflowStatsDashboard({ stats, title }: WorkflowStatsDashboardProps) {
    return (
        <div className="space-y-4 mb-6">
            {title && <h3 className="text-sm font-medium text-muted-foreground ml-1">{title}</h3>}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {stats.map((stat) => (
                    <Card
                        key={stat.status}
                        className={cn(
                            "cursor-pointer transition-all hover:ring-2 hover:ring-primary/20",
                            stat.isActive ? "ring-2 ring-primary border-primary bg-primary/5" : "bg-card"
                        )}
                        onClick={stat.onClick}
                    >
                        <CardContent className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-2 rounded-lg", stat.color)}>
                                    {stat.icon}
                                </div>
                                <span className="text-2xl font-bold">{stat.count}</span>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground truncate">
                                {stat.label}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Helper to generate Invoice stats
export function getInvoiceStats(counts: Record<string, number>, currentFilter?: string, onFilterChange?: (status: string) => void): WorkflowStat[] {
    const stats = [
        {
            status: "ALL",
            label: "All Invoices",
            count: Object.values(counts).reduce((a, b) => a + b, 0),
            icon: <FileText className="h-4 w-4" />,
            color: "bg-gray-100 text-gray-600",
        },
        {
            status: InvoiceStatus.PENDING_TADMIN_REVIEW,
            label: "Under Review",
            count: counts[InvoiceStatus.PENDING_TADMIN_REVIEW] || 0,
            icon: <Clock className="h-4 w-4" />,
            color: "bg-blue-100 text-blue-600",
        },
        {
            status: InvoiceStatus.PENDING_BOSS_REVIEW,
            label: "Final Review",
            count: counts[InvoiceStatus.PENDING_BOSS_REVIEW] || 0,
            icon: <History className="h-4 w-4" />,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            status: InvoiceStatus.APPROVED,
            label: "Approved",
            count: counts[InvoiceStatus.APPROVED] || 0,
            icon: <CheckCircle className="h-4 w-4" />,
            color: "bg-green-100 text-green-600",
        },
        {
            status: InvoiceStatus.PAYMENT_APPROVED,
            label: "Payment Authorized",
            count: counts[InvoiceStatus.PAYMENT_APPROVED] || 0,
            icon: <CreditCard className="h-4 w-4" />,
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            status: "REJECTED", // Combined TADMIN and BOSS rejections for simplicity in dashboard
            label: "Rejected",
            count: (counts[InvoiceStatus.REJECTED_BY_TADMIN] || 0) + (counts[InvoiceStatus.REJECTED_BY_BOSS] || 0),
            icon: <XCircle className="h-4 w-4" />,
            color: "bg-red-100 text-red-600",
        }
    ];

    return stats.map(s => ({
        ...s,
        isActive: currentFilter === s.status,
        onClick: () => onFilterChange?.(s.status)
    }));
}

// Helper to generate Annexure stats
export function getAnnexureStats(counts: Record<string, number>, currentFilter?: string, onFilterChange?: (status: string) => void): WorkflowStat[] {
    const stats = [
        {
            status: "ALL",
            label: "All Annexures",
            count: Object.values(counts).reduce((a, b) => a + b, 0),
            icon: <FileText className="h-4 w-4" />,
            color: "bg-gray-100 text-gray-600",
        },
        {
            status: AnnexureStatus.PENDING_TADMIN_REVIEW,
            label: "Under Review",
            count: counts[AnnexureStatus.PENDING_TADMIN_REVIEW] || 0,
            icon: <Clock className="h-4 w-4" />,
            color: "bg-blue-100 text-blue-600",
        },
        {
            status: AnnexureStatus.PARTIALLY_APPROVED,
            label: "Partially Approved",
            count: counts[AnnexureStatus.PARTIALLY_APPROVED] || 0,
            icon: <AlertCircle className="h-4 w-4" />,
            color: "bg-orange-100 text-orange-600",
        },
        {
            status: AnnexureStatus.PENDING_BOSS_REVIEW,
            label: "Final Review",
            count: counts[AnnexureStatus.PENDING_BOSS_REVIEW] || 0,
            icon: <History className="h-4 w-4" />,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            status: AnnexureStatus.APPROVED,
            label: "Approved",
            count: counts[AnnexureStatus.APPROVED] || 0,
            icon: <CheckCircle className="h-4 w-4" />,
            color: "bg-green-100 text-green-600",
        },
        {
            status: AnnexureStatus.HAS_REJECTIONS,
            label: "Rejections",
            count: counts[AnnexureStatus.HAS_REJECTIONS] || 0,
            icon: <XCircle className="h-4 w-4" />,
            color: "bg-red-100 text-red-600",
        }
    ];

    return stats.map(s => ({
        ...s,
        isActive: currentFilter === s.status,
        onClick: () => onFilterChange?.(s.status)
    }));
}
