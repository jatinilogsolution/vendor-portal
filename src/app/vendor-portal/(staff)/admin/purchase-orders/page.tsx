// src/app/vendor-portal/(admin)/admin/purchase-orders/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconShoppingCart, IconPlus, IconSearch, IconRefresh,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { getVpPurchaseOrders, VpPoRow } from "@/actions/vp/purchase-order.action"
import { VP_PO_STATUSES } from "@/types/vendor-portal"
import type { VpPaginationMeta } from "@/types/vendor-portal"
import { VpExportButton } from "@/components/ui/vp-export-button"

export default function AdminPurchaseOrdersPage() {
    const [pos, setPos] = useState<VpPoRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusF, setStatusF] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpPurchaseOrders({
            search: search || undefined,
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
    }, [from, page, perPage, search, statusF, to])

    useEffect(() => {
        const t = setTimeout(load, 300)
        return () => clearTimeout(t)
    }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Purchase Orders"
                description={meta ? `${meta.total} orders total` : ""}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/vendor-portal/admin/purchase-orders/new">
                                <IconPlus className="mr-1 h-4 w-4" />
                                New PO
                            </Link>
                        </Button>
                        <VpExportButton
                            data={pos}
                            filename="purchase-orders"
                            disabled={loading}
                            columns={[
                                { header: "PO Number", accessor: (r) => r.poNumber },
                                { header: "Vendor", accessor: (r) => r.vendor.vendorName },
                                { header: "Amount", accessor: (r) => r.grandTotal },
                                { header: "Status", accessor: (r) => r.status },
                                {
                                    header: "Created",
                                    accessor: (r) => new Date(r.createdAt).toLocaleDateString("en-IN"),
                                },
                            ]}
                        />
                    </div>
                }
            />

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by PO number…"
                        className="pl-9"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>
                <Select value={statusF} onValueChange={(v) => { setStatusF(v); setPage(1) }}>
                    <SelectTrigger className="w-full sm:w-48">
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

            {/* Table */}
            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : pos.length === 0 ? (
                <VpEmptyState
                    icon={IconShoppingCart}
                    title="No purchase orders"
                    description="Create your first purchase order to get started."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PO Number</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pos.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell>
                                        <Link
                                            href={`/vendor-portal/admin/purchase-orders/${po.id}`}
                                            className="font-mono text-sm font-medium hover:underline"
                                        >
                                            {po.poNumber}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-sm">{po.vendor.vendorName}</TableCell>
                                    <TableCell>
                                        {po.categoryName
                                            ? <span className="text-xs">{po.categoryName}</span>
                                            : <span className="text-xs text-muted-foreground">—</span>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-sm">
                                        ₹{po.grandTotal.toLocaleString("en-IN")}
                                    </TableCell>
                                    <TableCell><VpStatusBadge status={po.status} /></TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(po.createdAt).toLocaleDateString("en-IN")}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/vendor-portal/admin/purchase-orders/${po.id}`}>View</Link>
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
