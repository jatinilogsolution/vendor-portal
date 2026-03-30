
"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { VpLineItemsEditor, ItemOption } from "@/components/ui/vp-line-items-editor"
import { VpTotalsBar } from "@/components/ui/vp-totals-bar"
import { proformaInvoiceSchema, ProformaInvoiceValues } from "@/validations/vp/proforma-invoice"
import {
    createVpProformaInvoice, updateVpProformaInvoice, VpPiDetail,
} from "@/actions/vp/proforma-invoice.action"
import { getVpVendors, VpVendorRow } from "@/actions/vp/vendor.action"
import { getVpCategoriesFlat } from "@/actions/vp/category.action"
import { getVpItemsForSelect } from "@/actions/vp/item.action"
import { getAllBillToAddresses, BillToOption } from "@/actions/vp/bill-to.action"
import { VP_BILLING_TYPE_LABELS, VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"

interface PiFormProps {
    editing?: VpPiDetail | null
}

export function PiForm({ editing }: PiFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [vendors, setVendors] = useState<VpVendorRow[]>([])
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [items, setItems] = useState<ItemOption[]>([])
    const [billToOpts, setBillToOpts] = useState<BillToOption[]>([])
    const isEditing = !!editing

    const form = useForm<ProformaInvoiceValues>({
        resolver: zodResolver(proformaInvoiceSchema),
        defaultValues: {
            vendorId: editing?.vendor.id ?? "",
            companyId: editing?.companyId ?? "",
            categoryId: editing?.categoryId ?? "",
            notes: editing?.notes ?? "",
            validityDate: editing?.validityDate
                ? new Date(editing.validityDate).toISOString().split("T")[0]
                : "",
            paymentTerms: editing?.paymentTerms ?? "",
            taxRate: editing?.taxRate ?? 18,
            billToId: editing?.billToId ?? "",
            billTo: editing?.billTo ?? "",
            billToGstin: editing?.billToGstin ?? "",
            items: editing?.items.map((i) => ({
                itemId: i.itemId ?? "",
                description: i.description,
                qty: i.qty,
                unitPrice: i.unitPrice,
                total: i.total,
            })) ?? [{ itemId: "", description: "", qty: 1, unitPrice: 0, total: 0 }],
        },
    })

    const selectedVendorId = form.watch("vendorId")
    const selectedVendor = vendors.find((v) => v.id === selectedVendorId)
    const companyOptions = selectedVendor?.companies ?? []

    const categoryId = form.watch("categoryId")
    const availableVendors = useMemo(
        () => categoryId ? vendors.filter((vendor) => vendor.categoryIds.includes(categoryId)) : vendors,
        [categoryId, vendors],
    )
    const categoryOptions = useMemo(
        () => selectedVendor
            ? categories.filter((category) => selectedVendor.categoryIds.includes(category.id))
            : categories,
        [categories, selectedVendor],
    )

    useEffect(() => {
        if (categoryId) {
            getVpItemsForSelect(categoryId).then((res) => {
                if (res.success) setItems(res.data)
            })
        } else {
            setItems([])
        }
    }, [categoryId])

    useEffect(() => {
        Promise.all([
            getVpVendors({ per_page: 100, status: "ACTIVE" }),
            getVpCategoriesFlat(),
            getAllBillToAddresses(),
        ]).then(([vRes, cRes, bRes]) => {
            if (vRes.success) setVendors(vRes.data.data)
            if (cRes.success) setCategories(cRes.data.map((c) => ({ id: c.id, name: c.name })))
            setBillToOpts(bRes)
        })
    }, [])

    useEffect(() => {
        const currentCompanyId = form.getValues("companyId")
        if (!selectedVendor) {
            if (selectedVendorId && vendors.length === 0) return
            if (currentCompanyId) form.setValue("companyId", "")
            return
        }

        const hasCurrent = selectedVendor.companies.some((company) => company.id === currentCompanyId)
        if (hasCurrent) return

        if (selectedVendor.defaultInvoiceCompanyId) {
            form.setValue("companyId", selectedVendor.defaultInvoiceCompanyId)
            return
        }

        if (selectedVendor.companies.length === 1) {
            form.setValue("companyId", selectedVendor.companies[0].id)
            return
        }

        form.setValue("companyId", "")
    }, [form, selectedVendor, selectedVendorId, vendors.length])

    useEffect(() => {
        if (!selectedVendorId || !selectedVendor) return
        if (!categoryId && selectedVendor.categoryIds.length === 1) {
            form.setValue("categoryId", selectedVendor.categoryIds[0], { shouldValidate: true })
            return
        }
        if (categoryId && !selectedVendor.categoryIds.includes(categoryId)) {
            form.setValue(
                "categoryId",
                selectedVendor.categoryIds.length === 1 ? selectedVendor.categoryIds[0] : "",
                { shouldValidate: true },
            )
        }
    }, [categoryId, form, selectedVendor, selectedVendorId])

    const onSubmit = (values: ProformaInvoiceValues) => {
        startTransition(async () => {
            const result = isEditing
                ? await updateVpProformaInvoice(editing.id, values)
                : await createVpProformaInvoice(values)

            if (!result.success) { toast.error(result.error); return }

            toast.success(isEditing ? "Proforma invoice updated" : "Proforma invoice created")
            router.push(
                isEditing
                    ? `/vendor-portal/admin/proforma-invoices/${editing.id}`
                    : `/vendor-portal/admin/proforma-invoices/${"data" in result ? (result.data as any).id : ""}`,
            )
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Proforma Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {/* Vendor */}
                            <FormField control={form.control} name="vendorId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vendor <span className="text-destructive">*</span></FormLabel>
                                    <Select
                                        value={field.value || "none"}
                                        onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                                        disabled={isEditing}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select vendor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {availableVendors.map((v) => (
                                                <SelectItem key={v.id} value={v.id}>
                                                    {v.vendor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    {/* Show billing type hint */}
                                    {selectedVendor?.billingType && selectedVendor.billingType.length > 0 && (
                                        <div className="flex items-center gap-1.5 pt-1">
                                            {selectedVendor.billingType.map(bt => (
                                                <Badge key={bt} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                                                    {VP_BILLING_TYPE_LABELS[bt as keyof typeof VP_BILLING_TYPE_LABELS] || bt}
                                                </Badge>
                                            ))}
                                            {selectedVendor.recurringCycle && (
                                                <Badge variant="outline" className="text-xs">
                                                    {VP_RECURRING_CYCLE_LABELS[selectedVendor.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS]}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="companyId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                                    <Select
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                        disabled={!selectedVendor}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={selectedVendor ? "Select company" : "Select vendor first"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {companyOptions.map((company) => (
                                                <SelectItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </SelectItem>
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
                                    <Select
                                        value={field.value || "none"}
                                        onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select category (optional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="none">— None —</SelectItem>
                                                {categoryOptions.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Validity Date */}
                            <FormField control={form.control} name="validityDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valid Until</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Date until which this quote is valid.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* GST rate */}
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

                        {/* Payment Terms */}
                        <FormField control={form.control} name="paymentTerms" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Terms</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Net 30, 50% advance + 50% on delivery" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Notes */}
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes / Scope of Work</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the scope of work, terms, or any special conditions…"
                                        rows={3}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Bill To */}
                        <Separator />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField control={form.control} name="billToId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bill To (Select Layout/Warehouse)</FormLabel>
                                    <Select
                                        value={field.value || "none"}
                                        onValueChange={(id) => {
                                            const val = id === "none" ? "" : id
                                            field.onChange(val)
                                            const opt = billToOpts.find((b) => b.id === val)
                                            if (opt) {
                                                form.setValue("billTo", opt.address)
                                                form.setValue("billToGstin", opt.gstin)
                                            } else {
                                                form.setValue("billTo", "")
                                                form.setValue("billToGstin", "")
                                            }
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
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
                    </CardContent>
                </Card>

                {/* Line items */}
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

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button" variant="outline"
                        onClick={() => router.push("/vendor-portal/admin/proforma-invoices")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving…" : isEditing ? "Save Changes" : "Create Proforma Invoice"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
