// src/app/vendor-portal/(vendor)/vendor/my-deliveries/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconTruckDelivery, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"

import { getVpDeliveries, VpDeliveryRow } from "@/actions/vp/delivery.action"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
import type { VpPaginationMeta } from "@/types/vendor-portal"

export default function VendorMyDeliveriesPage() {
    const [deliveries, setDeliveries] = useState<VpDeliveryRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpDeliveries({
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setDeliveries(res.data.data)
        setMeta(res.data.meta)
        setLoading(false)
    }, [from, page, perPage, to])

    useEffect(() => { load() }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="My Deliveries"
                description={meta ? `${meta.total} delivery record${meta.total !== 1 ? "s" : ""}` : ""}
                actions={
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                    </Button>
                }
            />
            <VpDateFilter
                from={from}
                to={to}
                onFrom={(v) => { setFrom(v); setPage(1) }}
                onTo={(v) => { setTo(v); setPage(1) }}
                onClear={() => { setFrom(""); setTo(""); setPage(1) }}
            />

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : deliveries.length === 0 ? (
                <VpEmptyState
                    icon={IconTruckDelivery}
                    title="No deliveries recorded"
                    description="Delivery records for your POs will appear here."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PO Number</TableHead>
                                <TableHead>Delivery Date</TableHead>
                                <TableHead className="text-center">Items</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell>
                                        <span className="font-mono text-sm font-medium">{d.po.poNumber}</span>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {d.deliveryDate
                                            ? new Date(d.deliveryDate).toLocaleDateString("en-IN")
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">{d._count.items}</TableCell>
                                    <TableCell><VpStatusBadge status={d.status} /></TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/vendor-portal/admin/deliveries/${d.id}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {meta && (
                <VpPagination
                    meta={meta}
                    onPage={setPage}
                    onPerPage={(v) => { setPerPage(v); setPage(1) }}
                />
            )}
        </div>
    )
}
