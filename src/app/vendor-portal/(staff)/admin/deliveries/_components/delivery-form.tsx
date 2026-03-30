// src/app/vendor-portal/(admin)/admin/deliveries/_components/delivery-form.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { deliveryRecordSchema, DeliveryRecordValues } from "@/validations/vp/delivery"
import { createVpDelivery } from "@/actions/vp/delivery.action"
import {
    getAcknowledgedPosForDelivery,
    getPoLineItemsForDelivery,
    getVpDeliveryForPo,
} from "@/actions/vp/delivery.action"

type PoOption = { id: string; poNumber: string; vendorName: string }
type LineItem = {
    id: string
    description: string
    qty: number
    unitPrice: number
    totalDelivered: number
    remainingQty: number
}

const CONDITION_LABELS = { GOOD: "Good", DAMAGED: "Damaged", PARTIAL: "Partial", EXTRA: "Extra" }

export function DeliveryForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const prefillPoId = searchParams.get("poId") ?? ""
    const [isPending, startTransition] = useTransition()
    const [pos, setPos] = useState<PoOption[]>([])
    const [lineItems, setLineItems] = useState<LineItem[]>([])
    const [loadingItems, setLoadingItems] = useState(false)
    const [editingExistingDelivery, setEditingExistingDelivery] = useState(false)

    const form = useForm<DeliveryRecordValues>({
        resolver: zodResolver(deliveryRecordSchema) as any,
        defaultValues: {
            poId: "",
            deliveryDate: new Date().toISOString().split("T")[0],
            dispatchedBy: "",
            receivedBy: "",
            notes: "",
            items: [],
        },
    })

    const { fields, replace } = useFieldArray({ control: form.control, name: "items" })
    const selectedPoId = form.watch("poId")

    useEffect(() => {
        getAcknowledgedPosForDelivery().then((res) => {
            if (res.success) setPos(res.data)
        })
    }, [])

    useEffect(() => {
        if (!prefillPoId || form.getValues("poId")) return
        form.setValue("poId", prefillPoId)
    }, [form, prefillPoId])

    // When PO changes, load its line items and pre-populate rows
    useEffect(() => {
        if (!selectedPoId) { replace([]); setLineItems([]); return }
        setLoadingItems(true)
        Promise.all([
            getPoLineItemsForDelivery(selectedPoId),
            getVpDeliveryForPo(selectedPoId),
        ]).then(([itemsRes, deliveryRes]) => {
            if (!itemsRes.success) {
                toast.error(itemsRes.error)
                setLoadingItems(false)
                return
            }

            setLineItems(itemsRes.data)
            const existingDelivery = deliveryRes.success ? deliveryRes.data : null
            setEditingExistingDelivery(Boolean(existingDelivery))

            if (existingDelivery) {
                form.setValue(
                    "deliveryDate",
                    existingDelivery.deliveryDate
                        ? new Date(existingDelivery.deliveryDate).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                )
                form.setValue("dispatchedBy", existingDelivery.dispatchedBy ?? "")
                form.setValue("receivedBy", existingDelivery.receivedBy ?? "")
                form.setValue("notes", existingDelivery.notes ?? "")
            } else {
                form.setValue("deliveryDate", new Date().toISOString().split("T")[0])
                form.setValue("dispatchedBy", "")
                form.setValue("receivedBy", "")
                form.setValue("notes", "")
            }

            replace(
                itemsRes.data.map((li) => ({
                    poLineItemId: li.id,
                    qtyDelivered: li.totalDelivered > 0 ? li.totalDelivered : li.qty,
                    condition: li.totalDelivered > li.qty
                        ? "EXTRA" as const
                        : li.totalDelivered > 0 && li.totalDelivered < li.qty
                            ? "PARTIAL" as const
                            : "GOOD" as const,
                })),
            )
            setLoadingItems(false)
        })
    }, [form, replace, selectedPoId])

    const selectedPo = pos.find((p) => p.id === selectedPoId)

    const onSubmit = (values: DeliveryRecordValues) => {
        startTransition(async () => {
            const result = await createVpDelivery(values)
            if (!result.success) { toast.error(result.error); return }
            toast.success("Delivery record created")
            router.push(`/vendor-portal/admin/deliveries/${result.data.id}`)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Header info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">

                            {/* PO picker */}
                            <FormField control={form.control} name="poId" render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Purchase Order <span className="text-destructive">*</span></FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select acknowledged PO" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {pos.length !== 0 &&
                                                // ?  disabled>No acknowledged POs available</SelectItem>
                                                pos.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        <span className="font-mono font-semibold">{p.poNumber}</span>
                                                        <span className="ml-2 text-muted-foreground">— {p.vendorName}</span>
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        One delivery record is maintained per PO. Selecting the same PO again updates that delivery instead of creating another one.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Delivery Date */}
                            <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Delivery Date <span className="text-destructive">*</span></FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Dispatched By */}
                            <FormField control={form.control} name="dispatchedBy" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dispatched By</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Vendor contact / driver name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Received By */}
                            <FormField control={form.control} name="receivedBy" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Received By</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Internal staff name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Notes */}
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes / Remarks</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Any delivery notes, damage observations, etc." rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                {/* Line items */}
                {selectedPoId && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Delivery Items
                                {selectedPo && (
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        — {selectedPo.poNumber} · {selectedPo.vendorName}
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {editingExistingDelivery && (
                                <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                    You are updating the current delivery for this PO. Enter the delivered quantities as they stand now, and add date-wise notes below when needed.
                                </div>
                            )}
                            {loadingItems ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">Loading line items…</p>
                            ) : fields.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No line items found for this PO.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {/* Column headers */}
                                    <div className="hidden grid-cols-12 gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
                                        <div className="col-span-5">Item</div>
                                        <div className="col-span-2 text-center">Ordered</div>
                                        <div className="col-span-2 text-center">Delivered</div>
                                        <div className="col-span-2 text-center">Update Total</div>
                                        <div className="col-span-1">Condition</div>
                                    </div>

                                    {fields.map((field, index) => {
                                        const li = lineItems[index]
                                        if (!li) return null
                                        const remaining = li.remainingQty
                                        const deliveringQty = Number(form.watch(`items.${index}.qtyDelivered`) ?? 0)
                                        const isExtraDelivery = deliveringQty > li.qty

                                        return (
                                            <div
                                                key={field.id}
                                                className="grid grid-cols-12 items-center gap-2 rounded-md border bg-muted/20 p-3"
                                            >
                                                {/* Description */}
                                                <div className="col-span-12 sm:col-span-5">
                                                    <p className="text-sm font-medium">{li.description}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ₹{li.unitPrice.toLocaleString("en-IN")} / unit
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Remaining to complete PO: {remaining}
                                                    </p>
                                                    {isExtraDelivery && (
                                                        <p className="text-xs font-medium text-amber-600">
                                                            Extra delivery detected: {Math.max(0, deliveringQty - li.qty)}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Ordered qty */}
                                                <div className="col-span-4 sm:col-span-2 text-center">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Ordered</p>
                                                    <Badge variant="outline" className="text-xs">{li.qty}</Badge>
                                                </div>

                                                {/* Previous deliveries */}
                                                <div className="col-span-4 sm:col-span-2 text-center">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Delivered</p>
                                                    <Badge
                                                        variant={li.totalDelivered > 0 ? "secondary" : "outline"}
                                                        className="text-xs"
                                                    >
                                                        {li.totalDelivered}
                                                    </Badge>
                                                </div>

                                                {/* Qty to deliver */}
                                                <div className="col-span-4 sm:col-span-2">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Update Total</p>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.qtyDelivered`}
                                                        render={({ field: f }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        min={0}
                                                                        step={0.01}
                                                                        className="h-8 text-xs text-center"
                                                                        {...f}
                                                                        value={f.value ?? ""}
                                                                        onChange={(e) => f.onChange(
                                                                            e.target.value === ""
                                                                                ? ""
                                                                                : Number(e.target.value),
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                {/* Condition */}
                                                <div className="col-span-12 sm:col-span-1">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Cond.</p>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.condition`}
                                                        render={({ field: f }) => (
                                                            <FormItem>
                                                                <Select value={f.value} onValueChange={f.onChange}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="h-8 w-full text-xs">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                                                                            <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button" variant="outline"
                        onClick={() => router.push("/vendor-portal/admin/deliveries")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || !selectedPoId || fields.length === 0}>
                        {isPending ? "Saving…" : editingExistingDelivery ? "Update Delivery" : "Save Delivery"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
