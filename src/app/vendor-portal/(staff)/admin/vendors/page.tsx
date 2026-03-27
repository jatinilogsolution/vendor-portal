// src/app/vendor-portal/(admin)/admin/vendors/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
    IconBuildingStore, IconPlus,
    IconSearch, IconRefresh, IconLayoutGrid, IconList,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

import { VendorCard } from "./_components/vendor-card"
import { EnrollVendorDialog } from "./_components/enroll-vendor-dialog"
import { getVpVendors, VpVendorRow } from "@/actions/vp/vendor.action"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import { VP_BILLING_TYPE_LABELS } from "@/types/vendor-portal"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"

type ViewMode = "grid" | "table"

export default function AdminVendorsPage() {
    const { data: session } = useSession()
    const canEdit = ["ADMIN", "BOSS"].includes(session?.user?.role ?? "")

    const [vendors, setVendors] = useState<VpVendorRow[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusF, setStatusF] = useState("")
    const [typeF, setTypeF] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [enrollOpen, setEnrollOpen] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        const result = await getVpVendors({
            search: search || undefined,
            status: statusF || undefined,
            type: typeF || undefined,
            per_page: 50,
        })
        if (!result.success) { toast.error(result.error); setLoading(false); return }
        setVendors(result.data.data)
        setTotal(result.data.meta.total)
        setLoading(false)
    }, [search, statusF, typeF])

    useEffect(() => {
        const t = setTimeout(load, 300)
        return () => clearTimeout(t)
    }, [load])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Vendors"
                description={`${total} vendors enrolled in the portal`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        {/* View toggle */}
                        <div className="flex rounded-md border">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm" className="rounded-r-none border-0 px-3"
                                onClick={() => setViewMode("grid")}
                            >
                                <IconLayoutGrid size={15} />
                            </Button>
                            <Button
                                variant={viewMode === "table" ? "default" : "ghost"}
                                size="sm" className="rounded-l-none border-0 border-l px-3"
                                onClick={() => setViewMode("table")}
                            >
                                <IconList size={15} />
                            </Button>
                        </div>
                        {canEdit && (
                            <Button size="sm" onClick={() => setEnrollOpen(true)}>
                                <IconPlus className="mr-1 h-4 w-4" />
                                Enroll Vendor
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by vendor name..."
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
                        {/* >All Status</SelectItem> */}
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeF} onValueChange={setTypeF}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* >All Types</SelectItem> */}
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Content */}
            {loading ? (
                viewMode === "grid"
                    ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-64 w-full rounded-lg" />
                            ))}
                        </div>
                    )
                    : (
                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    )
            ) : vendors.length === 0
                ? (
                    <VpEmptyState
                        icon={IconBuildingStore}
                        title="No vendors enrolled"
                        description="Enroll vendors to start creating purchase orders and managing invoices."
                        action={canEdit ? { label: "Enroll Vendor", onClick: () => setEnrollOpen(true) } : undefined}
                    />
                )
                : viewMode === "grid"
                    ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {vendors.map((v) => (
                                <VendorCard key={v.id} vendor={v} canEdit={canEdit} onRefresh={load} />
                            ))}
                        </div>
                    )
                    : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Billing</TableHead>
                                        <TableHead>POs</TableHead>
                                        <TableHead>Bills</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-20" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vendors.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{v.vendor.name}</p>
                                                    {v.vendor.contactEmail && (
                                                        <p className="text-xs text-muted-foreground">{v.vendor.contactEmail}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {v.categoryName
                                                    ? <Badge variant="outline" className="text-xs">{v.categoryName}</Badge>
                                                    : <span className="text-xs text-muted-foreground">—</span>
                                                }
                                            </TableCell>
                                            <TableCell><VpStatusBadge status={v.vendorType} /></TableCell>
                                            <TableCell>
                                                {v.billingType?.length > 0
                                                    ? <div className="flex flex-wrap gap-1">
                                                        {v.billingType.map(bt => (
                                                            <Badge key={bt} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                                                                {VP_BILLING_TYPE_LABELS[bt as keyof typeof VP_BILLING_TYPE_LABELS] || bt}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    : <span className="text-xs text-muted-foreground">—</span>
                                                }
                                            </TableCell>
                                            <TableCell className="text-sm">{v._count.purchaseOrders}</TableCell>
                                            <TableCell className="text-sm">{v._count.invoices}</TableCell>
                                            <TableCell><VpStatusBadge status={v.portalStatus} /></TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/vendor-portal/admin/vendors/${v.id}`}>View</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )
            }

            {canEdit && (
                <EnrollVendorDialog
                    open={enrollOpen}
                    onClose={() => setEnrollOpen(false)}
                    onSuccess={load}
                />
            )}
        </div>
    )
}