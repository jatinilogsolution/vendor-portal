// src/app/vendor-portal/(admin)/admin/deliveries/_components/delivery-form.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
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
} from "@/actions/vp/delivery.action"

type PoOption = { id: string; poNumber: string; vendorName: string }
type LineItem = { id: string; description: string; qty: number; unitPrice: number; totalDelivered: number }

const CONDITION_LABELS = { GOOD: "Good", DAMAGED: "Damaged", PARTIAL: "Partial" }

export function DeliveryForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [pos, setPos] = useState<PoOption[]>([])
    const [lineItems, setLineItems] = useState<LineItem[]>([])
    const [loadingItems, setLoadingItems] = useState(false)

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

    // When PO changes, load its line items and pre-populate rows
    useEffect(() => {
        if (!selectedPoId) { replace([]); setLineItems([]); return }
        setLoadingItems(true)
        getPoLineItemsForDelivery(selectedPoId).then((res) => {
            if (!res.success) { toast.error(res.error); return }
            setLineItems(res.data)
            replace(
                res.data.map((li) => ({
                    poLineItemId: li.id,
                    qtyDelivered: Math.max(0, li.qty - li.totalDelivered),
                    condition: "GOOD" as const,
                })),
            )
            setLoadingItems(false)
        })
    }, [selectedPoId])

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
                                        <div className="col-span-2 text-center">Previous</div>
                                        <div className="col-span-2 text-center">Delivering</div>
                                        <div className="col-span-1">Condition</div>
                                    </div>

                                    {fields.map((field, index) => {
                                        const li = lineItems[index]
                                        if (!li) return null
                                        const remaining = Math.max(0, li.qty - li.totalDelivered)

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
                                                </div>

                                                {/* Ordered qty */}
                                                <div className="col-span-4 sm:col-span-2 text-center">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Ordered</p>
                                                    <Badge variant="outline" className="text-xs">{li.qty}</Badge>
                                                </div>

                                                {/* Previous deliveries */}
                                                <div className="col-span-4 sm:col-span-2 text-center">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Prev.</p>
                                                    <Badge
                                                        variant={li.totalDelivered > 0 ? "secondary" : "outline"}
                                                        className="text-xs"
                                                    >
                                                        {li.totalDelivered}
                                                    </Badge>
                                                </div>

                                                {/* Qty to deliver */}
                                                <div className="col-span-4 sm:col-span-2">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Delivering</p>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.qtyDelivered`}
                                                        render={({ field: f }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        min={0}
                                                                        max={remaining}
                                                                        step={0.01}
                                                                        className="h-8 text-xs text-center"
                                                                        {...f}
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
                        {isPending ? "Saving…" : "Record Delivery"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}