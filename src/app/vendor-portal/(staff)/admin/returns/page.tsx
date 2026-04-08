"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconPackage, IconPlus, IconRefresh, IconCheck } from "@tabler/icons-react"
import { useSession } from "@/lib/auth-client"
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
import type { VpPaginationMeta } from "@/types/vendor-portal"
import { VP_RETURN_STATUSES } from "@/types/vendor-portal"
import {
    completeVpReturn,
    getVpReturns,
    VpReturnRow,
} from "@/actions/vp/return.action"

export default function AdminReturnsPage() {
    const { data: session } = useSession()
    const [returns, setReturns] = useState<VpReturnRow[]>([])
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
        const result = await getVpReturns({
            status: statusF || undefined,
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
    }, [from, page, perPage, statusF, to])

    useEffect(() => {
        load()
    }, [load])

    const handleComplete = (id: string) =>
        startTransition(async () => {
            const result = await completeVpReturn(id)
            if (!result.success) {
                toast.error(result.error)
                return
            }
            toast.success("Return marked done")
            load()
        })

    const canComplete = session?.user?.role === "ADMIN"

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Returns"
                description={meta ? `${meta.total} return record${meta.total !== 1 ? "s" : ""}` : ""}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        {canComplete && (
                            <Button size="sm" asChild>
                                <Link href="/vendor-portal/admin/returns/new">
                                    <IconPlus className="mr-1 h-4 w-4" />
                                    Record Return
                                </Link>
                            </Button>
                        )}
                    </div>
                }
            />

            <div className="flex justify-end gap-4">
                <Select value={statusF} onValueChange={(value) => { setStatusF(value); setPage(1) }}>
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {VP_RETURN_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status.replaceAll("_", " ")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                    ))}
                </div>
            ) : returns.length === 0 ? (
                <VpEmptyState
                    icon={IconPackage}
                    title="No return records"
                    description="Schedule vendor return pickups here."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Expected Pickup</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Items</TableHead>
                                <TableHead className="w-40" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {returns.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="text-sm font-medium">{row.vendor.name}</TableCell>
                                    <TableCell className="text-sm">{row.invoice?.invoiceNumber ?? "—"}</TableCell>
                                    <TableCell className="text-sm">
                                        {row.expectedPickupDate
                                            ? new Date(row.expectedPickupDate).toLocaleDateString("en-IN")
                                            : "—"}
                                    </TableCell>
                                    <TableCell><VpStatusBadge status={row.status} /></TableCell>
                                    <TableCell className="text-center text-sm">{row._count.items}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            {canComplete && row.status === "EXPECTED" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleComplete(row.id)}
                                                    disabled={isPending}
                                                >
                                                    <IconCheck size={14} className="mr-1" />
                                                    Mark Done
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/vendor-portal/admin/returns/${row.id}`}>View</Link>
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
                    onPerPage={(value) => { setPerPage(value); setPage(1) }}
                />
            )}
        </div>
    )
}
