// src/components/vendor-portal/ui/vp-totals-bar.tsx
"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Separator } from "@/components/ui/separator"

interface VpTotalsBarProps {
    itemsField: string
    taxRateField: string
    discountAmountField?: string
    priceFieldName?: string // defaults to "unitPrice"
}

export function VpTotalsBar({
    itemsField,
    taxRateField,
    discountAmountField,
    priceFieldName = "unitPrice",
}: VpTotalsBarProps) {
    const { control } = useFormContext()
    const items = useWatch({ control, name: itemsField }) ?? []
    const taxRate = useWatch({ control, name: taxRateField }) ?? 0
    const discountAmount = discountAmountField
        ? Number(useWatch({ control, name: discountAmountField }) ?? 0)
        : 0

    const subtotal = items.reduce(
        (s: number, i: any) => s + (Number(i?.qty ?? 0) * Number(i?.[priceFieldName] ?? 0)),
        0,
    )
    const netSubtotal = Math.max(0, subtotal - discountAmount)
    const taxAmount = (netSubtotal * Number(taxRate)) / 100
    const grandTotal = netSubtotal + taxAmount

    const fmt = (n: number) =>
        `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    return (
        <div className="ml-auto w-full max-w-xs space-y-2 rounded-md border bg-muted/30 p-4 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{fmt(subtotal)}</span>
            </div>

            <div className="flex justify-between">
                <span className="text-muted-foreground">GST ({taxRate}%)</span>
                <span className="font-medium">{fmt(taxAmount)}</span>
            </div>
            {discountAmount > 0 && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-emerald-700">- {fmt(discountAmount)}</span>
                </div>
            )}
            {discountAmount > 0 && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxable Amount</span>
                    <span className="font-medium">{fmt(netSubtotal)}</span>
                </div>
            )}
            <Separator />
            <div className="flex justify-between text-base font-bold">
                <span>Grand Total</span>
                <span>{fmt(grandTotal)}</span>
            </div>
        </div>
    )
}
