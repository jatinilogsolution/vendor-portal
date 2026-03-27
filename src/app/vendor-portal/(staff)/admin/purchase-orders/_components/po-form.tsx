"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
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
import { Separator } from "@/components/ui/separator"
import { VpLineItemsEditor, ItemOption } from "@/components/ui/vp-line-items-editor"
import { VpTotalsBar } from "@/components/ui/vp-totals-bar"
import { purchaseOrderSchema, PurchaseOrderValues } from "@/validations/vp/purchase-order"
import { createVpPurchaseOrder, updateVpPurchaseOrder, VpPoDetail } from "@/actions/vp/purchase-order.action"
import { getVpVendors } from "@/actions/vp/vendor.action"
import { getVpCategoriesFlat } from "@/actions/vp/category.action"
import { getVpItemsForSelect } from "@/actions/vp/item.action"
import { getAllBillToAddresses, BillToOption } from "@/actions/vp/bill-to.action"

interface PoFormProps {
    editing?: VpPoDetail | null
}

export function PoForm({ editing }: PoFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [vendors, setVendors] = useState<{ id: string; name: string }[]>([])
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [items, setItems] = useState<ItemOption[]>([])
    const [billToOpts, setBillToOpts] = useState<BillToOption[]>([])

    const isEditing = !!editing

    const form = useForm<PurchaseOrderValues>({
        resolver: zodResolver(purchaseOrderSchema),
        defaultValues: {
            vendorId: editing?.vendor.id ?? "",
            categoryId: editing?.categoryName ? "" : "",
            notes: editing?.notes ?? "",
            deliveryDate: editing?.deliveryDate
                ? new Date(editing.deliveryDate).toISOString().split("T")[0]
                : "",
            deliveryAddress: editing?.deliveryAddress ?? "",
            billToId: editing?.billToId ?? "",
            billTo: editing?.billTo ?? "",
            billToGstin: editing?.billToGstin ?? "",
            taxRate: editing?.taxRate ?? 18,
            items: editing?.items.map((i) => ({
                itemId: i.itemId ?? "",
                description: i.description,
                qty: i.qty,
                unitPrice: i.unitPrice,
                total: i.total,
            })) ?? [{ itemId: "", description: "", qty: 1, unitPrice: 0, total: 0 }],
        },
    })

    // Load reference data
    const categoryId = form.watch("categoryId")
    useEffect(() => {
        getVpItemsForSelect(categoryId || undefined).then((res) => {
            if (res.success) setItems(res.data)
        })
    }, [categoryId])

    useEffect(() => {
        Promise.all([
            getVpVendors({ per_page: 100, status: "ACTIVE" }),
            getVpCategoriesFlat(),
            getAllBillToAddresses(),
        ]).then(([vRes, cRes, billRes]) => {
            if (vRes.success) setVendors(vRes.data.data.map((v) => ({ id: v.id, name: v.vendor.name })))
            if (cRes.success) setCategories(cRes.data.map((c) => ({ id: c.id, name: c.name })))
            setBillToOpts(billRes)
        })
    }, [])

    const onSubmit = (values: PurchaseOrderValues) => {
        startTransition(async () => {
            const result = isEditing
                ? await updateVpPurchaseOrder(editing.id, values)
                : await createVpPurchaseOrder(values)

            if (!result.success) { toast.error(result.error); return }

            toast.success(isEditing ? "Purchase order updated" : "Purchase order created")
            router.push(
                isEditing
                    ? `/vendor-portal/admin/purchase-orders/${editing.id}`
                    : `/vendor-portal/admin/purchase-orders/${"data" in result ? (result.data as any).id : ""}`,
            )
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Section 1: Basic info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">

                            {/* Vendor */}
                            <FormField control={form.control} name="vendorId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vendor <span className="text-destructive">*</span></FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isEditing}>
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {vendors.map((v) => (
                                                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Category */}
                            <FormField control={form.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select category (optional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* >— None —</SelectItem> */}
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Delivery Date */}
                            <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Delivery Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Tax Rate */}
                            <FormField control={form.control} name="taxRate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GST Rate (%)</FormLabel>
                                    <Select
                                        value={String(field.value)}
                                        onValueChange={(v) => field.onChange(Number(v))}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[0, 5, 12, 18, 28].map((r) => (
                                                <SelectItem key={r} value={String(r)}>{r}%</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Delivery Address */}
                        <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Full delivery address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Bill To section */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField control={form.control} name="billToId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bill To (Select Layout/Warehouse)</FormLabel>
                                    <Select
                                        value={field.value || ""}
                                        onValueChange={(id) => {
                                            field.onChange(id)
                                            const opt = billToOpts.find((b) => b.id === id)
                                            if (opt) {
                                                form.setValue("billTo", opt.address)
                                                form.setValue("billToGstin", opt.gstin)
                                            }
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billToOpts.map((b) => (
                                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="billToGstin" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bill To GSTIN</FormLabel>
                                    <FormControl><Input placeholder="GSTIN (auto-filled)" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="billTo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billing Address (Full)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Full billing address" rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Notes */}
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes / Remarks</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Any special instructions or notes…" rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                {/* Section 2: Line items */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Line Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <VpLineItemsEditor fieldArrayName="items" items={items} />
                        <Separator />
                        <VpTotalsBar itemsField="items" taxRateField="taxRate" />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button" variant="outline"
                        onClick={() => router.push("/vendor-portal/admin/purchase-orders")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving…" : isEditing ? "Save Changes" : "Create Purchase Order"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}