// src/app/vendor-portal/(admin)/admin/items/_components/item-dialog.tsx
"use client"

import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { itemSchema, ItemFormValues, UOM_OPTIONS } from "@/validations/vp/item"
import { createVpItem, updateVpItem, VpItemRow } from "@/actions/vp/item.action"

interface ItemDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    editing?: VpItemRow | null
    categories: { id: string; name: string }[]
}

export function ItemDialog({ open, onClose, onSuccess, editing, categories }: ItemDialogProps) {
    const [isPending, startTransition] = useTransition()
    const isEditing = !!editing

    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            code: "", name: "", uom: "PCS",
            defaultPrice: 0, hsnCode: "",
            description: "", categoryId: "",
        },
    })

    useEffect(() => {
        if (open) {
            form.reset(
                editing
                    ? {
                        code: editing.code,
                        name: editing.name,
                        uom: editing.uom,
                        defaultPrice: editing.defaultPrice,
                        hsnCode: editing.hsnCode ?? "",
                        description: editing.description ?? "",
                        categoryId: editing.categoryId ?? "",
                    }
                    : { code: "", name: "", uom: "PCS", defaultPrice: 0, hsnCode: "", description: "", categoryId: "" },
            )
        }
    }, [open, editing])

    const onSubmit = (values: ItemFormValues) => {
        startTransition(async () => {
            const result = isEditing
                ? await updateVpItem(editing.id, values)
                : await createVpItem(values)

            if (!result.success) { toast.error(result.error); return }
            toast.success(isEditing ? "Item updated" : "Item created")
            onSuccess()
            onClose()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Item" : "New Item"}</DialogTitle>
                    <DialogDescription>
                        Items form the line-item catalog for purchase orders and proforma invoices.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Code + Name side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Code <span className="text-destructive">*</span></FormLabel>
                                    <FormControl><Input placeholder="e.g. LAP-001" {...field} className="uppercase" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="uom" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit (UOM) <span className="text-destructive">*</span></FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {UOM_OPTIONS.map((u) => (
                                                <SelectItem key={u} value={u}>{u}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input placeholder="e.g. Dell Laptop 15-inch" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Price + HSN side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name="defaultPrice" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Price (₹) <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="hsnCode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>HSN / SAC Code</FormLabel>
                                    <FormControl><Input placeholder="e.g. 8471" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* >— Uncategorised —</SelectItem> */}
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Additional details about this item..." rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}