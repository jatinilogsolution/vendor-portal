// ⚠️  Admin/Boss no longer CREATES proforma invoices.
// PIs are now raised by vendors in response to procurement requests.
// This page is READ-ONLY — shows all vendor-submitted PIs for review.

"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconFileInvoice, IconSearch, IconRefresh, IconInfoCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { VpPagination } from "@/components/ui/vp-pagination"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { getVpProformaInvoices, VpPiRow } from "@/actions/vp/proforma-invoice.action"
import { VP_PI_STATUSES, VpPaginationMeta } from "@/types/vendor-portal"

export default function AdminProformaInvoicesPage() {
    const [pis, setPis] = useState<VpPiRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusF, setStatusF] = useState("")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpProformaInvoices({
            search: search || undefined,
            status: statusF || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setPis(res.data.data)
        setMeta(res.data.meta)
        setLoading(false)
    }, [search, statusF, from, to, page, perPage])

    useEffect(() => {
        const t = setTimeout(load, 300)
        return () => clearTimeout(t)
    }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Vendor Quotes (Proforma Invoices)"
                description={meta ? `${meta.total} quotes received from vendors` : ""}
                // No "New PI" button — vendors raise PIs via procurement requests
                actions={
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                    </Button>
                }
            />

            {/* Info banner */}
            <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
                <IconInfoCircle size={16} className="mt-0.5 shrink-0 text-blue-600" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Proforma Invoices are raised by vendors in response to{" "}
                    <Link
                        href="/vendor-portal/admin/procurement"
                        className="font-semibold underline hover:no-underline"
                    >
                        Procurement Requests
                    </Link>
                    . Go to Procurement to invite vendors to quote.
                </p>
            </div>

            {/* Filters */}
            <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by PI number…"
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
                            {/* <SelectItem value="">All Statuses</SelectItem> */}
                            {VP_PI_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <VpDateFilter
                    from={from} to={to}
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
            ) : pis.length === 0 ? (
                <VpEmptyState
                    icon={IconFileInvoice}
                    title="No quotes yet"
                    description="Vendors will submit quotes after you create a procurement request."
                />
            ) : (
                <div className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PI Number</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Procurement</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Fulfillment</TableHead>
                                    <TableHead>Valid Until</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-20" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pis.map((pi) => (
                                    <TableRow key={pi.id}>
                                        <TableCell>
                                            <Link
                                                href={`/vendor-portal/admin/proforma-invoices/${pi.id}`}
                                                className="font-mono text-sm font-medium hover:underline"
                                            >
                                                {pi.piNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-sm">{pi.vendor.vendorName}</TableCell>
                                        <TableCell>
                                            {pi.procurementId
                                                ? (
                                                    <Link
                                                        href={`/vendor-portal/admin/procurement/${pi.procurementId}`}
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        View PR →
                                                    </Link>
                                                )
                                                : <Badge variant="outline" className="text-xs">Open Quote</Badge>
                                            }
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-sm">
                                            ₹{pi.grandTotal.toLocaleString("en-IN")}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {pi.fulfillmentDate
                                                ? new Date(pi.fulfillmentDate).toLocaleDateString("en-IN")
                                                : "—"}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {pi.validityDate
                                                ? new Date(pi.validityDate).toLocaleDateString("en-IN")
                                                : "—"}
                                        </TableCell>
                                        <TableCell><VpStatusBadge status={pi.status} /></TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/vendor-portal/admin/proforma-invoices/${pi.id}`}>
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {meta && (
                        <VpPagination
                            meta={meta}
                            onPage={setPage}
                            onPerPage={(v) => { setPerPage(v); setPage(1) }}
                        />
                    )}
                </div>
            )}
        </div>
    )
}