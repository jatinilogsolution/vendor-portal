"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash, Upload, FileText } from "lucide-react"
import { toast } from "sonner"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { deleteInvoiceFile, saveInvoiceFile } from "../_action/invoice-update"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface InvoiceFileUploadProps {
  invoiceId: string
  initialFile?: { id: string; fileUrl: string; name: string }
  invoiceNumber?: string
  referenceNumber: string
  initialInvoiceDate?: string | null // Expecting YYYY-MM-DD string or null
}

export const InvoiceFileUploadSingle = ({
  invoiceId,
  initialFile,
  invoiceNumber,
  referenceNumber,
  initialInvoiceDate
}: InvoiceFileUploadProps) => {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{
    id: string
    fileUrl: string
    name: string
  } | null>(initialFile ?? null)
  const [loading, setLoading] = useState(false)
  const [invoiceNo, setInvoiceNo] = useState<string | undefined>(invoiceNumber)
  
  // Handle invoice date as string in YYYY-MM-DD format (native for <input type="date">)
  const [invoiceDate, setInvoiceDate] = useState<string>("")

  // Calculate financial year start (April 1st of current year)
  const getFinancialYearStart = () => {
    const today = new Date()
    const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1 // April onwards = current year
    return `${year}-04-01`
  }

 
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
  const minDate = getFinancialYearStart() // e.g., "2025-04-01"

  // Sync initialInvoiceDate when dialog opens or prop changes
  useEffect(() => {
    if (initialInvoiceDate) {
      setInvoiceDate(initialInvoiceDate) // assuming it's already in YYYY-MM-DD
    }
  }, [initialInvoiceDate, open])

  const handleDrop = (files: File[]) => {
    if (files.length === 0) return
    setFile(files[0])
  }

  const handleSubmit = async () => {
    if (!file) return

    if (!invoiceNo?.trim()) {
      toast.warning("Please provide invoice number")
      return
    }

    if (!invoiceDate) {
      toast.warning("Please select invoice date")
      return
    }

    setLoading(true)
    try {
      const savedFile = await saveInvoiceFile(invoiceId, invoiceNo.trim(), file, referenceNumber, invoiceDate)
      setUploadedFile(savedFile)
      setFile(null)
      setOpen(false)
      toast.success("File uploaded successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to upload file")
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


  console.log("::::::", initialInvoiceDate)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" /> {uploadedFile?.fileUrl ? "Replace Invoice" : "Upload Invoice"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Invoice File</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Invoice Number <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={invoiceNo ?? ""}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Enter invoice number"
            />
          </div>

          <div className="space-y-2">
            <Label>Invoice Date <span className="text-red-500">*</span></Label>
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

          {!(uploadedFile?.fileUrl && !file) && (
            <>
              <Label>Invoice File (PDF or Image, max 10MB)</Label>
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
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-5 h-5" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}

          {/* Existing uploaded file */}
          {uploadedFile?.fileUrl && !file && (
            <div className="flex items-center justify-between border p-4 rounded-lg">
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

          {/* Submit button */}
          {file && (
            <Button className="w-full" onClick={handleSubmit} disabled={loading || !invoiceDate}>
              {loading ? "Uploading..." : "Upload Invoice"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}