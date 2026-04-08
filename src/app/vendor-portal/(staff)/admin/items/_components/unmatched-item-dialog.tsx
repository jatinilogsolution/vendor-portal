"use client"

import { useEffect, useMemo, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
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
import { itemSchema, ItemFormValues, UOM_OPTIONS } from "@/validations/vp/item"
import { createVpItemFromUnmatched } from "@/actions/vp/item.action"

type UnmatchedItemDialogProps = {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    vendorId: string
    vendorName: string
    description: string
    unitPrice: number
    categories: { id: string; name: string }[]
}

export function UnmatchedItemDialog({
    open,
    onClose,
    onSuccess,
    vendorId,
    vendorName,
    description,
    unitPrice,
    categories,
}: UnmatchedItemDialogProps) {
    const [isPending, startTransition] = useTransition()

    const inferredCode = useMemo(() => {
        const match = description.match(/\(([^)]+)\)/)
        const raw = match?.[1]?.trim() ?? ""
        if (!raw) return ""
        if (raw.length > 50) return ""
        return raw
    }, [description])

    const unmatchedItemSchema = useMemo(
        () => itemSchema.extend({
            code: z.string().max(50).optional().or(z.literal("")),
        }),
        [],
    )

    const form = useForm<z.infer<typeof unmatchedItemSchema>>({
        resolver: zodResolver(unmatchedItemSchema),
        defaultValues: {
            code: "",
            name: "",
            uom: "PCS",
            defaultPrice: 0,
            hsnCode: "",
            description: "",
            categoryId: "",
        },
    })

    useEffect(() => {
        if (!open) return
        form.reset({
            code: inferredCode,
            name: description,
            uom: "PCS",
            defaultPrice: unitPrice,
            hsnCode: "",
            description,
            categoryId: "",
        })
    }, [open, description, unitPrice, form, inferredCode])

    const onSubmit = (values: z.infer<typeof unmatchedItemSchema>) => {
        startTransition(async () => {
            const result = await createVpItemFromUnmatched({
                vendorId,
                code: values.code?.trim() ?? "",
                name: values.name,
                uom: values.uom,
                defaultPrice: values.defaultPrice,
                hsnCode: values.hsnCode || undefined,
                description: values.description || undefined,
                categoryId: values.categoryId || undefined,
            })
            if (!result.success) {
                toast.error(result.error)
                return
            }
            toast.success("Item added to master")
            onSuccess()
            onClose()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add to Item Master</DialogTitle>
                    <DialogDescription>
                        Convert this unmatched vendor item into the master catalog and notify {vendorName}.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Code</FormLabel>
                                    <FormControl><Input placeholder="e.g. LAP-001" {...field} className="uppercase" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="uom" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>UOM <span className="text-destructive">*</span></FormLabel>
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
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-3">
                            <FormField control={form.control} name="defaultPrice" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Price (₹) <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
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
                                    <FormControl><Input {...field} /></FormControl>
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
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : "Create Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
