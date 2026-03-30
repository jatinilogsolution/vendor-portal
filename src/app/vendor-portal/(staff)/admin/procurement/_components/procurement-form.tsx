// src/app/vendor-portal/(admin)/admin/procurement/_components/procurement-form.tsx
"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { VpLineItemsEditor, ItemOption } from "@/components/ui/vp-line-items-editor"
import { VpTotalsBar } from "@/components/ui/vp-totals-bar"
import { procurementSchema, ProcurementFormValues } from "@/validations/vp/procurement"
import { createVpProcurement } from "@/actions/vp/procurement.action"
import { getVpVendors } from "@/actions/vp/vendor.action"
import { getVpCategoriesFlat } from "@/actions/vp/category.action"
import { getVpItemsForSelect } from "@/actions/vp/item.action"
import { getAllBillToAddresses, BillToOption } from "@/actions/vp/bill-to.action"
import { getVpCompanySelectionOptions } from "@/actions/vp/company.action"

export function ProcurementForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [vendors, setVendors] = useState<{
        id: string
        name: string
        vendorType: string
        companyIds: string[]
        categoryIds: string[]
        categoryNames: string[]
    }[]>([])
    const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [items, setItems] = useState<ItemOption[]>([])
    const [billToOpts, setBillToOpts] = useState<BillToOption[]>([])
    const [vendorSearchInput, setVendorSearchInput] = useState("")
    const [vendorSearch, setVendorSearch] = useState("")

    const form = useForm<ProcurementFormValues>({
        resolver: zodResolver(procurementSchema) as any,
        defaultValues: {
            title: "",
            companyId: "",
            description: "",
            categoryIds: [],
            requiredByDate: "",
            deliveryAddress: "",
            billToId: "",
            billTo: "",
            billToGstin: "",
            taxRate: 0,
            items: [{ itemId: "", description: "", qty: 1, estimatedUnitPrice: 0, total: 0 }],
            vendorIds: [],
        },
    })

    const selectedVendorIds = form.watch("vendorIds")
    const selectedCompanyId = form.watch("companyId")
    const selectedCategoryIds = form.watch("categoryIds")
    const filteredVendors = useMemo(() => {
        const q = vendorSearch.trim().toLowerCase()
        return vendors.filter((v) => {
            const matchesSearch = q ? v.name.toLowerCase().includes(q) : true
            const matchesCompany = selectedCompanyId ? v.companyIds.includes(selectedCompanyId) : true
            const matchesCategory = selectedCategoryIds.length > 0
                ? v.categoryIds.some((categoryId) => selectedCategoryIds.includes(categoryId))
                : true
            return matchesSearch && matchesCompany && matchesCategory
        })
    }, [selectedCategoryIds, selectedCompanyId, vendorSearch, vendors])

    const runVendorSearch = () => {
        setVendorSearch(vendorSearchInput.trim())
    }

    useEffect(() => {
        if (selectedCategoryIds.length > 0) {
            getVpItemsForSelect(selectedCategoryIds).then((res) => {
                if (res.success) setItems(res.data)
            })
        } else {
            setItems([])
        }
    }, [selectedCategoryIds])

    useEffect(() => {
        Promise.all([
            getVpVendors({ per_page: 200, status: "ACTIVE" }),
            getVpCategoriesFlat(),
            getAllBillToAddresses(),
            getVpCompanySelectionOptions({ activeOnly: true }),
        ]).then(([vRes, cRes, billRes, companyRes]) => {
            if (vRes.success) setVendors(
                vRes.data.data.map((v) => ({
                    id: v.id,
                    name: v.vendor.name,
                    vendorType: v.vendorType,
                    companyIds: v.companies.map((company) => company.id),
                    categoryIds: v.categoryIds,
                    categoryNames: v.categoryNames,
                })),
            )
            if (cRes.success) setCategories(cRes.data.map((c) => ({ id: c.id, name: c.name })))
            setBillToOpts(billRes)
            if (companyRes.success) {
                setCompanies(companyRes.data.map((company) => ({ id: company.id, name: company.name })))
            }
        })
    }, [])

    useEffect(() => {
        const nextVendorIds = form.getValues("vendorIds").filter((vendorId) => {
            const vendor = vendors.find((row) => row.id === vendorId)
            if (!vendor) return false
            const matchesCompany = selectedCompanyId ? vendor.companyIds.includes(selectedCompanyId) : true
            const matchesCategory = selectedCategoryIds.length > 0
                ? vendor.categoryIds.some((categoryId) => selectedCategoryIds.includes(categoryId))
                : true
            return matchesCompany && matchesCategory
        })
        if (nextVendorIds.length !== form.getValues("vendorIds").length) {
            form.setValue("vendorIds", nextVendorIds)
        }
    }, [form, selectedCategoryIds, selectedCompanyId, vendors])

    const toggleCategory = (categoryId: string, checked: boolean) => {
        const current = form.getValues("categoryIds")
        const next = checked
            ? [...new Set([...current, categoryId])]
            : current.filter((id) => id !== categoryId)
        form.setValue("categoryIds", next, { shouldValidate: true })
    }

    const toggleVendor = (vendorId: string) => {
        const current = form.getValues("vendorIds")
        form.setValue(
            "vendorIds",
            current.includes(vendorId)
                ? current.filter((id) => id !== vendorId)
                : [...current, vendorId],
        )
    }

    const onSubmit = (values: ProcurementFormValues) => {
        startTransition(async () => {
            const result = await createVpProcurement(values)
            if (!result.success) { toast.error(result.error); return }
            toast.success(`Procurement ${result.data.prNumber} created`)
            router.push(`/vendor-portal/admin/procurement/${result.data.id}`)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Basic info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Request Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Q2 Laptop Procurement – Operations" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description / Scope</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe what you need, why, and any special requirements…"
                                        rows={3}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid gap-4 sm:grid-cols-3">
                            <FormField control={form.control} name="companyId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                                    <Select value={field.value || ""} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select company" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="requiredByDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Required By</FormLabel>
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
                        </div>

                        <FormField control={form.control} name="categoryIds" render={() => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <FormLabel>Categories</FormLabel>
                                        <p className="text-xs text-muted-foreground">
                                            Select one or more categories for this procurement request.
                                        </p>
                                    </div>
                                    {selectedCategoryIds.length > 0 && (
                                        <Badge variant="outline" className="text-xs">
                                            {selectedCategoryIds.length} selected
                                        </Badge>
                                    )}
                                </div>
                                <div className="grid gap-2 rounded-md border bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {categories.map((category) => {
                                        const checked = selectedCategoryIds.includes(category.id)
                                        return (
                                            <label
                                                key={category.id}
                                                className="flex items-start gap-3 rounded-md border bg-background px-3 py-2"
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(value) => toggleCategory(category.id, value === true)}
                                                />
                                                <span className="text-sm font-medium">{category.name}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Where should items be delivered?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

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

                {/* Items */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Required Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <VpLineItemsEditor
                            fieldArrayName="items"
                            items={items}
                            priceFieldLabel="Est. Unit Price"
                            priceFieldName="estimatedUnitPrice"
                        />
                        <Separator />
                        <VpTotalsBar itemsField="items" taxRateField="taxRate" priceFieldName="estimatedUnitPrice" />
                    </CardContent>
                </Card>

                {/* Vendor selection */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Invite Vendors to Quote
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                ({selectedVendorIds.length} selected)
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Input
                                value={vendorSearchInput}
                                onChange={(e) => setVendorSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        runVendorSearch()
                                    }
                                }}
                                placeholder="Search by vendor name"
                                className="h-9 w-full sm:max-w-sm"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={runVendorSearch}>
                                Search
                            </Button>
                            {vendorSearch && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setVendorSearch("")
                                        setVendorSearchInput("")
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>

                        {vendors.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No active vendors found.</p>
                        ) : filteredVendors.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No vendors found{vendorSearch ? ` for "${vendorSearch}".` : "."}
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredVendors.map((v) => {
                                    const selected = selectedVendorIds.includes(v.id)
                                    return (
                                        <div
                                            key={v.id}
                                            // onClick={() => toggleVendor(v.id)}
                                            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${selected
                                                ? "border-primary bg-primary/5"
                                                : "hover:bg-muted/50"
                                                }`}
                                        >
                                            <Checkbox
                                                checked={selected}
                                                onClick={(e) => e.stopPropagation()}
                                                onCheckedChange={() => toggleVendor(v.id)}
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{v.name}</p>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {v.vendorType}
                                                    </Badge>
                                                    {v.categoryNames.map((categoryName) => (
                                                        <Badge key={categoryName} variant="secondary" className="text-[10px]">
                                                            {categoryName}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        {form.formState.errors.vendorIds && (
                            <p className="mt-2 text-xs text-destructive">
                                {form.formState.errors.vendorIds.message}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button" variant="outline"
                        onClick={() => router.push("/vendor-portal/admin/procurement")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating…" : "Create Procurement Request"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
