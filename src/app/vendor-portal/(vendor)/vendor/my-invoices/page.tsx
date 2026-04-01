// src/app/vendor-portal/(vendor)/vendor/my-invoices/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconReceipt, IconPlus, IconRefresh } from "@tabler/icons-react"
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
import { Badge } from "@/components/ui/badge"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
import { getVpInvoices, VpInvoiceRow } from "@/actions/vp/invoice.action"
import { VP_INVOICE_STATUSES, VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"
import type { VpPaginationMeta } from "@/types/vendor-portal"

export default function VendorMyInvoicesPage() {
    const [invoices, setInvoices] = useState<VpInvoiceRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusF, setStatusF] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpInvoices({
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
    }, [from, page, perPage, statusF, to])

    useEffect(() => { load() }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="My Invoices"
                description={meta ? `${meta.total} invoice${meta.total !== 1 ? "s" : ""} submitted` : ""}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/vendor-portal/vendor/my-invoices/new">
                                <IconPlus className="mr-1 h-4 w-4" />
                                Submit Invoice
                            </Link>
                        </Button>
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
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : invoices.length === 0 ? (
                <VpEmptyState
                    icon={IconReceipt}
                    title="No invoices yet"
                    description="Submit your first invoice to get started."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice No.</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell>
                                        <Link
                                            href={`/vendor-portal/vendor/my-invoices/${inv.id}`}
                                            className="font-mono text-sm font-medium hover:underline"
                                        >
                                            {inv.invoiceNumber ?? "—"}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {inv.poNumber
                                            ? <Badge variant="outline" className="text-xs">PO: {inv.poNumber}</Badge>
                                            : inv.piNumber
                                                ? <Badge variant="outline" className="text-xs">PI: {inv.piNumber}</Badge>
                                                : <span className="text-xs text-muted-foreground">Open</span>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap gap-1">
                                                <Badge variant="secondary" className="text-xs">{inv.type}</Badge>
                                                <Badge variant="outline" className="text-xs">{inv.billType}</Badge>
                                                {inv.billType === "RECURRING" && inv.recurringCycle && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {VP_RECURRING_CYCLE_LABELS[inv.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS] || inv.recurringCycle}
                                                    </Badge>
                                                )}
                                            </div>
                                            {inv.recurringTitle && (
                                                <p className="text-[11px] text-muted-foreground">
                                                    {inv.recurringTitle}
                                                </p>
                                            )}
                                        </div>
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
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/vendor-portal/vendor/my-invoices/${inv.id}`}>View</Link>
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
