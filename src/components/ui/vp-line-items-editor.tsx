// src/components/vendor-portal/ui/vp-line-items-editor.tsx
"use client"

import { useEffect } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import {
    FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type ItemOption = {
    id: string
    code: string
    name: string
    uom: string
    defaultPrice: number
}

interface VpLineItemsEditorProps {
    fieldArrayName: string
    items: ItemOption[]
    disabled?: boolean
    priceFieldLabel?: string
    priceFieldName?: string // e.g. "unitPrice" or "estimatedUnitPrice"
}

function LineRow({
    index, fieldArrayName, items, onRemove, disabled, priceFieldLabel, priceFieldName,
}: {
    index: number
    fieldArrayName: string
    items: ItemOption[]
    onRemove: () => void
    disabled?: boolean
    priceFieldLabel?: string
    priceFieldName: string
}) {
    const { control, setValue, getValues } = useFormContext()
    const basePath = `${fieldArrayName}.${index}`

    const qty = useWatch({ control, name: `${basePath}.qty` }) ?? 0
    const unitPrice = useWatch({ control, name: `${basePath}.${priceFieldName}` }) ?? 0

    // Auto-compute total
    useEffect(() => {
        const computed = Number(qty) * Number(unitPrice)
        const nextTotal = Number.isFinite(computed) ? parseFloat(computed.toFixed(2)) : 0
        const currentTotal = Number(getValues(`${basePath}.total`) ?? 0)
        if (Number.isFinite(currentTotal) && Math.abs(currentTotal - nextTotal) < 0.0001) return
        setValue(`${basePath}.total`, nextTotal, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        })
    }, [basePath, getValues, qty, setValue, unitPrice])

    const handleItemSelect = (itemId: string) => {
        const item = items.find((i) => i.id === itemId)
        if (!item) return
        setValue(`${basePath}.itemId`, item.id)
        setValue(`${basePath}.description`, `${item.name} (${item.code})`)
        setValue(`${basePath}.${priceFieldName}`, item.defaultPrice)
    }

    return (
        <div className="rounded-md border bg-muted/20 p-3">
            <div className="grid grid-cols-12 gap-2">

                {/* Item picker (col 1-3) */}
                <div className="col-span-12 sm:col-span-3">
                    <p className="mb-1 text-xs text-muted-foreground">From Catalog</p>
                    <FormField control={control} name={`${basePath}.itemId`} render={({ field }) => (
                        <FormItem>
                            <Select
                                value={field.value || ""}
                                onValueChange={(v) => { field.onChange(v); handleItemSelect(v) }}
                                disabled={disabled}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-8 w-full text-xs">
                                        <SelectValue placeholder="Pick item…" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* >— Custom line —</SelectItem> */}
                                    {items.map((i) => (
                                        <SelectItem key={i.id} value={i.id}>
                                            <span className="font-mono text-xs">{i.code}</span> — {i.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Description (col 4-7) */}
                <div className="col-span-12 sm:col-span-4">
                    <p className="mb-1 text-xs text-muted-foreground">Description *</p>
                    <FormField control={control} name={`${basePath}.description`} render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="h-8 text-xs" placeholder="Line item description" disabled={disabled} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Qty (col 8) */}
                <div className="col-span-4 sm:col-span-2">
                    <p className="mb-1 text-xs text-muted-foreground">Qty *</p>
                    <FormField control={control} name={`${basePath}.qty`} render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    className="h-8 text-xs"
                                    type="number" min={0} step={0.01}
                                    disabled={disabled} {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Unit Price (col 9-10) */}
                <div className="col-span-4 sm:col-span-2">
                    <p className="mb-1 text-xs text-muted-foreground">{priceFieldLabel ?? "Unit Price"} *</p>
                    <FormField control={control} name={`${basePath}.${priceFieldName}`} render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    className="h-8 text-xs"
                                    type="number" min={0} step={0.01}
                                    disabled={disabled} {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Total (col 11) — read only */}
                <div className="col-span-3 sm:col-span-1">
                    <p className="mb-1 text-xs text-muted-foreground">Total</p>
                    <div className="flex h-8 items-center rounded-md border bg-muted px-2 text-xs font-semibold">
                        ₹{(Number(qty) * Number(unitPrice)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                </div>

                {/* Remove button */}
                {!disabled && (
                    <div className="col-span-1 flex items-end pb-0.5">
                        <Button
                            type="button" variant="ghost" size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={onRemove}
                        >
                            <IconTrash size={14} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export function VpLineItemsEditor({
    fieldArrayName, items, disabled, priceFieldLabel, priceFieldName = "unitPrice",
}: VpLineItemsEditorProps) {
    const { control } = useFormContext()
    const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName })

    const addRow = () =>
        append({ itemId: "", description: "", qty: 1, [priceFieldName]: 0, total: 0 })

    return (
        <div className="space-y-2">
            {fields.length === 0 && (
                <p className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
                    No line items. Add at least one.
                </p>
            )}

            {fields.map((field, index) => (
                <LineRow
                    key={field.id}
                    index={index}
                    fieldArrayName={fieldArrayName}
                    items={items}
                    onRemove={() => remove(index)}
                    disabled={disabled}
                    priceFieldLabel={priceFieldLabel}
                    priceFieldName={priceFieldName}
                />
            ))}

            {!disabled && (
                <Button type="button" variant="outline" size="sm" onClick={addRow}>
                    <IconPlus size={14} className="mr-1.5" />
                    Add Line Item
                </Button>
            )}
        </div>
    )
}
