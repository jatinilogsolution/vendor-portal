// src/components/vendor-portal/ui/vp-date-filter.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { IconX } from "@tabler/icons-react"

interface VpDateFilterProps {
    from: string
    to: string
    onFrom: (v: string) => void
    onTo: (v: string) => void
    onClear?: () => void
}

export function VpDateFilter({
    from, to, onFrom, onTo, onClear,
}: VpDateFilterProps) {
    const hasFilter = !!from || !!to

    return (
        <div className="flex flex-wrap justify-center items-end gap-3">
            <div className="flex flex-col gap-1">
                {/* <Label className="text-xs text-muted-foreground">From</Label> */}
                <Input
                    type="date"
                    className=" w-36 text-xs"
                    value={from}
                    onChange={(e) => onFrom(e.target.value)}
                />
            </div>
            <h2 className=" mb-1">to</h2>
            <div className="flex flex-col gap-1">
                {/* <Label className="text-xs text-muted-foreground">To</Label> */}
                <Input
                    type="date"
                    className=" w-36 text-xs"
                    value={to}
                    onChange={(e) => onTo(e.target.value)}
                />
            </div>
            {hasFilter && onClear && (
                <Button
                    variant="ghost" size="sm" className="h-8 gap-1 text-xs"
                    onClick={onClear}
                >
                    <IconX size={12} />
                    Clear dates
                </Button>
            )}
        </div>
    )
}