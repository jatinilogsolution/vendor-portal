"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconShoppingCart, IconRefresh, IconCheck } from "@tabler/icons-react"
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
    getVpPurchaseOrders, acknowledgeVpPo, VpPoRow,
} from "@/actions/vp/purchase-order.action"
import { VP_PO_STATUSES } from "@/types/vendor-portal"
import type { VpPaginationMeta } from "@/types/vendor-portal"

export default function VendorMyPosPage() {
    const [pos, setPos] = useState<VpPoRow[]>([])
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
        const res = await getVpPurchaseOrders({
            status: statusF || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setPos(res.data.data)
        setMeta(res.data.meta)
        setLoading(false)
    }, [from, page, perPage, statusF, to])

    useEffect(() => { load() }, [load])

    const handleAck = (id: string) => {
        startTransition(async () => {
            const res = await acknowledgeVpPo(id)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Purchase order acknowledged")
            load()
        })
    }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="My Purchase Orders"
                description="View purchase orders assigned to your vendor account."
                actions={
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                    </Button>
                }
            />

            {/* Filter */}
            <div className="flex justify-end space-x-4">
                <Select value={statusF} onValueChange={(v) => { setStatusF(v); setPage(1) }}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* >All Statuses</SelectItem> */}
                        {VP_PO_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <VpDateFilter
                from={from}
                to={to}
                onFrom={(v) => { setFrom(v); setPage(1) }}
                onTo={(v) => { setTo(v); setPage(1) }}
                onClear={() => { setFrom(""); setTo(""); setPage(1) }}
            />
            </div>
            

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : pos.length === 0 ? (
                <VpEmptyState
                    icon={IconShoppingCart}
                    title="No purchase orders"
                    description="Purchase orders from your client will appear here."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PO Number</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Delivery Date</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-32" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pos.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell>
                                        <Link
                                            href={`/vendor-portal/vendor/my-pos/${po.id}`}
                                            className="font-mono text-sm font-medium hover:underline"
                                        >
                                            {po.poNumber}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-sm">
                                        ₹{po.grandTotal.toLocaleString("en-IN")}
                                    </TableCell>
                                    <TableCell><VpStatusBadge status={po.status} /></TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {po.deliveryDate
                                            ? new Date(po.deliveryDate).toLocaleDateString("en-IN")
                                            : "—"
                                        }
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(po.createdAt).toLocaleDateString("en-IN")}
                                    </TableCell>
                                    <TableCell>
                                        {po.status === "SENT_TO_VENDOR" ? (
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => handleAck(po.id)}
                                                disabled={isPending}
                                            >
                                                <IconCheck size={14} className="mr-1.5" />
                                                Acknowledge
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/vendor-portal/vendor/my-pos/${po.id}`}>View</Link>
                                            </Button>
                                        )}
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
