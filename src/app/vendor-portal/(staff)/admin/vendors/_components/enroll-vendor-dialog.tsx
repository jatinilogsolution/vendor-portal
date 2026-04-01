// src/app/vendor-portal/(admin)/admin/vendors/_components/enroll-vendor-dialog.tsx
"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useForm, Control, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Command, CommandEmpty, CommandGroup,
    CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { vpVendorSchema, VpVendorFormValues } from "@/validations/vp/vendor"
import {
    enrollVpVendor, updateVpVendor,
    getUnenrolledVendors, VpVendorRow,
} from "@/actions/vp/vendor.action"
import { getVpCategoriesFlat } from "@/actions/vp/category.action"
import { getVpCompanySelectionOptions } from "@/actions/vp/company.action"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EnrollVendorDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    editing?: VpVendorRow | null
}

type RawVendor = { id: string; name: string; contactEmail: string | null }
type Category = { id: string; name: string; parentId: string | null }
type Company = { id: string; name: string; code: string | null; gstin: string | null }
type CategoryOption = Category & {
    pathLabel: string
    parentPathLabel: string | null
    searchText: string
}

function buildCategoryPath(categoryId: string, categoryMap: Map<string, Category>, seen = new Set<string>()): string[] {
    if (seen.has(categoryId)) return []

    const category = categoryMap.get(categoryId)
    if (!category) return []

    const nextSeen = new Set(seen)
    nextSeen.add(categoryId)

    const parentPath = category.parentId
        ? buildCategoryPath(category.parentId, categoryMap, nextSeen)
        : []

    return [...parentPath, category.name]
}

export function EnrollVendorDialog({
    open, onClose, onSuccess, editing,
}: EnrollVendorDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [vendors, setVendors] = useState<RawVendor[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [vendorSearch, setVSearch] = useState("")
    const [categorySearch, setCategorySearch] = useState("")
    const [comboOpen, setComboOpen] = useState(false)
    const listRef = useRef<HTMLDivElement | null>(null)
    const isEditing = !!editing

    const form = useForm<VpVendorFormValues>({
        resolver: zodResolver(vpVendorSchema) as Resolver<VpVendorFormValues>,
        defaultValues: {
            existingVendorId: "",
            categoryIds: [],
            portalStatus: "ACTIVE",
            vendorType: "STANDARD",
            billingType: [],
            recurringCycle: "",
            companyIds: [],
            defaultInvoiceCompanyId: "",
            restrictInvoiceToDefaultCompany: false,
        },
    })

    const billingType = form.watch("billingType")
    const vendorType = form.watch("vendorType")
    const selectedCategoryIds = form.watch("categoryIds")
    const selectedCompanyIds = form.watch("companyIds")

    // Load data when dialog opens
    useEffect(() => {
        if (!open) return
        Promise.all([
            isEditing ? Promise.resolve({ success: true, data: [] as RawVendor[] }) : getUnenrolledVendors(),
            getVpCategoriesFlat(),
            getVpCompanySelectionOptions({ activeOnly: true }),
        ]).then(([vRes, cRes, companyRes]) => {
            if (vRes.success) setVendors(vRes.data)
            if (cRes.success) setCategories(cRes.data)
            if (companyRes.success) setCompanies(companyRes.data)
        })
        setVSearch("")
        setCategorySearch("")

        if (isEditing) {
            form.reset({
                existingVendorId: editing.existingVendorId,
                categoryIds: editing.categoryIds ?? [],
                portalStatus: (editing.portalStatus === "ACTIVE" || editing.portalStatus === "INACTIVE") ? editing.portalStatus : "ACTIVE",
                vendorType: (editing.vendorType === "STANDARD" || editing.vendorType === "IT") ? editing.vendorType : "STANDARD",
                billingType: editing.billingType as ("ONE_TIME" | "RECURRING" | "RENTAL")[],
                recurringCycle: (editing.recurringCycle || "") as any,
                companyIds: editing.companies.map((company) => company.id),
                defaultInvoiceCompanyId: editing.defaultInvoiceCompanyId || editing.companies[0]?.id || "",
                restrictInvoiceToDefaultCompany: editing.restrictInvoiceToDefaultCompany,
            })
        } else {
            form.reset({
                existingVendorId: "",
                categoryIds: [],
                portalStatus: "ACTIVE",
                vendorType: "STANDARD",
                billingType: [],
                recurringCycle: "",
                companyIds: [],
                defaultInvoiceCompanyId: "",
                restrictInvoiceToDefaultCompany: false,
            })
        }
    }, [open, isEditing, editing, form])

    const filteredVendors = useMemo(() => {
        if (!vendorSearch) return vendors
        const q = vendorSearch.toLowerCase()
        return vendors.filter((v) => v.name.toLowerCase().includes(q))
    }, [vendors, vendorSearch])

    const categoryOptions = useMemo<CategoryOption[]>(() => {
        const categoryMap = new Map(categories.map((category) => [category.id, category]))

        return categories
            .map((category) => {
                const path = buildCategoryPath(category.id, categoryMap)
                const parentPath = path.slice(0, -1)

                return {
                    ...category,
                    pathLabel: path.join(" / "),
                    parentPathLabel: parentPath.length > 0 ? parentPath.join(" / ") : null,
                    searchText: [
                        category.name,
                        path.join(" "),
                        parentPath.join(" "),
                    ].join(" ").toLowerCase(),
                }
            })
            .sort((a, b) => a.pathLabel.localeCompare(b.pathLabel))
    }, [categories])

    const filteredCategoryOptions = useMemo(() => {
        const query = categorySearch.trim().toLowerCase()
        if (!query) return categoryOptions

        return categoryOptions.filter((category) => category.searchText.includes(query))
    }, [categoryOptions, categorySearch])

    const selectedCategoryOptions = useMemo(
        () => selectedCategoryIds
            .map((categoryId) => categoryOptions.find((category) => category.id === categoryId))
            .filter((category): category is CategoryOption => Boolean(category)),
        [categoryOptions, selectedCategoryIds],
    )

    const virtualizer = useVirtualizer({
        count: filteredVendors.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => 36,
        overscan: 8,
    })

    const selectedVendorId = form.watch("existingVendorId")
    const selectedVendor = vendors.find((v) => v.id === selectedVendorId)
    const toggleCategory = (categoryId: string, checked: boolean) => {
        const current = form.getValues("categoryIds")
        const next = checked
            ? [...new Set([...current, categoryId])]
            : current.filter((id) => id !== categoryId)

        form.setValue("categoryIds", next, { shouldValidate: true })
    }

    const toggleCompany = (companyId: string, checked: boolean) => {
        const current = form.getValues("companyIds")
        const next = checked
            ? [...new Set([...current, companyId])]
            : current.filter((id) => id !== companyId)

        form.setValue("companyIds", next, { shouldValidate: true })

        const currentDefault = form.getValues("defaultInvoiceCompanyId") ?? ""
        if (!currentDefault || !next.includes(currentDefault)) {
            form.setValue("defaultInvoiceCompanyId", next[0] ?? "", { shouldValidate: true })
        }
    }

    const onSubmit = (values: VpVendorFormValues) => {
        startTransition(async () => {
            const result = isEditing
                ? await updateVpVendor(editing.id, values)
                : await enrollVpVendor(values)

            if (!result.success) { toast.error(result.error); return }
            toast.success(isEditing ? "Vendor updated" : "Vendor enrolled successfully")
            onSuccess()
            onClose()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-lg min-w-7xl min-h-[95vh] ">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Vendor" : "Enroll Vendor"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the portal configuration for this vendor."
                            : "Add an existing vendor to the portal and configure their billing type."}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[85vh] w-full pr-4"  >

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {!isEditing && (
                                <FormField control={form.control} name="existingVendorId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Vendor <span className="text-destructive">*</span></FormLabel>
                                        <Popover open={comboOpen} onOpenChange={setComboOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline" role="combobox"
                                                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                                    >
                                                        {selectedVendor ? selectedVendor.name : "Select vendor"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                                                <Command shouldFilter={false}>
                                                    <CommandInput
                                                        placeholder="Search vendor..."
                                                        value={vendorSearch}
                                                        onValueChange={setVSearch}
                                                    />
                                                    <CommandList>
                                                        {filteredVendors.length === 0
                                                            ? <CommandEmpty>No vendor found.</CommandEmpty>
                                                            : (
                                                                <CommandGroup className="p-0">
                                                                    <div ref={listRef} className="max-h-56 overflow-auto">
                                                                        <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                                                                            {virtualizer.getVirtualItems().map((row) => {
                                                                                const v = filteredVendors[row.index]
                                                                                return (
                                                                                    <div
                                                                                        key={v.id}
                                                                                        ref={virtualizer.measureElement}
                                                                                        data-index={row.index}
                                                                                        style={{
                                                                                            position: "absolute", top: 0, left: 0,
                                                                                            width: "100%", transform: `translateY(${row.start}px)`,
                                                                                        }}
                                                                                    >
                                                                                        <CommandItem
                                                                                            value={v.name}
                                                                                            onSelect={() => {
                                                                                                form.setValue("existingVendorId", v.id)
                                                                                                setComboOpen(false)
                                                                                            }}
                                                                                        >
                                                                                            <Check className={cn(
                                                                                                "mr-2 h-4 w-4",
                                                                                                field.value === v.id ? "opacity-100" : "opacity-0",
                                                                                            )} />
                                                                                            <div className="flex flex-col">
                                                                                                <span className="text-sm">{v.name}</span>
                                                                                                {v.contactEmail && (
                                                                                                    <span className="text-xs text-muted-foreground">{v.contactEmail}</span>
                                                                                                )}
                                                                                            </div>
                                                                                        </CommandItem>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </CommandGroup>
                                                            )
                                                        }
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}

                            {isEditing && (
                                <div className="rounded-md border bg-muted/40 px-3 py-2">
                                    <p className="text-xs text-muted-foreground">Vendor</p>
                                    <p className="text-sm font-medium">{editing.vendor.name}</p>
                                </div>
                            )}

                            <Separator />

                            <div className="grid grid-cols-2 gap-3">
                                <FormField control={form.control} name="vendorType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vendor Type</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="STANDARD">Standard</SelectItem>
                                                <SelectItem value="IT">IT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="portalStatus" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Portal Status</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
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
                                            <FormLabel>Assigned Categories</FormLabel>
                                            {/* <FormDescription>
                                                Select all categories this vendor can be used for in procurement, PO, and PI flows.
                                            </FormDescription> */}
                                        </div>
                                        {selectedCategoryIds.length > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {selectedCategoryIds.length} selected
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="space-y-3 rounded-md border bg-muted/20 p-3">
                                        <Input
                                            value={categorySearch}
                                            onChange={(event) => setCategorySearch(event.target.value)}
                                            placeholder="Search category, parent, or full path..."
                                        />

                                        {selectedCategoryOptions.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCategoryOptions.map((category) => (
                                                    <Badge
                                                        key={category.id}
                                                        variant="secondary"
                                                        className="max-w-full gap-1 whitespace-normal py-1 text-left"
                                                    >
                                                        <span>{category.pathLabel}</span>
                                                        <button
                                                            type="button"
                                                            className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
                                                            onClick={() => toggleCategory(category.id, false)}
                                                            aria-label={`Remove ${category.pathLabel}`}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        <ScrollArea className="h-[22vh] w-full rounded-md border bg-background p-">
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {filteredCategoryOptions.map((category) => {
                                                const checked = selectedCategoryIds.includes(category.id)
                                                return (
                                                    <label
                                                        key={category.id}
                                                        className="flex items-start gap-3 rounded-md border px-3 py-2"
                                                    >
                                                        <Checkbox
                                                            checked={checked}
                                                            onCheckedChange={(value) => toggleCategory(category.id, value === true)}
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="text-sm font-medium">{category.name}</span>
                                                                {category.parentPathLabel ? (
                                                                    <Badge variant="outline" className="text-[10px]">
                                                                        Child Category
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-[10px]">
                                                                        Root Category
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                Parent: {category.pathLabel}
                                                            </p>
                                                            {/* <p className="text-[11px] text-muted-foreground">
                                                                Parent: {category.parentPathLabel ?? "Top level"}
                                                            </p> */}
                                                        </div>
                                                    </label>
                                                )
                                                })}
                                            </div>

                                            {filteredCategoryOptions.length === 0 && (
                                                <div className="py-6 text-center text-sm text-muted-foreground">
                                                    No categories matched your search.
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Separator />

                            <FormField control={form.control} name="companyIds" render={() => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <FormLabel>Assigned Companies</FormLabel>
                                            {/* <FormDescription>
                                                This vendor can receive POs, PIs, bills, and procurement requests only for the selected companies.
                                            </FormDescription> */}
                                        </div>
                                        {selectedCompanyIds.length > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {selectedCompanyIds.length} selected
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="grid gap-2 rounded-md border bg-muted/20 p-3">
                                        {companies.map((company) => {
                                            const checked = selectedCompanyIds.includes(company.id)
                                            return (
                                                <label
                                                    key={company.id}
                                                    className="flex items-start gap-3 rounded-md border bg-background px-3 py-2"
                                                >
                                                    <Checkbox
                                                        checked={checked}
                                                        onCheckedChange={(value) => toggleCompany(company.id, value === true)}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm font-medium">{company.name}</span>
                                                            {company.code && (
                                                                <Badge variant="outline" className="text-[10px]">{company.code}</Badge>
                                                            )}
                                                             {company.gstin && (
                                                            <span className="text-xs text-muted-foreground">GSTIN: {company.gstin}</span>
                                                        )}
                                                        </div>
                                                       
                                                    </div>
                                                </label>
                                            )
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {selectedCompanyIds.length > 0 && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField control={form.control} name="defaultInvoiceCompanyId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Default Raise Company</FormLabel>
                                            <Select
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select default company" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {companies
                                                        .filter((company) => selectedCompanyIds.includes(company.id))
                                                        .map((company) => (
                                                            <SelectItem key={company.id} value={company.id}>
                                                                {company.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Used as the default company when the vendor raises a bill.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="restrictInvoiceToDefaultCompany" render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-md border px-3 py-2">
                                            <div className="space-y-1">
                                                <FormLabel>Default-Only Vendor Billing</FormLabel>
                                                <FormDescription>
                                                    When enabled, the vendor can raise invoices only for the default raise company.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                            )}

                            <Separator />

                            <FormField control={form.control} name="billingType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billing Types <span className="text-muted-foreground text-[10px] ml-1">(select all that apply)</span></FormLabel>
                                    <div className="grid grid-cols-3 gap-2 rounded-md border bg-muted/20 p-3">
                                        {[
                                            { id: "ONE_TIME", label: "One-Time" },
                                            { id: "RECURRING", label: "Recurring" },
                                            { id: "RENTAL", label: "Rental" },
                                        ].map((type) => (
                                            <div key={type.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`billing-${type.id}`}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    checked={field.value?.includes(type.id as any)}
                                                    onChange={(e) => {
                                                        const val = field.value || []
                                                        const next = e.target.checked
                                                            ? [...val, type.id as any]
                                                            : val.filter((v) => v !== type.id)
                                                        field.onChange(next)
                                                        if (!next.includes("RECURRING")) {
                                                            form.setValue("recurringCycle", "")
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`billing-${type.id}`} className="text-xs font-medium cursor-pointer">
                                                    {type.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {billingType?.includes("RECURRING") && (
                                <FormField control={form.control} name="recurringCycle" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recurring Cycle <span className="text-destructive">*</span></FormLabel>
                                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="w-full"><SelectValue placeholder="Select cycle" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                                <SelectItem value="YEARLY">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}

                            <DialogFooter className="gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Saving..." : isEditing ? "Save Changes" : "Enroll Vendor"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>

            </DialogContent>
        </Dialog>
    )
}
