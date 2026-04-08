"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconPackage, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { getVpReturns, VpReturnRow } from "@/actions/vp/return.action"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
import type { VpPaginationMeta } from "@/types/vendor-portal"

export default function VendorMyReturnsPage() {
    const [returns, setReturns] = useState<VpReturnRow[]>([])
    const [meta, setMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        const result = await getVpReturns({
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!result.success) {
            toast.error(result.error)
            setLoading(false)
            return
        }
        setReturns(result.data.data)
        setMeta(result.data.meta)
        setLoading(false)
    }, [from, page, perPage, to])

    useEffect(() => {
        load()
    }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="My Returns"
                description={meta ? `${meta.total} return record${meta.total !== 1 ? "s" : ""}` : ""}
                actions={
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                    </Button>
                }
            />

<div className=" flex w-full justify-end">

            <VpDateFilter
                from={from}
                to={to}
                onFrom={(value) => { setFrom(value); setPage(1) }}
                onTo={(value) => { setTo(value); setPage(1) }}
                onClear={() => { setFrom(""); setTo(""); setPage(1) }}
            />
</div>

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                    ))}
                </div>
            ) : returns.length === 0 ? (
                <VpEmptyState
                    icon={IconPackage}
                    title="No returns scheduled"
                    description="Scheduled product returns will appear here."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Expected Pickup</TableHead>
                                <TableHead>Pickup Person</TableHead>
                                <TableHead className="text-center">Items</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {returns.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="text-sm">{row.invoice?.invoiceNumber ?? "—"}</TableCell>
                                    <TableCell className="text-sm">
                                        {row.expectedPickupDate
                                            ? new Date(row.expectedPickupDate).toLocaleDateString("en-IN")
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-sm">{row.pickupPersonName ?? "—"}</TableCell>
                                    <TableCell className="text-center text-sm">{row._count.items}</TableCell>
                                    <TableCell><VpStatusBadge status={row.status} /></TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/vendor-portal/vendor/my-returns/${row.id}`}>View</Link>
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
                    onPerPage={(value) => { setPerPage(value); setPage(1) }}
                />
            )}
        </div>
    )
}
