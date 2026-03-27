// src/app/(admin)/admin/procurement/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconClipboardList, IconPlus, IconSearch, IconRefresh,
} from "@tabler/icons-react"
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
import {
    getVpProcurements, VpProcurementRow,
} from "@/actions/vp/procurement.action"
import { VpPaginationMeta } from "@/types/vendor-portal"
import { VpExportButton } from "@/components/ui/vp-export-button"

const PR_STATUSES = [
    "DRAFT", "SUBMITTED", "APPROVED", "OPEN_FOR_QUOTES",
    "QUOTE_SELECTED", "CLOSED", "CANCELLED",
] as const

export default function AdminProcurementPage() {
    const [prs, setPrs] = useState<VpProcurementRow[]>([])
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
        const res = await getVpProcurements({
            search: search || undefined,
            status: statusF || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setPrs(res.data.data)
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
                title="Procurement Requests"
                description={meta ? `${meta.total} requests total` : ""}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/vendor-portal/admin/procurement/new">
                                <IconPlus className="mr-1 h-4 w-4" />
                                New Request
                            </Link>
                        </Button>
                        <VpExportButton
                            data={prs}
                            filename="procurement-requests"
                            disabled={loading}
                            columns={[
                                { header: "PR Number", accessor: (r) => r.prNumber },
                                { header: "Title", accessor: (r) => r.title },
                                { header: "Category", accessor: (r) => r.categoryName ?? "" },
                                { header: "Status", accessor: (r) => r.status },
                                { header: "Est. Value", accessor: (r) => r.grandTotal },
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
            <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by title or PR number…"
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
                            {PR_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{s.replaceAll("_", " ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <VpDateFilter
                        from={from} to={to}
                        onFrom={(v) => { setFrom(v); setPage(1) }}
                        onTo={(v) => { setTo(v); setPage(1) }}
                        onClear={() => { setFrom(""); setTo(""); setPage(1) }}
                    />
                </div>

            </div>

            {/* Table */}
            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : prs.length === 0 ? (
                <VpEmptyState
                    icon={IconClipboardList}
                    title="No procurement requests"
                    description="Create a procurement request to invite vendors to quote."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PR Number</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-center">Vendors</TableHead>
                                <TableHead className="text-center">Quotes</TableHead>
                                <TableHead className="text-right">Est. Value</TableHead>
                                <TableHead>Required By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prs.map((pr) => (
                                <TableRow key={pr.id}>
                                    <TableCell>
                                        <Link
                                            href={`/vendor-portal/admin/procurement/${pr.id}`}
                                            className="font-mono text-sm font-medium hover:underline"
                                        >
                                            {pr.prNumber}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="max-w-48">
                                        <p className="truncate text-sm">{pr.title}</p>
                                    </TableCell>
                                    <TableCell>
                                        {pr.categoryName
                                            ? <Badge variant="outline" className="text-xs">{pr.categoryName}</Badge>
                                            : <span className="text-xs text-muted-foreground">—</span>
                                        }
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {pr._count.vendorInvites}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        <Badge
                                            variant={pr._count.proformaInvoices > 0 ? "secondary" : "outline"}
                                            className="text-xs"
                                        >
                                            {pr._count.proformaInvoices}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-sm">
                                        ₹{pr.grandTotal.toLocaleString("en-IN")}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {pr.requiredByDate
                                            ? new Date(pr.requiredByDate).toLocaleDateString("en-IN")
                                            : "—"}
                                    </TableCell>
                                    <TableCell><VpStatusBadge status={pr.status} /></TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/vendor-portal/admin/procurement/${pr.id}`}>
                                                View
                                            </Link>
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
