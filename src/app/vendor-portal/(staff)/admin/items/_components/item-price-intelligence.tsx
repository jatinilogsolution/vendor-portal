"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconRefresh, IconChevronDown } from "@tabler/icons-react"
import {
    getVpItemPriceInsights,
    getVpUnmatchedItems,
    VpItemPriceInsights,
    VpItemPriceHistoryRow,
    VpUnmatchedItemGroup,
    VpItemPriceSource,
} from "@/actions/vp/item.action"
import { getVpItems } from "@/actions/vp/item.action"
import { getVpVendors, VpVendorRow } from "@/actions/vp/vendor.action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
import type { VpPaginationMeta } from "@/types/vendor-portal"
import { UnmatchedItemDialog } from "./unmatched-item-dialog"

type ItemOption = {
    id: string
    code: string
    name: string
}

const SOURCES: Array<{ label: string; value: VpItemPriceSource | "ALL" }> = [
    { label: "All Sources", value: "ALL" },
    { label: "Purchase Orders", value: "PO" },
    { label: "Proforma Invoices", value: "PI" },
    { label: "Vendor Invoices", value: "INVOICE" },
]

function buildDocLink(row: VpItemPriceHistoryRow) {
    if (row.sourceType === "PO") return `/vendor-portal/admin/purchase-orders/${row.docId}`
    if (row.sourceType === "PI") return `/vendor-portal/admin/proforma-invoices/${row.docId}`
    return `/vendor-portal/admin/invoices/${row.docId}`
}

function formatSource(source: VpItemPriceSource) {
    if (source === "PO") return "PO"
    if (source === "PI") return "PI"
    return "INV"
}

export function ItemPriceIntelligence({
    categories,
    selectedItemId: externalSelectedItemId,
    onSelectItem,
}: {
    categories: { id: string; name: string }[]
    selectedItemId?: string
    onSelectItem?: (itemId: string) => void
}) {
    const [itemSearch, setItemSearch] = useState("")
    const [itemOpen, setItemOpen] = useState(false)
    const [itemOptions, setItemOptions] = useState<ItemOption[]>([])
    const [vendors, setVendors] = useState<VpVendorRow[]>([])
    const [selectedItemId, setSelectedItemId] = useState(externalSelectedItemId ?? "")
    const [selectedVendorId, setSelectedVendorId] = useState("")
    const [selectedSource, setSelectedSource] = useState<VpItemPriceSource | "ALL">("ALL")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [insights, setInsights] = useState<VpItemPriceInsights | null>(null)
    const [historyMeta, setHistoryMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(false)

    const [unmatchedVendorId, setUnmatchedVendorId] = useState("")
    const [unmatchedSource, setUnmatchedSource] = useState<VpItemPriceSource | "ALL">("ALL")
    const [unmatchedSearch, setUnmatchedSearch] = useState("")
    const [unmatchedFrom, setUnmatchedFrom] = useState("")
    const [unmatchedTo, setUnmatchedTo] = useState("")
    const [unmatchedPage, setUnmatchedPage] = useState(1)
    const [unmatchedPerPage, setUnmatchedPerPage] = useState(20)
    const [unmatchedRows, setUnmatchedRows] = useState<VpUnmatchedItemGroup[]>([])
    const [unmatchedMeta, setUnmatchedMeta] = useState<VpPaginationMeta | null>(null)
    const [unmatchedLoading, setUnmatchedLoading] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogRow, setDialogRow] = useState<VpUnmatchedItemGroup | null>(null)

    const [isPending, startTransition] = useTransition()

    const selectedItem = useMemo(
        () => itemOptions.find((item) => item.id === selectedItemId) ?? null,
        [itemOptions, selectedItemId],
    )

    const loadItemOptions = useCallback(async () => {
        const res = await getVpItems({
            search: itemSearch || undefined,
            per_page: 30,
        })
        if (!res.success) {
            toast.error(res.error)
            return
        }
        setItemOptions(res.data.data.map((row) => ({
            id: row.id,
            code: row.code,
            name: row.name,
        })))
    }, [itemSearch])

    const loadVendors = useCallback(async () => {
        const res = await getVpVendors({ per_page: 200, status: "ACTIVE" })
        if (!res.success) {
            toast.error(res.error)
            return
        }
        setVendors(res.data.data)
    }, [])

    const loadInsights = useCallback(async () => {
        if (!selectedItemId) {
            setInsights(null)
            setHistoryMeta(null)
            return
        }
        setLoading(true)
        const res = await getVpItemPriceInsights({
            itemId: selectedItemId,
            vendorId: selectedVendorId || undefined,
            source: selectedSource,
            from: from || undefined,
            to: to || undefined,
            page,
            per_page: perPage,
        })
        if (!res.success) {
            toast.error(res.error)
            setLoading(false)
            return
        }
        setInsights(res.data)
        setHistoryMeta(res.data.history.meta)
        setLoading(false)
    }, [selectedItemId, selectedVendorId, selectedSource, from, to, page, perPage])

    const loadUnmatched = useCallback(async () => {
        setUnmatchedLoading(true)
        const res = await getVpUnmatchedItems({
            vendorId: unmatchedVendorId || undefined,
            source: unmatchedSource,
            from: unmatchedFrom || undefined,
            to: unmatchedTo || undefined,
            search: unmatchedSearch || undefined,
            page: unmatchedPage,
            per_page: unmatchedPerPage,
        })
        if (!res.success) {
            toast.error(res.error)
            setUnmatchedLoading(false)
            return
        }
        setUnmatchedRows(res.data.data)
        setUnmatchedMeta(res.data.meta)
        setUnmatchedLoading(false)
    }, [unmatchedVendorId, unmatchedSource, unmatchedFrom, unmatchedTo, unmatchedSearch, unmatchedPage, unmatchedPerPage])

    useEffect(() => {
        loadVendors()
    }, [loadVendors])

    useEffect(() => {
        const t = setTimeout(loadItemOptions, 250)
        return () => clearTimeout(t)
    }, [loadItemOptions])

    useEffect(() => {
        const t = setTimeout(loadInsights, 250)
        return () => clearTimeout(t)
    }, [loadInsights])

    useEffect(() => {
        if (externalSelectedItemId !== undefined) {
            setSelectedItemId(externalSelectedItemId)
        }
    }, [externalSelectedItemId])

    useEffect(() => {
        const t = setTimeout(loadUnmatched, 250)
        return () => clearTimeout(t)
    }, [loadUnmatched])

    const resetHistoryPaging = () => {
        setPage(1)
        setPerPage(20)
    }

    return (
        <Card id="item-price-intelligence" className=" bg-background">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-sm">Item Price Intelligence</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Compare vendor pricing across PO, PI, and invoices with history and outliers.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { loadInsights(); loadUnmatched() }} disabled={loading || unmatchedLoading}>
                        <IconRefresh size={14} className={(loading || unmatchedLoading) ? "animate-spin" : ""} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs defaultValue="history">
                    <TabsList>
                        <TabsTrigger value="history">Price History</TabsTrigger>
                        <TabsTrigger value="unmatched">Unmatched Items</TabsTrigger>
                    </TabsList>

                    <TabsContent value="history" className="space-y-5">
                        <div className="grid gap-3 grid-cols-7 md:grid-cols-11">
                            <div className=" col-span-3">

                                <Popover open={itemOpen} onOpenChange={setItemOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="h-10 w-full justify-between"
                                        >
                                            <span className="truncate text-left text-sm">
                                                {selectedItem
                                                    ? `${selectedItem.code} · ${selectedItem.name}`
                                                    : "Search item by name/code"}
                                            </span>
                                            <IconChevronDown size={14} className="opacity-60" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search item by name/code"
                                                value={itemSearch}
                                                onValueChange={setItemSearch}
                                            />
                                            <CommandList>
                                                <CommandEmpty>No items found.</CommandEmpty>
                                                <CommandGroup>
                                                    {itemOptions.map((item) => (
                                                        <CommandItem
                                                            key={item.id}
                                                            value={`${item.code} ${item.name}`}
                                                            onSelect={() => {
                                                                setSelectedItemId(item.id)
                                                                onSelectItem?.(item.id)
                                                                resetHistoryPaging()
                                                                setItemOpen(false)
                                                            }}
                                                        >
                                                            <span className="truncate">{item.code} · {item.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className=" col-span-2">

                                <Select
                                    value={selectedVendorId}
                                    onValueChange={(value) => {
                                        setSelectedVendorId(value)
                                        resetHistoryPaging()
                                    }}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="All vendors" />
                                    </SelectTrigger>
                                    <SelectGroup>

                                        <SelectContent className=" w-full">
                                            <SelectLabel>All vendors</SelectLabel>
                                            {vendors.map((vendor) => (
                                                <SelectItem key={vendor.id} value={vendor.id}>
                                                    {vendor.vendor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </SelectGroup>

                                </Select>

                            </div>
                            <div className=" col-span-2">

                                <Select
                                    value={selectedSource}
                                    onValueChange={(value) => {
                                        setSelectedSource(value as VpItemPriceSource | "ALL")
                                        resetHistoryPaging()
                                    }}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="All sources" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SOURCES.map((source) => (
                                            <SelectItem key={source.value} value={source.value}>
                                                {source.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                            </div>
                            <div className=" col-span-4 flex justify-end">

                                <VpDateFilter
                                    from={from}
                                    to={to}
                                    onFrom={(value) => { setFrom(value); resetHistoryPaging() }}
                                    onTo={(value) => { setTo(value); resetHistoryPaging() }}
                                    onClear={() => { setFrom(""); setTo(""); resetHistoryPaging() }}
                                />
                            </div>

                        </div>


                        {selectedItem && (
                            <div className="text-xs text-muted-foreground">
                                Selected: <span className="font-medium text-foreground">{selectedItem.code}</span>
                            </div>
                        )}


                        {selectedItemId && insights?.item && (
                            <div className="grid gap-4 lg:grid-cols-2">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs">Top 5 Lowest Invoice Prices</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {insights.lowest.length === 0 ? (
                                            <p className="text-xs text-muted-foreground">No pricing data yet.</p>
                                        ) : (
                                            insights.lowest.map((row) => (
                                                <div
                                                    key={row.id}
                                                    className="flex items-start justify-between text-xs border-b py-2 last:border-0"
                                                >
                                                    <div className="space-y-1">
                                                        {/* Price + Vendor */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-primary text-sm">
                                                                ₹{row.unitPrice.toLocaleString("en-IN")}
                                                            </span>

                                                            <span className="text-muted-foreground">
                                                                {row.vendorName}
                                                            </span>
                                                        </div>

                                                        {/* Meta row */}
                                                        <div className="flex items-center flex-wrap gap-1 text-muted-foreground">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] px-1 py-0 h-4"
                                                            >
                                                                {formatSource(row.sourceType)}
                                                            </Badge>

                                                            <Link
                                                                href={buildDocLink(row)}
                                                                className="hover:underline"
                                                            >
                                                                {row.docNumber}
                                                            </Link>

                                                            {row.documentUrl && (
                                                                <>
                                                                    <span>•</span>
                                                                    <Link
                                                                        href={row.documentUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="hover:underline"
                                                                    >
                                                                        Proof
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Date */}
                                                    <span className="text-muted-foreground  whitespace-nowrap">
                                                        {new Date(row.docDate).toLocaleDateString("en-IN")}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>

                                <Card >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs">Top 5 Highest Invoice Prices</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {insights.highest.length === 0 ? (
                                            <p className="text-xs text-muted-foreground">No pricing data yet.</p>
                                        ) : (
                                            insights.highest.map((row) => (
                                                <div
                                                    key={row.id}
                                                    className="flex items-start justify-between text-xs border-b py-2 last:border-0 hover:bg-muted/40 px-2 rounded-md transition"
                                                >
                                                    <div className="space-y-1">
                                                        {/* Price + Vendor */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm text-destructive">
                                                                ₹{row.unitPrice.toLocaleString("en-IN")}
                                                            </span>

                                                            <span className="text-muted-foreground">
                                                                {row.vendorName}
                                                            </span>
                                                        </div>

                                                        {/* Meta */}
                                                        <div className="flex items-center flex-wrap gap-1 text-muted-foreground">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] px-1 py-0 h-4"
                                                            >
                                                                {formatSource(row.sourceType)}
                                                            </Badge>

                                                            <Link
                                                                href={buildDocLink(row)}
                                                                className="hover:underline"
                                                            >
                                                                {row.docNumber}
                                                            </Link>

                                                            {row.documentUrl && (
                                                                <>
                                                                    <span>•</span>
                                                                    <Link
                                                                        href={row.documentUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="hover:underline"
                                                                    >
                                                                        Proof
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Date */}
                                                    <span className="text-muted-foreground  whitespace-nowrap">
                                                        {new Date(row.docDate).toLocaleDateString("en-IN")}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {selectedItemId && insights?.vendorSummary.length ? (
                            <Card className=" bg-background">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs">Vendor Price Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Vendor</TableHead>
                                                <TableHead className="text-right">Min</TableHead>
                                                <TableHead className="text-right">Max</TableHead>
                                                <TableHead className="text-right">Avg</TableHead>
                                                <TableHead className="text-right">Latest</TableHead>
                                                <TableHead>Last Seen</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {insights.vendorSummary.map((row) => (
                                                <TableRow key={row.vendorId}>
                                                    <TableCell className="text-sm">{row.vendorName}</TableCell>
                                                    <TableCell className="text-right text-sm">₹{row.minPrice.toLocaleString("en-IN")}</TableCell>
                                                    <TableCell className="text-right text-sm">₹{row.maxPrice.toLocaleString("en-IN")}</TableCell>
                                                    <TableCell className="text-right text-sm">₹{row.avgPrice.toLocaleString("en-IN")}</TableCell>
                                                    <TableCell className="text-right text-sm">₹{row.latestPrice.toLocaleString("en-IN")}</TableCell>
                                                    <TableCell className="text-sm">{new Date(row.lastDocDate).toLocaleDateString("en-IN")}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ) : selectedItemId ? (
                            <p className="text-xs text-muted-foreground">No vendor pricing summary available.</p>
                        ) : null}

                        <Card className=" bg-background">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs">Full History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Source</TableHead>
                                            <TableHead>Document</TableHead>
                                            <TableHead>Proof</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-xs text-muted-foreground">Loading…</TableCell>
                                            </TableRow>
                                        ) : insights?.history.data.length ? (
                                            insights.history.data.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="text-xs">
                                                        {new Date(row.docDate).toLocaleDateString("en-IN")}
                                                    </TableCell>
                                                    <TableCell className="text-xs">{row.vendorName}</TableCell>
                                                    <TableCell className="text-xs">{formatSource(row.sourceType)}</TableCell>
                                                    <TableCell className="text-xs">
                                                        <Link href={buildDocLink(row)} className="font-mono text-primary hover:underline">
                                                            {row.docNumber}
                                                        </Link>
                                                        {(row.relatedPoNumber || row.relatedPiNumber) && (
                                                            <div className="text-[10px] text-muted-foreground">
                                                                {row.relatedPoNumber ? `PO ${row.relatedPoNumber}` : ""}
                                                                {row.relatedPoNumber && row.relatedPiNumber ? " · " : ""}
                                                                {row.relatedPiNumber ? `PI ${row.relatedPiNumber}` : ""}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {row.documentUrl ? (
                                                            <a
                                                                href={row.documentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline"
                                                            >
                                                                View
                                                            </a>
                                                        ) : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-xs">{row.docStatus.replaceAll("_", " ")}</TableCell>
                                                    <TableCell className="text-right text-xs">{row.qty}</TableCell>
                                                    <TableCell className="text-right text-xs">₹{row.unitPrice.toLocaleString("en-IN")}</TableCell>
                                                    <TableCell className="text-right text-xs">₹{row.total.toLocaleString("en-IN")}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-xs text-muted-foreground">
                                                    Select an item to view history.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {historyMeta && (
                            <VpPagination
                                meta={historyMeta}
                                onPage={setPage}
                                onPerPage={(value) => { setPerPage(value); setPage(1) }}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="unmatched" className="space-y-4 w-full">
                        <div className="grid gap-3 md:grid-cols-12 w-full">

                            {/* Search */}
                            <div className="col-span-12 md:col-span-3">
                                <Input
                                    className=" w-full"
                                    placeholder="Search description or vendor"
                                    value={unmatchedSearch}
                                    onChange={(event) => {
                                        setUnmatchedSearch(event.target.value);
                                        setUnmatchedPage(1);
                                    }}
                                />
                            </div>

                            {/* Vendor */}
                            <div className="col-span-12 md:col-span-2">
                                <Select
                                    value={unmatchedVendorId}
                                    onValueChange={(value) => {
                                        setUnmatchedVendorId(value);
                                        setUnmatchedPage(1);
                                    }}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="All vendors" />
                                    </SelectTrigger>

                                    <SelectGroup>

                                        <SelectContent>
                                            <SelectLabel>All vendors</SelectLabel>
                                            {vendors.map((vendor) => (
                                                <SelectItem key={vendor.id} value={vendor.id}>
                                                    {vendor.vendor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </SelectGroup>

                                </Select>
                            </div>

                            {/* Source */}
                            <div className="col-span-12 md:col-span-2">
                                <Select
                                    value={unmatchedSource}
                                    onValueChange={(value) => {
                                        setUnmatchedSource(value as VpItemPriceSource | "ALL");
                                        setUnmatchedPage(1);
                                    }}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue placeholder="All sources" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {SOURCES.map((source) => (
                                            <SelectItem key={source.value} value={source.value}>
                                                {source.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date filter */}
                            <div className="col-span-12 md:col-span-5 flex justify-end">
                                <VpDateFilter
                                    from={unmatchedFrom}
                                    to={unmatchedTo}
                                    onFrom={(value) => {
                                        setUnmatchedFrom(value);
                                        setUnmatchedPage(1);
                                    }}
                                    onTo={(value) => {
                                        setUnmatchedTo(value);
                                        setUnmatchedPage(1);
                                    }}
                                    onClear={() => {
                                        setUnmatchedFrom("");
                                        setUnmatchedTo("");
                                        setUnmatchedPage(1);
                                    }}
                                />
                            </div>

                        </div>

                        <Card className=" bg-background">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs">Unmatched Vendor Items</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Price Range</TableHead>
                                            <TableHead className="text-right">Latest</TableHead>
                                            <TableHead>Last Seen</TableHead>
                                            <TableHead>Sources</TableHead>
                                            <TableHead className="w-28" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {unmatchedLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-xs text-muted-foreground">Loading…</TableCell>
                                            </TableRow>
                                        ) : unmatchedRows.length ? (
                                            unmatchedRows.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="text-sm">{row.vendorName}</TableCell>
                                                    <TableCell className="text-xs">{row.description}</TableCell>
                                                    <TableCell className="text-right text-xs">
                                                        ₹{row.minPrice.toLocaleString("en-IN")} - ₹{row.maxPrice.toLocaleString("en-IN")}
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs">
                                                        ₹{row.latestPrice.toLocaleString("en-IN")}
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {new Date(row.lastSeen).toLocaleDateString("en-IN")}
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {row.sources.map((s) => (
                                                            <Badge key={s} variant="outline" className="mr-1 text-[10px]">{formatSource(s)}</Badge>
                                                        ))}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setDialogRow(row)
                                                                setDialogOpen(true)
                                                            }}
                                                            disabled={isPending}
                                                        >
                                                            Add
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-xs text-muted-foreground">
                                                    No unmatched items found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {unmatchedMeta && (
                            <VpPagination
                                meta={unmatchedMeta}
                                onPage={setUnmatchedPage}
                                onPerPage={(value) => { setUnmatchedPerPage(value); setUnmatchedPage(1) }}
                            />
                        )}
                    </TabsContent>
                </Tabs>

                {dialogRow && (
                    <UnmatchedItemDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        onSuccess={() => {
                            startTransition(async () => {
                                await loadUnmatched()
                                await loadInsights()
                            })
                        }}
                        vendorId={dialogRow.vendorId}
                        vendorName={dialogRow.vendorName}
                        description={dialogRow.description}
                        unitPrice={dialogRow.latestPrice}
                        categories={categories}
                    />
                )}
            </CardContent>
        </Card>
    )
}
