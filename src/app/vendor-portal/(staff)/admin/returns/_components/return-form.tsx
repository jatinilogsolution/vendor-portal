"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconPlus, IconTrash } from "@tabler/icons-react"
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
import { getVpVendors, VpVendorRow } from "@/actions/vp/vendor.action"
import {
    createVpReturn,
    getVpInvoicesForReturn,
    getVpInvoiceLineItemsForReturn,
    VpReturnInvoiceLineOption,
    VpReturnInvoiceOption,
} from "@/actions/vp/return.action"
import {
    vpReturnSchema,
    VpReturnFormInputValues,
    VpReturnFormValues,
} from "@/validations/vp/return"

export function ReturnForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const prefillVendorId = searchParams.get("vendorId") ?? ""
    const prefillInvoiceId = searchParams.get("invoiceId") ?? ""

    const [isPending, startTransition] = useTransition()
    const [vendors, setVendors] = useState<VpVendorRow[]>([])
    const [invoiceOptions, setInvoiceOptions] = useState<VpReturnInvoiceOption[]>([])
    const [invoiceLineOptions, setInvoiceLineOptions] = useState<VpReturnInvoiceLineOption[]>([])
    const [loadingDependencies, setLoadingDependencies] = useState(false)
    const [loadingInvoiceLines, setLoadingInvoiceLines] = useState(false)

    const form = useForm<VpReturnFormInputValues, unknown, VpReturnFormValues>({
        resolver: zodResolver(vpReturnSchema),
        defaultValues: {
            vendorId: "",
            invoiceId: "",
            expectedPickupDate: new Date().toISOString().split("T")[0],
            pickupPersonName: "",
            pickupPersonPhone: "",
            notes: "",
            items: [{ itemId: "", invoiceLineItemId: "", customDescription: "", qty: 1, reason: "" }],
        },
    })

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "items",
    })

    const selectedVendorId = form.watch("vendorId")
    const selectedInvoiceId = form.watch("invoiceId")
    const selectedVendor = vendors.find((vendor) => vendor.id === selectedVendorId) ?? null

    useEffect(() => {
        getVpVendors({ per_page: 200, status: "ACTIVE" }).then((result) => {
            if (!result.success) {
                toast.error(result.error)
                return
            }
            setVendors(result.data.data)
        })
    }, [])

    useEffect(() => {
        if (!prefillVendorId || form.getValues("vendorId")) return
        form.setValue("vendorId", prefillVendorId)
    }, [form, prefillVendorId])

    useEffect(() => {
        if (!selectedVendor) {
            setInvoiceOptions([])
            setInvoiceLineOptions([])
            form.setValue("invoiceId", "")
            replace([{ itemId: "", invoiceLineItemId: "", customDescription: "", qty: 1, reason: "" }])
            return
        }

        setLoadingDependencies(true)
        getVpInvoicesForReturn(selectedVendor.id).then((invoicesRes) => {
            if (!invoicesRes.success) toast.error(invoicesRes.error)

            setInvoiceOptions(invoicesRes.success ? invoicesRes.data : [])
            setInvoiceLineOptions([])

            const currentInvoiceId = form.getValues("invoiceId")
            const hasCurrentInvoice = invoicesRes.success
                ? invoicesRes.data.some((invoice) => invoice.id === currentInvoiceId)
                : false
            if (!hasCurrentInvoice) form.setValue("invoiceId", "")

            replace([{ itemId: "", invoiceLineItemId: "", customDescription: "", qty: 1, reason: "" }])
        }).finally(() => setLoadingDependencies(false))
    }, [form, replace, selectedVendor])

    useEffect(() => {
        if (!prefillInvoiceId || !selectedVendorId) return
        if (form.getValues("invoiceId")) return
        if (invoiceOptions.some((invoice) => invoice.id === prefillInvoiceId)) {
            form.setValue("invoiceId", prefillInvoiceId)
        }
    }, [form, invoiceOptions, prefillInvoiceId, selectedVendorId])

    useEffect(() => {
        if (!selectedInvoiceId) {
            setInvoiceLineOptions([])
            replace([{ itemId: "", invoiceLineItemId: "", customDescription: "", qty: 1, reason: "" }])
            return
        }

        setLoadingInvoiceLines(true)
        getVpInvoiceLineItemsForReturn(selectedInvoiceId)
            .then((result) => {
                if (!result.success) {
                    toast.error(result.error)
                    setInvoiceLineOptions([])
                    return
                }
                setInvoiceLineOptions(result.data)
            })
            .finally(() => setLoadingInvoiceLines(false))
    }, [form, replace, selectedInvoiceId])

    const invoiceLineMap = useMemo(
        () => new Map(invoiceLineOptions.map((item) => [item.id, item])),
        [invoiceLineOptions],
    )

    const onSubmit = (values: VpReturnFormValues) => {
        startTransition(async () => {
            const result = await createVpReturn(values)
            if (!result.success) {
                toast.error(result.error)
                return
            }
            toast.success("Return pickup scheduled")
            router.push(`/vendor-portal/admin/returns/${result.data.id}`)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Return Pickup Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <FormField control={form.control} name="vendorId" render={({ field }) => (
                                <FormItem className="lg:col-span-2">
                                    <FormLabel>Vendor <span className="text-destructive">*</span></FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select vendor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {vendors.map((vendor) => (
                                                <SelectItem key={vendor.id} value={vendor.id}>
                                                    {vendor.vendor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="invoiceId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Link</FormLabel>
                                    <Select
                                        value={field.value || "none"}
                                        onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                                        disabled={!selectedVendorId || loadingDependencies}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={selectedVendorId ? "Optional invoice reference" : "Select vendor first"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">No invoice link</SelectItem>
                                            {invoiceOptions.map((invoice) => (
                                                <SelectItem key={invoice.id} value={invoice.id}>
                                                    {(invoice.invoiceNumber ?? invoice.id).trim()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="expectedPickupDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Pickup Date <span className="text-destructive">*</span></FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="pickupPersonName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pickup Person</FormLabel>
                                    <FormControl><Input placeholder="Name of person collecting the return" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="pickupPersonPhone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pickup Contact</FormLabel>
                                    <FormControl><Input placeholder="Phone number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={3}
                                        placeholder="Add pickup notes, packaging instructions, or return context..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-base">Return Items</CardTitle>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ itemId: "", invoiceLineItemId: "", customDescription: "", qty: 1, reason: "" })}
                                disabled={!selectedVendorId}
                            >
                                <IconPlus size={14} className="mr-1" />
                                Add Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground">
                            {selectedInvoiceId
                                ? "Only items present on the selected invoice can be returned from this record."
                                : "Without an invoice link, enter the custom item description that is being returned."}
                        </p>

                        {!selectedVendorId && (
                            <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                                Select a vendor first to load available items and invoices.
                            </div>
                        )}

                        {fields.map((field, index) => {
                            const selectedInvoiceLineItemId = form.watch(`items.${index}.invoiceLineItemId`)
                            const selectedInvoiceLine = selectedInvoiceLineItemId
                                ? invoiceLineMap.get(selectedInvoiceLineItemId)
                                : null

                            return (
                                <div key={field.id} className="rounded-md border bg-muted/20 p-3">
                                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-13">
                                        <div className="xl:col-span-6">
                                            <FormField control={form.control} name={`items.${index}.invoiceLineItemId`} render={({ field: invoiceField }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {selectedInvoiceId ? "Invoice Item" : "Invoice Item Link"}
                                                        {selectedInvoiceId && <span className="text-destructive"> *</span>}
                                                    </FormLabel>
                                                    {selectedInvoiceId ? (
                                                        <Select
                                                            value={invoiceField.value || ""}
                                                            onValueChange={(value) => {
                                                                invoiceField.onChange(value)

                                                                const selectedLine = invoiceLineMap.get(value)
                                                                if (!selectedLine) return

                                                                form.setValue(`items.${index}.itemId`, selectedLine.itemId ?? "", { shouldValidate: true })
                                                                form.setValue(`items.${index}.customDescription`, "")
                                                                if (selectedLine.availableQty > 0) {
                                                                    form.setValue(`items.${index}.qty`, selectedLine.availableQty)
                                                                }
                                                            }}
                                                            disabled={loadingInvoiceLines}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select item from invoice" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {invoiceLineOptions.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id}>
                                                                        {item.description}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <div className="flex h-10 items-center rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground">
                                                            Invoice not selected
                                                        </div>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <div className="xl:col-span-4">
                                            <FormField control={form.control} name={`items.${index}.customDescription`} render={({ field: customField }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Custom Item
                                                        {!selectedInvoiceId && <span className="text-destructive"> *</span>}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={selectedInvoiceId ? "Invoice-linked row" : "Enter custom item description"}
                                                            disabled={!!selectedInvoiceId}
                                                            {...customField}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <div className="xl:col-span-2">
                                            <FormField control={form.control} name={`items.${index}.qty`} render={({ field: qtyField }) => (
                                                <FormItem>
                                                    <FormLabel>Qty <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={0.01}
                                                            step={0.01}
                                                            {...qtyField}
                                                            value={typeof qtyField.value === "number" || typeof qtyField.value === "string" ? qtyField.value : ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <input type="hidden" {...form.register(`items.${index}.itemId`)} />

                                        <div className="xl:col-span-1 flex items-end w-full">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-destructive hover:text-destructive"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                            >
                                                <IconTrash size={14} />
                                            </Button>
                                        </div>

                                        <div className="xl:col-span-12">
                                            <FormField control={form.control} name={`items.${index}.reason`} render={({ field: reasonField }) => (
                                                <FormItem>
                                                    <FormLabel>Reason</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={2} placeholder="Reason for return, condition issue, mismatch, etc." {...reasonField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    </div>

                                    {selectedInvoiceLine && (
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                            {selectedInvoiceLine.itemName && (
                                                <Badge variant="secondary">
                                                    {selectedInvoiceLine.itemName}
                                                    {selectedInvoiceLine.itemCode ? ` · ${selectedInvoiceLine.itemCode}` : ""}
                                                </Badge>
                                            )}
                                            {selectedInvoiceLine && (
                                                <Badge variant="outline">
                                                    Available from invoice: {selectedInvoiceLine.availableQty}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/vendor-portal/admin/returns")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || !selectedVendorId}>
                        {isPending ? "Saving..." : "Create Return"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
