"use client"

import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { IconCopy, IconPlus, IconTrash, IconDeviceFloppy } from "@tabler/icons-react"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createVpCategory } from "@/actions/vp/category.action"

interface BulkCategoryDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    parentCategories: { id: string; name: string }[]
}

type DraftCat = {
    id: string
    name: string
    code: string
    status: string
    parentId: string
}

export function BulkCategoryDialog({ open, onClose, onSuccess, parentCategories }: BulkCategoryDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [rows, setRows] = useState<DraftCat[]>([])

    // Add empty row
    const addRow = () => {
        setRows(prev => [
            ...prev,
            { id: Math.random().toString(), name: "", code: "", status: "ACTIVE", parentId: "" }
        ])
    }

    // Init rows when open
    useEffect(() => {
        if (open) {
            setRows([{ id: Math.random().toString(), name: "", code: "", status: "ACTIVE", parentId: "" }])
        }
    }, [open])

    const updateRow = (id: string, field: keyof DraftCat, value: string) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    const removeRow = (id: string) => {
        setRows(prev => prev.filter(r => r.id !== id))
    }

    // Spreadsheet paste handler
    const handlePaste = (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData("Text")
        if (!text) return

        const lines = text.split(/\r?\n/).filter(line => line.trim())
        if (lines.length > 0) {
            e.preventDefault()
        }

        const newRows: DraftCat[] = lines.map(line => {
            const cols = line.split("\t")
            const name = cols[0]?.trim() || ""
            const code = cols[1]?.trim() || ""
            let status = cols[2]?.trim().toUpperCase() || "ACTIVE"
            if (!["ACTIVE", "INACTIVE", "ARCHIVED"].includes(status)) status = "ACTIVE"

            // Try matching parent category by name
            const parentNameStr = cols[3]?.trim().toLowerCase()
            let parentId = ""
            if (parentNameStr) {
                const match = parentCategories.find(c => c.name.toLowerCase() === parentNameStr)
                if (match) parentId = match.id
            }

            return {
                id: Math.random().toString(),
                name,
                code,
                status,
                parentId,
            }
        })

        if (newRows.length > 0) {
            const finalRows = rows.length === 1 && !rows[0].name ? [...newRows] : [...rows, ...newRows]
            setRows(finalRows)
            toast.success(`Pasted ${newRows.length} categories`)
        }
    }

    const handleSave = () => {
        const validRows = rows.filter(r => r.name.trim())
        if (validRows.length === 0) {
            toast.error("Please fill at least one row with a category name.")
            return
        }
        startTransition(async () => {
            let successCount = 0
            for (const r of validRows) {
                const res = await createVpCategory({
                    name: r.name,
                    code: r.code || undefined,
                    status: r.status as any,
                    parentId: r.parentId || undefined,
                })
                if (res.success) successCount++
                else toast.error(`Row ${r.name}: ` + res.error)
            }
            if (successCount > 0) toast.success(`Created ${successCount} categories successfully`)
            if (successCount === validRows.length) {
                onSuccess()
                onClose()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="min-w-svw  h-[85vh] flex flex-col p-4 bg-muted gap-2">
                <DialogHeader className="px-2 pb-0 mb-0 space-y-1">
                    <DialogTitle>Bulk Create Categories</DialogTitle>
                    <DialogDescription className="mt-1">
                        Pasting tabular data from Excel/Google Sheets works! Columns: <br />
                        <span className="font-semibold px-2 py-0.5 mt-2 bg-muted/60 border border-dashed rounded text-xs inline-flex items-center gap-2">
                            <span>1. Category Name</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>2. Code (opt)</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>3. Status</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>4. Parent Category</span>
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div
                    className="flex-1 overflow-auto bg-background border rounded-md relative p-2"
                    onPaste={handlePaste}
                >
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-left sticky top-0 z-10 shadow-sm text-xs">
                            <tr>
                                <th className="p-2 font-medium w-[30%] text-muted-foreground">Name *</th>
                                <th className="p-2 font-medium w-[20%] text-muted-foreground">Code</th>
                                <th className="p-2 font-medium w-[15%] text-muted-foreground">Status</th>
                                <th className="p-2 font-medium w-[30%] text-muted-foreground flex items-center justify-between">
                                    Parent / Subcategory Under
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y relative">
                            {rows.length === 0 && (
                                <tr className="pointer-events-none">
                                    <td colSpan={4} className="h-40">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background pointer-events-none text-muted-foreground/60 border border-dashed m-3 rounded-xl gap-2 z-0">
                                            <IconCopy className="opacity-40" size={32} />
                                            <p className="text-sm font-medium">No categories entered.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {rows.map((row, idx) => (
                                <tr key={row.id} className="group hover:bg-muted/10 relative z-10 transition-colors">
                                    <td className="p-1">
                                        <Input
                                            className="h-8 text-xs bg-transparent border-transparent shadow-none focus-visible:bg-background focus-visible:border-input focus-visible:ring-1"
                                            value={row.name}
                                            onChange={(e) => updateRow(row.id, "name", e.target.value)}
                                            placeholder="Hardware"
                                        />
                                    </td>
                                    <td className="p-1">
                                        <Input
                                            className="h-8 text-[11px] font-mono bg-transparent border-transparent shadow-none focus-visible:bg-background focus-visible:border-input focus-visible:ring-1 uppercase"
                                            value={row.code}
                                            onChange={(e) => updateRow(row.id, "code", e.target.value)}
                                            placeholder="HDW"
                                        />
                                    </td>
                                    <td className="p-1 text-center">
                                        <Select
                                            value={row.status}
                                            onValueChange={(v) => updateRow(row.id, "status", v)}
                                        >
                                            <SelectTrigger className="h-8 text-xs w-full px-2 justify-center bg-transparent border-transparent shadow-none focus:bg-background focus:ring-1 focus:ring-ring focus:border-input pr-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE" className="text-xs">Active</SelectItem>
                                                <SelectItem value="INACTIVE" className="text-xs">Inactive</SelectItem>
                                                <SelectItem value="ARCHIVED" className="text-xs">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-1 flex items-center gap-1 group/btn relative mt-0.5">
                                        <Select
                                            value={row.parentId || "none"}
                                            onValueChange={(v) => updateRow(row.id, "parentId", v === "none" ? "" : v)}
                                        >
                                            <SelectTrigger className="h-8 text-xs w-full px-2 bg-transparent border-transparent shadow-none focus:bg-background focus:ring-1 focus:ring-ring focus:border-input pr-1 truncate text-left items-start justify-start">
                                                <SelectValue placeholder={<span className="text-muted-foreground/60 italic">None (Top Level)</span>} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" className="text-xs text-muted-foreground italic">None (Top Level)</SelectItem>
                                                {parentCategories.map(c => (
                                                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost" size="icon" className="h-6 w-6 absolute right-1 top-1 bg-background opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all border shadow-sm rounded-sm"
                                            onClick={() => removeRow(row.id)}
                                            tabIndex={-1}
                                        >
                                            <IconTrash size={12} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        className="w-full text-center py-2.5 text-xs font-medium text-muted-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors rounded-sm flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sticky bottom-0 bg-background/50 backdrop-blur-sm z-10 border-t"
                        onClick={addRow}
                    >
                        <IconPlus size={13} stroke={2.5} /> Add Empty Row
                    </button>

                </div>

                <DialogFooter className="px-2 pt-1 flex items-center justify-between sm:justify-between w-full">
                    <p className="text-xs text-muted-foreground mr-auto flex gap-3">
                        <span>Categories: {rows.length}</span>
                        <span>Valid: {rows.filter(r => r.name.trim()).length}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={isPending || rows.length === 0}>
                            <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                            {isPending ? "Starting..." : "Save All"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
