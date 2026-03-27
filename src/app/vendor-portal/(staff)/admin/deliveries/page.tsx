// src/app/vendor-portal/(admin)/admin/deliveries/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconTruckDelivery, IconPlus, IconRefresh, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
 import {
    getVpDeliveries, approveVpDelivery, VpDeliveryRow,
} from "@/actions/vp/delivery.action"
import { VP_DELIVERY_STATUSES } from "@/types/vendor-portal"
import type { VpPaginationMeta } from "@/types/vendor-portal"
import { VpExportButton } from "@/components/ui/vp-export-button"

export default function AdminDeliveriesPage() {
    const [deliveries, setDeliveries] = useState<VpDeliveryRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusF, setStatusF] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [isPending, startTransition] = useTransition()

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpDeliveries({
            status: statusF || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setDeliveries(res.data.data)
        setMeta(res.data.meta)
        setLoading(false)
    }, [from, page, perPage, statusF, to])

    useEffect(() => { load() }, [load])

    const handleApprove = (id: string) =>
        startTransition(async () => {
            const res = await approveVpDelivery(id)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Delivery approved")
            load()
        })

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Deliveries"
                description={meta ? `${meta.total} delivery records` : ""}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/vendor-portal/admin/deliveries/new">
                                <IconPlus className="mr-1 h-4 w-4" />
                                Record Delivery
                            </Link>
                        </Button>
                        <VpExportButton
                            data={deliveries}
                            filename="deliveries"
                            disabled={loading}
                            columns={[
                                { header: "PO Number", accessor: (r) => r.po.poNumber },
                                { header: "Vendor", accessor: (r) => r.po.vendorName },
                                {
                                    header: "Delivery Date",
                                    accessor: (r) => r.deliveryDate
                                        ? new Date(r.deliveryDate).toLocaleDateString("en-IN")
                                        : "",
                                },
                                { header: "Status", accessor: (r) => r.status },
                                { header: "Items", accessor: (r) => r._count.items },
                            ]}
                        />
                    </div>
                }
            />

            <div className="flex justify-end">
                <Select value={statusF} onValueChange={(v) => { setStatusF(v); setPage(1) }}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* >All Statuses</SelectItem> */}
                        {VP_DELIVERY_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <VpDateFilter
                from={from}
                to={to}
                onFrom={(v) => { setFrom(v); setPage(1) }}
                onTo={(v) => { setTo(v); setPage(1) }}
                onClear={() => { setFrom(""); setTo(""); setPage(1) }}
            />

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : deliveries.length === 0 ? (
                <VpEmptyState
                    icon={IconTruckDelivery}
                    title="No delivery records"
                    description="Record deliveries against acknowledged purchase orders."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PO Number</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Delivery Date</TableHead>
                                <TableHead>Received By</TableHead>
                                <TableHead className="text-center">Items</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-36" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell>
                                        <Link
                                            href={`/vendor-portal/admin/deliveries/${d.id}`}
                                            className="font-mono text-sm font-medium hover:underline"
                                        >
                                            {d.po.poNumber}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-sm">{d.po.vendorName}</TableCell>
                                    <TableCell className="text-sm">
                                        {d.deliveryDate
                                            ? new Date(d.deliveryDate).toLocaleDateString("en-IN")
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-sm">{d.receivedBy ?? "—"}</TableCell>
                                    <TableCell className="text-center text-sm">{d._count.items}</TableCell>
                                    <TableCell><VpStatusBadge status={d.status} /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            {d.status === "FULLY_DELIVERED" && (
                                                <Button
                                                    size="sm" variant="outline"
                                                    className="text-emerald-600 hover:text-emerald-700"
                                                    onClick={() => handleApprove(d.id)}
                                                    disabled={isPending}
                                                >
                                                    <IconCheck size={14} className="mr-1" />
                                                    Approve
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/vendor-portal/admin/deliveries/${d.id}`}>View</Link>
                                            </Button>
                                        </div>
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
