"use client"

import { useState, useEffect, useTransition, FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash, Upload, FileText } from "lucide-react"
import { toast } from "sonner"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { deleteInvoiceFile, saveInvoiceFile, updateBillToAddress } from "../_action/invoice-update"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getInvoiceOnlyById } from "../_action/invoice-list"
import { WarehouseSelector } from "@/components/modules/warehouse-selector"
import { Invoice } from "@/generated/prisma/client"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InvoiceManagementProps {
    invoiceId: string
    initialFile?: { id: string; fileUrl: string; name: string }
    invoiceNumber?: string
    referenceNumber: string
    initialInvoiceDate?: string | null
    onUpdate?: () => void
}

export const InvoiceManagement = ({
    invoiceId,
    initialFile,
    invoiceNumber,
    referenceNumber,
    initialInvoiceDate,
    onUpdate
}: InvoiceManagementProps) => {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [file, setFile] = useState<File | null>(null)
    const [uploadedFile, setUploadedFile] = useState<{
        id: string
        fileUrl: string
        name: string
    } | null>(initialFile ?? null)
    const [loading, setLoading] = useState(false)
    const [invoiceNo, setInvoiceNo] = useState<string | undefined>(invoiceNumber)
    const [invoiceDate, setInvoiceDate] = useState<string>("")
    const [data, setData] = useState<Invoice | null>(null)
    const [billToValue, setBillToValue] = useState<string>("")

    // Calculate financial year start (April 1st of current year)
    const getFinancialYearStart = () => {
        const today = new Date()
        const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1
        return `${year}-04-01`
    }

    const today = new Date().toISOString().split("T")[0]
    const minDate = getFinancialYearStart()

    // Fetch invoice data when dialog opens
    useEffect(() => {
        if (open) {
            const fetchInvoice = async () => {
                const { data, error } = await getInvoiceOnlyById({ id: invoiceId })
                if (!error && data) {
                    setData(data)
                    setBillToValue(data.billToId || "")
                    if (data.invoiceNumber) setInvoiceNo(data.invoiceNumber)
                }
            }
            fetchInvoice()
        }
    }, [invoiceId, open])

    // Sync initial invoice date
    useEffect(() => {
        if (initialInvoiceDate) {
            setInvoiceDate(initialInvoiceDate)
        }
    }, [initialInvoiceDate, open])

    const handleDrop = (files: File[]) => {
        if (files.length === 0) return
        setFile(files[0])
    }

    const handleSubmit = async () => {
        // Validate all required fields
        if (!billToValue?.trim()) {
            toast.warning("Please select a warehouse (Bill To)")
            return
        }

        if (!invoiceNo?.trim()) {
            toast.warning("Please provide invoice number")
            return
        }

        if (!invoiceDate) {
            toast.warning("Please select invoice date")
            return
        }

        if (!file && !uploadedFile?.fileUrl) {
            toast.warning("Please upload an invoice file")
            return
        }

        setLoading(true)
        try {
            // 1. Update Bill To Address
            await updateBillToAddress(invoiceId, billToValue)

            // 2. Upload file if new file is selected
            if (file) {
                const savedFile = await saveInvoiceFile(invoiceId, invoiceNo.trim(), file, referenceNumber, invoiceDate)
                setUploadedFile(savedFile)
                setFile(null)
            }

            setOpen(false)
            toast.success("Invoice updated successfully")
            onUpdate?.()
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to update invoice")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!uploadedFile) return
        setLoading(true)
        try {
            await deleteInvoiceFile(invoiceId, uploadedFile.fileUrl)
            setUploadedFile(null)
            setFile(null)
            toast.success("File deleted successfully")
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete file")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" /> Manage Invoice
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-6xl w-full max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Manage Invoice - {referenceNumber}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[75vh] pr-4">
                    <div className="space-y-6 pb-4">
                        {/* Bill To / Warehouse */}
                        <div className="space-y-2">
                            <Label>
                                Warehouse (Bill To) <span className="text-red-500">*</span>
                            </Label>
                            <WarehouseSelector value={billToValue} setValue={setBillToValue} />
                        </div>

                        {/* Invoice Number */}
                        <div className="space-y-2">
                            <Label>
                                Invoice Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                value={invoiceNo ?? ""}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                                placeholder="Enter invoice number"
                            />
                        </div>

                        {/* Invoice Date */}
                        <div className="space-y-2">
                            <Label>
                                Invoice Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="date"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                min={minDate}
                                max={today}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Allowed: {new Date(minDate).toLocaleDateString("en-IN")} → {new Date(today).toLocaleDateString("en-IN")}
                            </p>
                        </div>

                        {/* File Upload */}
                        {!(uploadedFile?.fileUrl && !file) && (
                            <>
                                <Label>
                                    Invoice File (PDF or Image, max 10MB) <span className="text-red-500">*</span>
                                </Label>
                                <Dropzone
                                    accept={{ "image/*": [], "application/pdf": [] }}
                                    maxFiles={1}
                                    maxSize={1024 * 1024 * 10}
                                    onDrop={handleDrop}
                                    onError={() => toast.error("File must be less than 10MB")}
                                    src={file ? [file] : undefined}
                                    className="border-dashed border-2 p-8 rounded-lg"
                                >
                                    <DropzoneEmptyState />
                                    <DropzoneContent />
                                </Dropzone>
                            </>
                        )}

                        {/* Selected file preview */}
                        {file && (
                            <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-lg">
                                <FileText className="w-5 h-5" />
                                <span className="font-medium">{file.name}</span>
                                <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                        )}

                        {/* Existing uploaded file */}
                        {uploadedFile?.fileUrl && !file && (
                            <div className="flex items-center justify-between border p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    <a
                                        href={uploadedFile.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        {uploadedFile.name}
                                    </a>
                                </div>
                                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
                                    <Trash className="w-4 h-4 mr-1" /> Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer with action buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Spinner className="w-5 h-5 mr-2" /> : null}
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
