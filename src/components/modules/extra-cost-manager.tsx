"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Plus,
    Trash2,
    Upload,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Loader2,
    IndianRupee,
    Save,
} from "lucide-react"
import { uploadExtraCost } from "@/actions/upload/upload-extra-cost"
import { toast } from "sonner"

interface ExtraCostItem {
    id: string
    description: string
    amount: number
    file?: File
    uploadUrl?: string
    uploadStatus: "idle" | "uploading" | "success" | "error"
    uploadError?: string
    createdAt?: string | Date
}

interface ExtraCostManagerProps {
    fileNumber: string
    totalExtra?: string // optional display-only total from parent
    onSuccess?: () => void // callback after successful save
    readOnly?: boolean
}

export default function ExtraCostManager({
    fileNumber,
    totalExtra,
    onSuccess,
    readOnly = false,
}: ExtraCostManagerProps) {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<ExtraCostItem[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    // Load data when dialog opens
    useEffect(() => {
        if (open && fileNumber) {
            fetchExistingCosts()
        }
    }, [open, fileNumber])

    const fetchExistingCosts = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/cost?fileNumber=${fileNumber}`)
            if (!res.ok) throw new Error("Failed to fetch costs")
            const data = await res.json()

            const formattedItems: ExtraCostItem[] = data.map((item: any) => ({
                id: item.id,
                description: item.description,
                amount: item.amount,
                uploadUrl: item.url, // and the API now returns 'url'
                uploadStatus: "success",
                createdAt: item.createdAt,
            }))

            setItems(formattedItems)
        } catch (error) {
            console.error("Error loading extra costs:", error)
            toast.error("Failed to load existing extra costs")
        } finally {
            setLoading(false)
        }
    }

    const addRow = () => {
        if (readOnly) return
        const newItem: ExtraCostItem = {
            id: crypto.randomUUID(),
            description: "",
            amount: 0,
            uploadStatus: "idle",
        }
        setItems([newItem, ...items]) // new items on top
    }

    const updateItem = (id: string, updates: Partial<ExtraCostItem>) => {
        if (readOnly) return
        setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    }

    const removeItem = (id: string) => {
        if (readOnly) return
        setItems(items.filter((item) => item.id !== id))
    }

    const handleFileSelect = (id: string, file: File | undefined) => {
        if (readOnly) return
        updateItem(id, { file, uploadStatus: "idle" })
    }

    const handleUpload = async (id: string) => {
        if (readOnly) return
        const item = items.find((i) => i.id === id)
        if (!item?.file) return

        updateItem(id, { uploadStatus: "uploading" })

        try {
            const formData = new FormData()
            formData.append("file", item.file)

            const result = await uploadExtraCost(
                formData,
                fileNumber,
                item.description || "extra_cost",
                item.amount
            )

            if (result.success && result.url) {
                updateItem(id, {
                    uploadStatus: "success",
                    uploadUrl: result.url,
                    uploadError: undefined,
                    file: undefined,
                })
                toast.success("File uploaded successfully")
            } else {
                throw new Error(result.error || "Upload failed")
            }
        } catch (error: any) {
            updateItem(id, {
                uploadStatus: "error",
                uploadError: error.message || "Upload failed. Please try again.",
            })
            toast.error(error.message || "Upload failed")
        }
    }

    const handleSave = async () => {
        if (readOnly) return
        // Validation: All items must have a description, amount > 0, and an uploaded file
        const invalidItems = items.filter(
            item => !item.description || item.amount <= 0 || item.uploadStatus !== "success"
        )

        if (invalidItems.length > 0) {
            toast.error("Please ensure all items have description, amount, and an uploaded file")
            return
        }

        setSaving(true)
        try {
            const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

            const res = await fetch("/api/cost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileNumber,
                    items: items.map(item => ({
                        description: item.description,
                        amount: item.amount,
                        url: item.uploadUrl
                    })),
                    totalExtraCost: totalAmount
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to save costs")
            }

            toast.success("Extra costs saved successfully")
            onSuccess?.()
            setOpen(false)
        } catch (error: any) {
            console.error("Error saving extra costs:", error)
            toast.error(error.message || "Failed to save costs")
        } finally {
            setSaving(false)
        }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

    const formatINR = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button variant="outline" size={"sm"} className="gap-2">

                    {readOnly ? totalExtra ? "" : "₹ 0.00" : "Manage Extra Costs"}
                    {totalExtra && <span className="font-medium">{totalExtra}</span>}
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-235 max-h-[90vh] p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <DialogTitle className="text-xl">
                        Extra Costs — File <span className="font-bold">{fileNumber}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col h-full">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40">
                        {!readOnly ? (
                            <Button onClick={addRow} size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Extra Cost
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
                                <AlertCircle className="h-4 w-4" />
                                View Only Mode
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                {items.length} {items.length === 1 ? "item" : "items"}
                            </span>
                            <div className="h-6 w-px bg-border" />
                            <span className="text-lg font-semibold">
                                Total: {formatINR(totalAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Table */}
                    <ScrollArea className="flex-1 max-h-[48vh] px-6">
                        <div className="py-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                                    <p className="text-sm text-muted-foreground">Loading extra costs...</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <div className="p-4 bg-muted rounded-full mb-4">
                                        <IndianRupee className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <p className="text-lg font-medium text-muted-foreground">
                                        No extra costs added yet
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Click "Add Extra Cost" to begin
                                    </p>
                                </div>
                            ) : (
                                <Table className=" w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[200px]">Description</TableHead>
                                            <TableHead className="text-right w-32">Amount</TableHead>
                                            <TableHead className="w-64">Document</TableHead>
                                            {!readOnly && <TableHead className="w-12"></TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className={item.createdAt ? "" : "bg-primary/5"}
                                            >
                                                <TableCell>
                                                    {readOnly || (item.uploadStatus === "success" && item.createdAt) ? (
                                                        <div>
                                                            <p className="font-medium">{item.description}</p>
                                                            {item.createdAt && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    Added on {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            placeholder="e.g., Toll charges, Detention"
                                                            value={item.description}
                                                            onChange={(e) =>
                                                                updateItem(item.id, { description: e.target.value })
                                                            }
                                                            disabled={item.uploadStatus === "uploading"}
                                                        />
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    {readOnly ? (
                                                        <span className="font-medium">{formatINR(item.amount)}</span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="number"
                                                                className="w-28 text-right"
                                                                value={item.amount || ""}
                                                                onChange={(e) =>
                                                                    updateItem(item.id, { amount: Number(e.target.value) || 0 })
                                                                }
                                                                disabled={item.uploadStatus === "uploading"}
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {item.uploadStatus === "success" ? (
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            <a
                                                                href={item.uploadUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-primary hover:underline flex items-center gap-1"
                                                            >
                                                                View Document
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        </div>
                                                    ) : item.uploadStatus === "uploading" ? (
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span className="text-sm">Uploading...</span>
                                                        </div>
                                                    ) : item.uploadStatus === "error" ? (
                                                        <div className="flex items-center gap-2 text-destructive">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <span className="text-sm">Failed</span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleUpload(item.id)}
                                                            >
                                                                Retry
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="file"
                                                                id={`file-${item.id}`}
                                                                className="hidden"
                                                                onChange={(e) =>
                                                                    handleFileSelect(item.id, e.target.files?.[0])
                                                                }
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    document.getElementById(`file-${item.id}`)?.click()
                                                                }
                                                            >
                                                                {item.file ? item.file.name : "Choose File"}
                                                            </Button>
                                                            {item.file && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpload(item.id)}
                                                                >
                                                                    <Upload className="h-4 w-4 mr-1" />
                                                                    Upload
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>

                                                {!readOnly && (
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    {!readOnly && (
                        <div className="border-t px-6 py-4 bg-muted/40 flex justify-end">
                            <Button
                                size="lg"
                                className="gap-2"
                                onClick={handleSave}
                                disabled={saving || items.length === 0}
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {saving ? "Saving..." : "Save Extra Costs"}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}