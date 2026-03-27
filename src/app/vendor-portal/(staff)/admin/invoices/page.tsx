// src/app/vendor-portal/(admin)/admin/invoices/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconReceipt, IconSearch, IconRefresh } from "@tabler/icons-react"
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
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
import { VpExportButton } from "@/components/ui/vp-export-button"
import {
    getVpInvoices, startVpInvoiceReview, VpInvoiceRow,
} from "@/actions/vp/invoice.action"
import { VP_INVOICE_STATUSES } from "@/types/vendor-portal"
import type { VpPaginationMeta } from "@/types/vendor-portal"

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<VpInvoiceRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusF, setStatusF] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [isPending, startTransition] = useTransition()

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpInvoices({
            search: search || undefined,
            status: statusF || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setInvoices(res.data.data)
        setMeta(res.data.meta)
        setLoading(false)
    }, [from, page, perPage, search, statusF, to])

    useEffect(() => {
        const t = setTimeout(load, 300)
        return () => clearTimeout(t)
    }, [load])

    const handleStartReview = (id: string) => {
        startTransition(async () => {
            const res = await startVpInvoiceReview(id)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Invoice moved to Under Review")
            load()
        })
    }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Vendor Bills"
                description={meta ? `${meta.total} invoices received` : ""}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <VpExportButton
                            data={invoices}
                            filename="vendor-invoices"
                            disabled={loading}
                            columns={[
                                { header: "Invoice No.", accessor: (r) => r.invoiceNumber ?? "" },
                                { header: "Vendor", accessor: (r) => r.vendor.vendorName },
                                { header: "Amount", accessor: (r) => r.totalAmount },
                                { header: "Status", accessor: (r) => r.status },
                                {
                                    header: "Submitted",
                                    accessor: (r) => r.submittedAt
                                        ? new Date(r.submittedAt).toLocaleDateString("en-IN")
                                        : "",
                                },
                            ]}
                        />
                    </div>
                }
            />

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by invoice number…"
                        className="pl-9"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>
                <Select value={statusF} onValueChange={(v) => { setStatusF(v); setPage(1) }}>
                    <SelectTrigger className="w-full sm:w-52">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* >All Statuses</SelectItem> */}
                        {VP_INVOICE_STATUSES.map((s) => (
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
            ) : invoices.length === 0 ? (
                <VpEmptyState icon={IconReceipt} title="No invoices received yet" />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice No.</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="w-36" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell>
                                        <Link
                                            href={`/vendor-portal/admin/invoices/${inv.id}`}
                                            className="font-mono text-sm font-medium hover:underline"
                                        >
                                            {inv.invoiceNumber ?? "—"}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-sm">{inv.vendor.vendorName}</TableCell>
                                    <TableCell>
                                        {inv.poNumber
                                            ? <Badge variant="outline" className="text-xs">PO: {inv.poNumber}</Badge>
                                            : inv.piNumber
                                                ? <Badge variant="outline" className="text-xs">PI: {inv.piNumber}</Badge>
                                                : <span className="text-xs text-muted-foreground">Open</span>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-sm">
                                        ₹{inv.totalAmount.toLocaleString("en-IN")}
                                    </TableCell>
                                    <TableCell><VpStatusBadge status={inv.status} /></TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {inv.submittedAt
                                            ? new Date(inv.submittedAt).toLocaleDateString("en-IN")
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            {inv.status === "SUBMITTED" && (
                                                <Button
                                                    size="sm" variant="outline"
                                                    className="text-xs"
                                                    disabled={isPending}
                                                    onClick={() => handleStartReview(inv.id)}
                                                >
                                                    Start Review
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/vendor-portal/admin/invoices/${inv.id}`}>View</Link>
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
