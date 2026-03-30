// src/app/vendor-portal/(boss)/boss/vendors/page.tsx
// Boss sees read-only table view — no enroll/edit actions
"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { IconBuildingStore, IconSearch, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

import { getVpVendors, VpVendorRow } from "@/actions/vp/vendor.action"
import { VP_BILLING_TYPE_LABELS } from "@/types/vendor-portal"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"

export default function BossVendorsPage() {
    const [vendors, setVendors] = useState<VpVendorRow[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusF, setStatusF] = useState("")

    const load = useCallback(async () => {
        setLoading(true)
        const result = await getVpVendors({
            search: search || undefined,
            status: statusF || undefined,
            per_page: 50,
        })
        if (!result.success) { toast.error(result.error); setLoading(false); return }
        setVendors(result.data.data)
        setTotal(result.data.meta.total)
        setLoading(false)
    }, [search, statusF])

    useEffect(() => {
        const t = setTimeout(load, 300)
        return () => clearTimeout(t)
    }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Vendors"
                description={`${total} vendors enrolled`}
                actions={
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                    </Button>
                }
            />

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search vendors..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusF} onValueChange={setStatusF}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : vendors.length === 0 ? (
                <VpEmptyState icon={IconBuildingStore} title="No vendors found" />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Billing</TableHead>
                                <TableHead>GST</TableHead>
                                <TableHead className="text-center">POs</TableHead>
                                <TableHead className="text-center">Bills</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vendors.map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm font-medium">{v.vendor.name}</p>
                                            {v.vendor.contactEmail && (
                                                <p className="text-xs text-muted-foreground">{v.vendor.contactEmail}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {v.categoryNames.length > 0
                                            ? <div className="flex flex-wrap gap-1">
                                                {v.categoryNames.map((categoryName) => (
                                                    <Badge key={categoryName} variant="outline" className="text-xs">
                                                        {categoryName}
                                                    </Badge>
                                                ))}
                                            </div>
                                            : <span className="text-xs text-muted-foreground">—</span>
                                        }
                                    </TableCell>
                                    <TableCell><VpStatusBadge status={v.vendorType} /></TableCell>
                                    <TableCell>
                                        {v.billingType && v.billingType.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {v.billingType.map((bt) => (
                                                    <Badge key={bt} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                                                        {VP_BILLING_TYPE_LABELS[bt as keyof typeof VP_BILLING_TYPE_LABELS] || bt}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs">{v.vendor.gstNumber ?? "—"}</code>
                                    </TableCell>
                                    <TableCell className="text-center text-sm">{v._count.purchaseOrders}</TableCell>
                                    <TableCell className="text-center text-sm">{v._count.invoices}</TableCell>
                                    <TableCell><VpStatusBadge status={v.portalStatus} /></TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/vendor-portal/boss/vendors/${v.id}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
} 
