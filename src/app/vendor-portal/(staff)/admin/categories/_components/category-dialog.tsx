// src/app/vendor-portal/(admin)/admin/categories/_components/category-dialog.tsx
"use client"

import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { categorySchema, CategoryFormValues } from "@/validations/vp/category"
import { createVpCategory, updateVpCategory, VpCategoryFlat } from "@/actions/vp/category.action"

interface CategoryDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    editing?: VpCategoryFlat | null
    // Flat list of all categories for parent picker
    allCategories: { id: string; name: string; parentId: string | null }[]
    // Pre-fill parentId when adding a sub-category
    defaultParentId?: string
}

export function CategoryDialog({
    open, onClose, onSuccess, editing, allCategories, defaultParentId,
}: CategoryDialogProps) {
    const [isPending, startTransition] = useTransition()
    const isEditing = !!editing

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "", code: "", status: "ACTIVE", parentId: "" },
    })

    // Reset form when dialog opens/editing changes
    useEffect(() => {
        if (open) {
            form.reset(
                editing
                    ? {
                        name: editing.name,
                        code: editing.code ?? "",
                        status: editing.status as "ACTIVE" | "INACTIVE" | "ARCHIVED",
                        parentId: editing.parentId ?? "",
                    }
                    : { name: "", code: "", status: "ACTIVE", parentId: defaultParentId ?? "" },
            )
        }
    }, [open, editing, defaultParentId])

    // Filter out self and descendants from parent options
    const getDescendantIds = (id: string): string[] => {
        const children = allCategories.filter((c) => c.parentId === id)
        return [id, ...children.flatMap((c) => getDescendantIds(c.id))]
    }
    const excludeIds = editing ? getDescendantIds(editing.id) : []
    const parentOptions = allCategories.filter((c) => !excludeIds.includes(c.id))

    const onSubmit = (values: CategoryFormValues) => {
        startTransition(async () => {
            const result = isEditing
                ? await updateVpCategory(editing.id, values)
                : await createVpCategory(values)

            if (!result.success) {
                toast.error(result.error)
                return
            }
            toast.success(isEditing ? "Category updated" : "Category created")
            onSuccess()
            onClose()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Category" : "New Category"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input placeholder="e.g. IT Services" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="code" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                                <FormControl><Input placeholder="e.g. IT-SVC" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="parentId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent Category <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Top-level (no parent)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* >— Top-level —</SelectItem> */}
                                        {parentOptions.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}