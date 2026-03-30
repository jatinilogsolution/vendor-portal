// src/app/(vendor)/vendor/my-quotes/new/page.tsx
"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage, FormDescription,
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
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconTrash, IconArrowLeft, IconUpload, IconFile, IconX } from "@tabler/icons-react"
import { VpTotalsBar } from "@/components/ui/vp-totals-bar"
import { vendorPiSchema, VendorPiFormValues } from "@/validations/vp/procurement"
import { createVendorProformaInvoice } from "@/actions/vp/proforma-invoice.action"
import { getOpenProcurementsForVendor } from "@/actions/vp/procurement.action"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import Link from "next/link"
import { uploadAttachmentToAzure } from "@/services/azure-blob"

type VendorPiFormInput = z.input<typeof vendorPiSchema>

export default function VendorNewQuotePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [openPrs, setOpenPrs] = useState<any[]>([])
    const [selectedPr, setSelectedPr] = useState<any | null>(null)
    const [uploadingAttachment, setUploadingAttachment] = useState(false)
    const [attachmentUrls, setAttachmentUrls] = useState<string[]>([])
    const fileRef = useRef<HTMLInputElement>(null)

    const prefillPrId = searchParams.get("procurementId") ?? ""

    const form = useForm<VendorPiFormInput, unknown, VendorPiFormValues>({
        resolver: zodResolver(vendorPiSchema),
        defaultValues: {
            procurementId: prefillPrId,
            notes: "",
            validityDate: "",
            paymentTerms: "",
            fulfillmentDate: "",
            attachmentUrls: [],
            taxRate: 18,
            items: [{ procurementLineItemId: "", itemId: "", description: "", qty: 1, unitPrice: 0, total: 0 }],
        },
    })

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "items",
    })

    useEffect(() => {
        getOpenProcurementsForVendor().then((res) => {
            if (res.success) setOpenPrs(res.data)
        })
    }, [])

    // When procurement selected, pre-fill items from it
    const handlePrSelect = (prId: string) => {
        form.setValue("procurementId", prId)
        const pr = openPrs.find((p) => p.id === prId)
        setSelectedPr(pr ?? null)
        if (pr) {
            replace(
                pr.lineItems.map((li: any) => ({
                    procurementLineItemId: li.id,
                    itemId: "",
                    description: li.description,
                    qty: li.qty,
                    unitPrice: 0,
                    total: 0,
                })),
            )
        } else {
            replace([{ procurementLineItemId: "", itemId: "", description: "", qty: 1, unitPrice: 0, total: 0 }])
        }
    }

    // Pre-select if URL param given
    useEffect(() => {
        if (prefillPrId && openPrs.length > 0) {
            handlePrSelect(prefillPrId)
        }
    }, [prefillPrId, openPrs])

    const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        if (files.length === 0) return
        setUploadingAttachment(true)
        try {
            const uploadedUrls: string[] = []
            for (const file of files) {
                const formData = new FormData()
                formData.append("file", file)
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_")
                const path = `vp/proforma-invoices/vendor/temp-${Date.now()}_${safeName}`
                const url = await uploadAttachmentToAzure(path, formData)
                uploadedUrls.push(url)
            }
            setAttachmentUrls((current) => {
                const next = [...current, ...uploadedUrls]
                form.setValue("attachmentUrls", next)
                return next
            })
            toast.success(`${uploadedUrls.length} attachment${uploadedUrls.length > 1 ? "s" : ""} uploaded`)
        } catch {
            toast.error("Failed to upload attachment")
        } finally {
            setUploadingAttachment(false)
            if (fileRef.current) fileRef.current.value = ""
        }
    }

    const onSubmit = (values: VendorPiFormValues) => {
        startTransition(async () => {
            const result = await createVendorProformaInvoice(values)
            if (!result.success) { toast.error(result.error); return }
            toast.success("Quote submitted successfully")
            router.push(`/vendor-portal/vendor/my-quotes/${result.data.id}`)
        })
    }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Submit Quote (Proforma Invoice)"
                description="Respond to a procurement request with your pricing."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/vendor/my-quotes">
                            <IconArrowLeft size={14} className="mr-1.5" />Back
                        </Link>
                    </Button>
                }
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Quote Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                             {/* Procurement picker */}
                            <FormField control={form.control} name="procurementId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Procurement Request</FormLabel>
                                    <Select
                                        value={field.value || undefined}
                                        onValueChange={(v) => { field.onChange(v); handlePrSelect(v) }}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select procurement (optional — or submit open quote)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {openPrs.map((pr) => (
                                                <SelectItem key={pr.id} value={pr.id}>
                                                    {pr.prNumber} — {pr.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-xs">
                                        If linked to a PR, items will be pre-filled from the requirement.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {selectedPr && (
                                <div className="grid gap-4 sm:grid-cols-2 rounded-md border bg-muted/20 p-4 text-sm mt-2">
                                    {selectedPr.companyName && (
                                        <div>
                                            <p className="font-semibold mb-1 text-muted-foreground uppercase text-[10px] tracking-wider">Company</p>
                                            <p>{selectedPr.companyName}</p>
                                        </div>
                                    )}
                                    {selectedPr.deliveryAddress && (
                                        <div>
                                            <p className="font-semibold mb-1 text-muted-foreground uppercase text-[10px] tracking-wider">Deliver To</p>
                                            <p>{selectedPr.deliveryAddress}</p>
                                        </div>
                                    )}
                                    {selectedPr.billTo && (
                                        <div>
                                            <p className="font-semibold mb-1 text-muted-foreground uppercase text-[10px] tracking-wider">Bill To</p>
                                            <p>{selectedPr.billTo}</p>
                                            {selectedPr.billToGstin && (
                                                <p className="text-xs text-muted-foreground mt-1">GSTIN: {selectedPr.billToGstin}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <FormField control={form.control} name="fulfillmentDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fulfillment Date <span className="text-destructive">*</span></FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormDescription className="text-xs">When can you deliver?</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="validityDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quote Valid Until</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

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

                                <FormField control={form.control} name="paymentTerms" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Terms</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Net 30" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes / Remarks</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any conditions, warranty terms, or remarks…"
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm font-medium">Attachments</p>
                                    <p className="text-xs text-muted-foreground">
                                        Upload quotation PDFs, spec sheets, or supporting files. Admin and boss will see these attachments on the quote.
                                    </p>
                                </div>
                                {attachmentUrls.length > 0 && (
                                    <div className="space-y-2">
                                        {attachmentUrls.map((url) => (
                                            <div key={url} className="flex items-center gap-3 rounded-md border bg-muted/30 px-4 py-3">
                                                <IconFile size={18} className="shrink-0 text-muted-foreground" />
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 truncate text-sm text-primary hover:underline"
                                                >
                                                    {url.split("/").pop()}
                                                </a>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => setAttachmentUrls((current) => {
                                                        const next = current.filter((item) => item !== url)
                                                        form.setValue("attachmentUrls", next)
                                                        return next
                                                    })}
                                                >
                                                    <IconX size={13} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed py-6 transition-colors hover:bg-muted/30"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <IconUpload size={22} className="mb-2 text-muted-foreground" />
                                    <p className="text-sm font-medium">
                                        {uploadingAttachment ? "Uploading…" : "Click to upload attachments"}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        PDF, JPG or PNG · multiple files supported
                                    </p>
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    multiple
                                    className="hidden"
                                    onChange={handleAttachmentUpload}
                                    disabled={uploadingAttachment}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line items */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Your Pricing</CardTitle>
                                {!selectedPr && (
                                    <Button
                                        type="button" variant="outline" size="sm"
                                        onClick={() => append({
                                            procurementLineItemId: "",
                                            itemId: "", description: "", qty: 1, unitPrice: 0, total: 0,
                                        })}
                                    >
                                        <IconPlus size={14} className="mr-1.5" />Add Item
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedPr && (
                                <p className="text-xs text-muted-foreground rounded-md border bg-muted/30 px-3 py-2">
                                    Items pre-filled from <span className="font-semibold">{selectedPr.prNumber}</span>.
                                    Enter your unit prices below. You cannot add or remove items for procurement-linked quotes.
                                </p>
                            )}

                            {fields.length === 0 && (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No items. Add at least one.
                                </p>
                            )}

                            {fields.map((field, index) => {
                                const qty = form.watch(`items.${index}.qty`) ?? 0
                                const unitPrice = form.watch(`items.${index}.unitPrice`) ?? 0
                                const total = Number(qty) * Number(unitPrice)

                                return (
                                    <div key={field.id} className="rounded-md border bg-muted/20 p-3">
                                        <div className="grid grid-cols-12 gap-2 items-end">
                                            {/* Description */}
                                            <div className="col-span-12 sm:col-span-5">
                                                <p className="mb-1 text-xs text-muted-foreground">Description *</p>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field: f }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="h-8 text-xs"
                                                                    {...f}
                                                                    disabled={!!selectedPr} // locked if from PR
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Qty */}
                                            <div className="col-span-4 sm:col-span-2">
                                                <p className="mb-1 text-xs text-muted-foreground">Qty *</p>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.qty`}
                                                    render={({ field: f }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    type="number" min={0} step={0.01}
                                                                    className="h-8 text-xs"
                                                                    {...f}
                                                                    disabled={!!selectedPr}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Your unit price */}
                                            <div className="col-span-4 sm:col-span-3">
                                                <p className="mb-1 text-xs text-muted-foreground">Your Unit Price *</p>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.unitPrice`}
                                                    render={({ field: f }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    type="number" min={0} step={0.01}
                                                                    className="h-8 text-xs"
                                                                    {...f}
                                                                    onChange={(e) => {
                                                                        f.onChange(e)
                                                                        form.setValue(
                                                                            `items.${index}.total`,
                                                                            Number(qty) * Number(e.target.value),
                                                                        )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Total */}
                                            <div className="col-span-3 sm:col-span-1">
                                                <p className="mb-1 text-xs text-muted-foreground">Total</p>
                                                <div className="flex h-8 items-center rounded-md border bg-muted px-2 text-xs font-semibold">
                                                    ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                                </div>
                                            </div>

                                            {/* Remove — only for open quotes */}
                                            {!selectedPr && (
                                                <div className="col-span-1 flex items-end">
                                                    <Button
                                                        type="button" variant="ghost" size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <IconTrash size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            <Separator />
                            <VpTotalsBar itemsField="items" taxRateField="taxRate" />
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="button" variant="outline"
                            onClick={() => router.push("/vendor-portal/vendor/my-quotes")}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || uploadingAttachment}>
                            {isPending ? "Submitting…" : "Submit Quote"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
