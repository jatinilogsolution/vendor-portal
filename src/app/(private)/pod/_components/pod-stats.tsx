"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck2, FileX2, Clock, Package, Receipt, FolderOpen } from "lucide-react"
import { EnrichedLRRequest } from "../_actions/get"

interface PodStatsProps {
    data: EnrichedLRRequest[]
    onFilterClick?: (type: 'status' | 'invoice', value: string) => void
}

export function PodStats({ data, onFilterClick }: PodStatsProps) {
    // Calculate statistics
    const stats = {
        total: data.length,
        verified: data.filter(lr => lr.status === 'VERIFIED').length,
        pending: data.filter(lr => !lr.status || lr.status === 'PENDING').length,
        wrong: data.filter(lr => lr.status === 'WRONG').length,
        invoiced: data.filter(lr => lr.invoiceId).length,
        annexed: data.filter(lr => lr.annexureId).length,
    }

    const statCards = [
        {
            label: "Total LRs",
            value: stats.total,
            icon: Package,
            bgColor: "bg-blue-500/10",
            iconColor: "text-blue-600",
            borderColor: "border-blue-200",
            filterType: null,
            filterValue: null
        },
        {
            label: "Verified",
            value: stats.verified,
            icon: FileCheck2,
            bgColor: "bg-green-500/10",
            iconColor: "text-green-600",
            borderColor: "border-green-200",
            filterType: 'status' as const,
            filterValue: 'verified'
        },
        {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            bgColor: "bg-yellow-500/10",
            iconColor: "text-yellow-600",
            borderColor: "border-yellow-200",
            filterType: 'status' as const,
            filterValue: 'pending'
        },
        {
            label: "Wrong/Rejected",
            value: stats.wrong,
            icon: FileX2,
            bgColor: "bg-red-500/10",
            iconColor: "text-red-600",
            borderColor: "border-red-200",
            filterType: 'status' as const,
            filterValue: 'wrong'
        },
        {
            label: "Invoiced",
            value: stats.invoiced,
            icon: Receipt,
            bgColor: "bg-purple-500/10",
            iconColor: "text-purple-600",
            borderColor: "border-purple-200",
            filterType: 'invoice' as const,
            filterValue: 'invoiced'
        },
        {
            label: "Annexed",
            value: stats.annexed,
            icon: FolderOpen,
            bgColor: "bg-cyan-500/10",
            iconColor: "text-cyan-600",
            borderColor: "border-cyan-200",
            filterType: null,
            filterValue: null
        },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {statCards.map((stat) => {
                const Icon = stat.icon
                const isClickable = stat.filterType && stat.filterValue && onFilterClick

                return (
                    <Card
                        key={stat.label}
                        className={`border ${stat.borderColor} shadow-sm transition-all ${isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-105' : 'hover:shadow-md'
                            }`}
                        onClick={() => {
                            if (isClickable) {
                                onFilterClick(stat.filterType, stat.filterValue)
                            }
                        }}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground truncate">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
