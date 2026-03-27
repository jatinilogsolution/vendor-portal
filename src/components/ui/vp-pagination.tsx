// src/components/vendor-portal/ui/vp-pagination.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    IconChevronLeft, IconChevronRight,
    IconChevronsLeft, IconChevronsRight,
} from "@tabler/icons-react"
import { VpPaginationMeta } from "@/types/vendor-portal"

interface VpPaginationProps {
    meta: VpPaginationMeta
    onPage: (page: number) => void
    onPerPage?: (perPage: number) => void
    perPageOptions?: number[]
}

export function VpPagination({
    meta,
    onPage,
    onPerPage,
    perPageOptions = [10, 20, 50, 100],
}: VpPaginationProps) {
    const { page, per_page, total, total_pages } = meta
    const from = total === 0 ? 0 : (page - 1) * per_page + 1
    const to = Math.min(page * per_page, total)

    if (total === 0) return null

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Info */}
            <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium">{from}–{to}</span> of{" "}
                <span className="font-medium">{total}</span> results
            </p>

            <div className="flex items-center gap-3">
                {/* Per page */}
                {onPerPage && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Rows</span>
                        <Select
                            value={String(per_page)}
                            onValueChange={(v) => onPerPage(Number(v))}
                        >
                            <SelectTrigger className="h-8 w-16 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {perPageOptions.map((n) => (
                                    <SelectItem key={n} value={String(n)} className="text-xs">
                                        {n}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Nav buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPage(1)} disabled={page <= 1}
                    >
                        <IconChevronsLeft size={14} />
                    </Button>
                    <Button
                        variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPage(page - 1)} disabled={page <= 1}
                    >
                        <IconChevronLeft size={14} />
                    </Button>

                    <span className="px-2 text-xs text-muted-foreground">
                        {page} / {total_pages}
                    </span>

                    <Button
                        variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPage(page + 1)} disabled={page >= total_pages}
                    >
                        <IconChevronRight size={14} />
                    </Button>
                    <Button
                        variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => onPage(total_pages)} disabled={page >= total_pages}
                    >
                        <IconChevronsRight size={14} />
                    </Button>
                </div>
            </div>
        </div>
    )
}