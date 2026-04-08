// src/app/(vendor)/vendor/my-quotes/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconFileInvoice, IconPlus, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
import { getVpProformaInvoices, VpPiRow } from "@/actions/vp/proforma-invoice.action"
import { getOpenProcurementsForVendor } from "@/actions/vp/procurement.action"
import type { VpPaginationMeta } from "@/types/vendor-portal"

export default function VendorMyQuotesPage() {
    const [pis, setPis] = useState<VpPiRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [openPrs, setOpenPrs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        const [piRes, prRes] = await Promise.all([
            getVpProformaInvoices({
                from: from || undefined,
                to: to || undefined,
                page,
                per_page: perPage,
            }),
            getOpenProcurementsForVendor(),
        ])
        if (piRes.success) { setPis(piRes.data.data); setMeta(piRes.data.meta) }
        if (prRes.success) setOpenPrs(prRes.data)
        setLoading(false)
    }, [from, page, perPage, to])

    useEffect(() => { load() }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="My Quotes (Proforma Invoices)"
                description="Submit quotes against procurement requests."
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/vendor-portal/vendor/my-quotes/new">
                                <IconPlus className="mr-1 h-4 w-4" />
                                Submit Quote
                            </Link>
                        </Button>
                    </div>
                }
            />

            

             <div className=" w-full flex justify-end">
            
                     <VpDateFilter
                from={from}
                to={to}
                onFrom={(v) => { setFrom(v); setPage(1) }}
                onTo={(v) => { setTo(v); setPage(1) }}
                onClear={() => { setFrom(""); setTo(""); setPage(1) }}
            />
                        </div>
           

            {/* Open procurement invitations */}
            {openPrs.length > 0 && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                    <p className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-400">
                        🔔 {openPrs.length} open procurement{openPrs.length > 1 ? "s" : ""} awaiting your quote
                    </p>
                    <div className="space-y-1">
                        {openPrs.map((pr) => (
                            <div key={pr.id} className="flex items-center justify-between">
                                <span className="text-sm text-amber-700 dark:text-amber-300">
                                    {pr.prNumber} — {pr.title}
                                    {pr.requiredByDate && (
                                        <span className="ml-2 text-xs">
                                            (Due: {new Date(pr.requiredByDate).toLocaleDateString("en-IN")})
                                        </span>
                                    )}
                                </span>
                                <Button size="sm" variant="outline" asChild className="border-amber-300 text-amber-800">
                                    <Link href={`/vendor-portal/vendor/my-quotes/new?procurementId=${pr.id}`}>
                                        Submit Quote
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : pis.length === 0 ? (
                <VpEmptyState
                    icon={IconFileInvoice}
                    title="No quotes submitted yet"
                    description="Submit a proforma invoice to respond to procurement requests."
                />
            ) : (
                <div className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PI Number</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Valid Until</TableHead>
                                    <TableHead>Fulfillment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-20" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pis.map((pi) => (
                                    <TableRow key={pi.id}>
                                        <TableCell>
                                            <Link
                                                href={`/vendor-portal/vendor/my-quotes/${pi.id}`}
                                                className="font-mono text-sm font-medium hover:underline"
                                            >
                                                {pi.piNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {pi.convertedToPoId ? "Converted to PO" : "Quote"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-sm">
                                            ₹{pi.grandTotal.toLocaleString("en-IN")}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {pi.validityDate
                                                ? new Date(pi.validityDate).toLocaleDateString("en-IN")
                                                : "—"}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {(pi as any).fulfillmentDate
                                                ? new Date((pi as any).fulfillmentDate).toLocaleDateString("en-IN")
                                                : "—"}
                                        </TableCell>
                                        <TableCell><VpStatusBadge status={pi.status} /></TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/vendor-portal/vendor/my-quotes/${pi.id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {meta && <VpPagination meta={meta} onPage={setPage} onPerPage={(v) => { setPerPage(v); setPage(1) }} />}
                </div>
            )}
        </div>
    )
}
