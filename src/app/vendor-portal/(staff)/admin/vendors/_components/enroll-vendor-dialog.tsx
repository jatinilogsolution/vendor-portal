// src/app/vendor-portal/(admin)/admin/vendors/_components/enroll-vendor-dialog.tsx
"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useForm, Control, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Check, ChevronsUpDown } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { vpVendorSchema, VpVendorFormValues } from "@/validations/vp/vendor"
import {
    enrollVpVendor, updateVpVendor,
    getUnenrolledVendors, VpVendorRow,
} from "@/actions/vp/vendor.action"
import { getVpCategoriesFlat } from "@/actions/vp/category.action"

interface EnrollVendorDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    editing?: VpVendorRow | null
}

type RawVendor = { id: string; name: string; contactEmail: string | null }
type Category = { id: string; name: string; parentId: string | null }

export function EnrollVendorDialog({
    open, onClose, onSuccess, editing,
}: EnrollVendorDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [vendors, setVendors] = useState<RawVendor[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [vendorSearch, setVSearch] = useState("")
    const [comboOpen, setComboOpen] = useState(false)
    const listRef = useRef<HTMLDivElement | null>(null)
    const isEditing = !!editing

    const form = useForm<VpVendorFormValues>({
        resolver: zodResolver(vpVendorSchema) as Resolver<VpVendorFormValues>,
        defaultValues: {
            existingVendorId: "",
            categoryId: "",
            portalStatus: "ACTIVE",
            vendorType: "STANDARD",
            billingType: [],
            recurringCycle: "",
        },
    })

    const billingType = form.watch("billingType")
    const vendorType = form.watch("vendorType")

    // Load data when dialog opens
    useEffect(() => {
        if (!open) return
        Promise.all([
            isEditing ? Promise.resolve({ success: true, data: [] as RawVendor[] }) : getUnenrolledVendors(),
            getVpCategoriesFlat(),
        ]).then(([vRes, cRes]) => {
            if (vRes.success) setVendors(vRes.data)
            if (cRes.success) setCategories(cRes.data)
        })

        if (isEditing) {
            form.reset({
                existingVendorId: editing.existingVendorId,
                categoryId: editing.categoryId || "",
                portalStatus: (editing.portalStatus === "ACTIVE" || editing.portalStatus === "INACTIVE") ? editing.portalStatus : "ACTIVE",
                vendorType: (editing.vendorType === "STANDARD" || editing.vendorType === "IT") ? editing.vendorType : "STANDARD",
                billingType: editing.billingType as ("ONE_TIME" | "RECURRING" | "RENTAL")[],
                recurringCycle: (editing.recurringCycle || "") as any,
            })
        } else {
            form.reset({
                existingVendorId: "",
                categoryId: "",
                portalStatus: "ACTIVE",
                vendorType: "STANDARD",
                billingType: [],
                recurringCycle: "",
            })
        }
    }, [open, isEditing, editing, form])

    const filteredVendors = useMemo(() => {
        if (!vendorSearch) return vendors
        const q = vendorSearch.toLowerCase()
        return vendors.filter((v) => v.name.toLowerCase().includes(q))
    }, [vendors, vendorSearch])

    const virtualizer = useVirtualizer({
        count: filteredVendors.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => 36,
        overscan: 8,
    })

    const selectedVendorId = form.watch("existingVendorId")
    const selectedVendor = vendors.find((v) => v.id === selectedVendorId)

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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Vendor" : "Enroll Vendor"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the portal configuration for this vendor."
                            : "Add an existing vendor to the portal and configure their billing type."}
                    </DialogDescription>
                </DialogHeader>

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

                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

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
            </DialogContent>
        </Dialog>
    )
}