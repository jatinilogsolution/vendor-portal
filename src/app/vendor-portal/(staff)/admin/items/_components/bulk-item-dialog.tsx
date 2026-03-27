"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { toast } from "sonner"
import { IconCopy, IconPlus, IconTrash, IconDeviceFloppy } from "@tabler/icons-react"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UOM_OPTIONS } from "@/validations/vp/item"
import { createVpItem } from "@/actions/vp/item.action"

interface BulkItemDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    categories: { id: string; name: string }[]
}

type DraftItem = {
    id: string
    code: string
    name: string
    uom: string
    defaultPrice: string
    hsnCode: string
    categoryId: string
    description: string
}

export function BulkItemDialog({ open, onClose, onSuccess, categories }: BulkItemDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [rows, setRows] = useState<DraftItem[]>([])

    // Add empty row
    const addRow = () => {
        setRows(prev => [
            ...prev,
            { id: Math.random().toString(), code: "", name: "", uom: "PCS", defaultPrice: "0", hsnCode: "", categoryId: "", description: "" }
        ])
    }

    // Init rows when open
    useEffect(() => {
        if (open) {
            setRows([{ id: Math.random().toString(), code: "", name: "", uom: "PCS", defaultPrice: "0", hsnCode: "", categoryId: "", description: "" }])
        }
    }, [open])

    const updateRow = (id: string, field: keyof DraftItem, value: string) => {
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

        const newRows: DraftItem[] = lines.map(line => {
            const cols = line.split("\t")
            const code = cols[0]?.trim() || ""
            const name = cols[1]?.trim() || ""
            let uom = cols[2]?.trim().toUpperCase() || "PCS"
            if (!UOM_OPTIONS.includes(uom as any)) uom = "PCS"
            const defaultPrice = cols[3]?.trim() || "0"
            const hsnCode = cols[4]?.trim() || ""

            // Try matching category by name
            const catNameStr = cols[5]?.trim().toLowerCase()
            let categoryId = ""
            if (catNameStr) {
                const match = categories.find(c => c.name.toLowerCase() === catNameStr)
                if (match) categoryId = match.id
            }

            return {
                id: Math.random().toString(),
                code,
                name,
                uom,
                defaultPrice,
                hsnCode,
                categoryId,
                description: ""
            }
        })

        if (newRows.length > 0) {
            // override first empty row if taking up space and user pasted
            const finalRows = rows.length === 1 && !rows[0].code && !rows[0].name ? [...newRows] : [...rows, ...newRows]
            setRows(finalRows)
            toast.success(`Pasted ${newRows.length} items`)
        }
    }

    const handleSave = () => {
        const validRows = rows.filter(r => r.code.trim() && r.name.trim())
        if (validRows.length === 0) {
            toast.error("Please fill at least one row with code and name.")
            return
        }
        startTransition(async () => {
            let successCount = 0
            for (const r of validRows) {
                const res = await createVpItem({
                    code: r.code,
                    name: r.name,
                    uom: r.uom,
                    defaultPrice: Number(r.defaultPrice) || 0,
                    hsnCode: r.hsnCode,
                    categoryId: r.categoryId || undefined,
                    description: r.description
                })
                if (res.success) successCount++
                else toast.error(`Row ${r.code}: ` + res.error)
            }
            if (successCount > 0) toast.success(`Created ${successCount} items successfully`)
            if (successCount === validRows.length) {
                onSuccess()
                onClose()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="min-w-svw h-[85vh] flex flex-col p-4 bg-muted gap-2">
                <DialogHeader className="px-2 pb-0 mb-0 space-y-1">
                    <DialogTitle>Bulk Create Items</DialogTitle>
                    <DialogDescription className="mt-1">
                        Pasting tabular data from Excel/Google Sheets works! Columns: <br />
                        <span className="font-semibold px-2 py-0.5 mt-2 bg-muted/60 border border-dashed rounded text-xs inline-flex items-center gap-2">
                            <span>1. Code</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>2. Name</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>3. UOM</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>4. Price</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>5. HSN</span>
                            <span className="text-muted-foreground/50">|</span>
                            <span>6. Category</span>
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
                                <th className="p-2 font-medium w-[12%] text-muted-foreground">Code *</th>
                                <th className="p-2 font-medium w-[25%] text-muted-foreground">Name *</th>
                                <th className="p-2 font-medium w-[8%] text-muted-foreground">UOM</th>
                                <th className="p-2 font-medium w-[10%] text-muted-foreground">Price *</th>
                                <th className="p-2 font-medium w-[12%] text-muted-foreground">HSN</th>
                                <th className="p-2 font-medium w-[18%] text-muted-foreground">Category</th>
                                <th className="p-2 font-medium w-[10%] text-muted-foreground flex items-center justify-between">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y relative">
                            {rows.length === 0 && (
                                <tr className="pointer-events-none">
                                    <td colSpan={7} className="h-40">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background pointer-events-none text-muted-foreground/60 border border-dashed m-3 rounded-xl gap-2 z-0">
                                            <IconCopy className="opacity-40" size={32} />
                                            <p className="text-sm font-medium">No items entered.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {rows.map((row, idx) => (
                                <tr key={row.id} className="group hover:bg-muted/10 relative z-10 transition-colors">
                                    <td className="p-1">
                                        <Input
                                            className="h-8 text-[11px] font-mono uppercase bg-transparent border-transparent shadow-none focus-visible:bg-background focus-visible:border-input focus-visible:ring-1"
                                            value={row.code}
                                            onChange={(e) => updateRow(row.id, "code", e.target.value)}
                                            placeholder="LAP-01"
                                        />
                                    </td>
                                    <td className="p-1">
                                        <Input
                                            className="h-8 text-xs bg-transparent border-transparent shadow-none focus-visible:bg-background focus-visible:border-input focus-visible:ring-1"
                                            value={row.name}
                                            onChange={(e) => updateRow(row.id, "name", e.target.value)}
                                            placeholder="Item Name"
                                        />
                                    </td>
                                    <td className="p-1 text-center">
                                        <Select
                                            value={row.uom}
                                            onValueChange={(v) => updateRow(row.id, "uom", v)}
                                        >
                                            <SelectTrigger className="h-8 text-[10px] w-full px-2 justify-center bg-transparent border-transparent shadow-none focus:bg-background focus:ring-1 focus:ring-ring focus:border-input pr-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {UOM_OPTIONS.map(u => (
                                                    <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-1">
                                        <Input
                                            type="number"
                                            min={0}
                                            className="h-8 text-xs font-mono bg-transparent border-transparent shadow-none focus-visible:bg-background focus-visible:border-input focus-visible:ring-1 text-right pr-2"
                                            value={row.defaultPrice}
                                            onChange={(e) => updateRow(row.id, "defaultPrice", e.target.value)}
                                        />
                                    </td>
                                    <td className="p-1">
                                        <Input
                                            className="h-8 text-[11px] font-mono bg-transparent border-transparent shadow-none focus-visible:bg-background focus-visible:border-input focus-visible:ring-1"
                                            value={row.hsnCode}
                                            onChange={(e) => updateRow(row.id, "hsnCode", e.target.value)}
                                            placeholder="HSN"
                                        />
                                    </td>
                                    <td className="p-1">
                                        <Select
                                            value={row.categoryId || "none"}
                                            onValueChange={(v) => updateRow(row.id, "categoryId", v === "none" ? "" : v)}
                                        >
                                            <SelectTrigger className="h-8 text-xs w-full px-2 bg-transparent border-transparent shadow-none focus:bg-background focus:ring-1 focus:ring-ring focus:border-input pr-1 truncate text-left items-start justify-start">
                                                <SelectValue placeholder={<span className="text-muted-foreground/60 italic">None</span>} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" className="text-xs text-muted-foreground italic">None</SelectItem>
                                                {categories.map(c => (
                                                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="p-1 flex items-center gap-1 group/btn relative min-w-[160px]">
                                        <Input
                                            className="h-8 text-[11px] bg-transparent border-transparent shadow-none focus-visible:bg-background focus-visible:border-input focus-visible:ring-1"
                                            value={row.description}
                                            onChange={(e) => updateRow(row.id, "description", e.target.value)}
                                            placeholder="Optional details"
                                        />
                                        <Button
                                            variant="ghost" size="icon" className="h-6 w-6 absolute right-1 bg-background opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all border shadow-sm rounded-sm"
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
                        <span>Items: {rows.length}</span>
                        <span>Valid: {rows.filter(r => r.code.trim() && r.name.trim()).length}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={isPending || rows.length === 0}>
                            <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                            {isPending ? "Starting..." : "Save All to Catalog"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
