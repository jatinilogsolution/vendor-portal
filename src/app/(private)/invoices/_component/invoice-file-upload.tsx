// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Trash, Upload, FileText } from "lucide-react"
// import { toast } from "sonner"
// import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
// import { deleteInvoiceFile, saveInvoiceFile } from "../_action/invoice-update"
 
// interface InvoiceFileUploadProps {
//   invoiceId: string
//   initialFile?: { id: string; fileUrl: string; name: string }
// }

// export const InvoiceFileUploadSingle = ({ invoiceId, initialFile }: InvoiceFileUploadProps) => {
//   const [open, setOpen] = useState(false)
//   const [file, setFile] = useState<File | null>(null)
//   const [uploadedFile, setUploadedFile] = useState(initialFile || null)
//   const [loading, setLoading] = useState(false)

//   const handleDrop = (files: File[]) => {
//     if (files.length === 0) return
//     setFile(files[0])
//   }

//   const handleSubmit = async () => {
//     if (!file) return
//     setLoading(true)
//     try {
//       const savedFile = await saveInvoiceFile(invoiceId, file)
//       setUploadedFile(savedFile)
//       setFile(null)
//       setOpen(false)
//       toast.success("File uploaded successfully")
//     } catch (err) {
//       console.error(err)
//       toast.error("Failed to upload file")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!uploadedFile) return
//     setLoading(true)
//     try {
//       await deleteInvoiceFile(invoiceId, uploadedFile.fileUrl)
//       setUploadedFile(null)
//       setFile(null)
//       toast.success("File deleted successfully")
//     } catch (err) {
//       console.error(err)
//       toast.error("Failed to delete file")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Upload className="w-4 h-4 mr-2" /> {uploadedFile ? "Replace File" : "Upload File"}
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Manage Invoice File</DialogTitle>
//         </DialogHeader>

//         {/* ShadCN Dropzone */}
//         <Dropzone
//           accept={{ "image/*": [], "application/pdf": [] }}
//           maxFiles={1}
//           maxSize={1024 * 1024 * 10} // 10MB
//           onDrop={handleDrop}
//           onError={() => toast.error("File must be less than 10MB")}
//           src={file ? [file] : undefined}
//           className="border-dashed border-2 border-gray-300 p-4 rounded mb-4"
//         >
//           <DropzoneEmptyState />
//           <DropzoneContent />
//         </Dropzone>

//         {/* File preview */}
//         {file && (
//           <div className="flex items-center gap-2 mb-4">
//             <FileText className="w-5 h-5" />
//             <span>{file.name}</span>
//           </div>
//         )}

//         {uploadedFile && !file && (
//           <div className="flex items-center justify-between border p-2 rounded shadow-sm mb-4">
//             <div className="flex items-center gap-2">
//               <FileText className="w-5 h-5" />
//               <a href={uploadedFile.fileUrl} target="_blank" rel="noopener noreferrer" className="underline">
//                 {uploadedFile.name}
//               </a>
//             </div>
//             <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
//               <Trash className="w-4 h-4" /> Delete
//             </Button>
//           </div>
//         )}

//         {/* Submit Button */}
//         {file && (
//           <Button className="mt-2" onClick={handleSubmit} disabled={loading}>
//             {loading ? "Uploading..." : "Submit"}
//           </Button>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import { useState } from "react"
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
}

export const InvoiceFileUploadSingle = ({
  invoiceId,
  initialFile,
  invoiceNumber,
  referenceNumber,
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

    setLoading(true)
    try {
      const savedFile = await saveInvoiceFile(invoiceId, invoiceNo.trim(), file, referenceNumber)
      setUploadedFile(savedFile)
      setFile(null)
      setOpen(false)
      toast.success("File uploaded successfully")
    } catch (err: any) {
      console.error(err)
      // Show backend error message if available
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

        <div className="space-y-2 mb-4">
          <Label>Invoice Number</Label>
          <Input
            type="text"
            value={invoiceNo ?? ""}   //
            onChange={(e) => setInvoiceNo(e.target.value)}
            placeholder="Enter invoice number"
          />
        </div>

        <Label>Invoice File</Label>
        <Dropzone
          accept={{ "image/*": [], "application/pdf": [] }}
          maxFiles={1}
          maxSize={1024 * 1024 * 10} // 10MB
          onDrop={handleDrop}
          onError={() => toast.error("File must be less than 10MB")}
          src={file ? [file] : undefined}
          className="border-dashed border-2 border-gray-300 p-4 rounded mb-4"
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>

        {/* File preview */}
        {file && (
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            <span>{file.name}</span>
          </div>
        )}

        {uploadedFile?.fileUrl && !file && (
          <div className="flex items-center justify-between border p-2 rounded shadow-sm mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <a
                href={uploadedFile.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {uploadedFile.name}
              </a>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
              <Trash className="w-4 h-4" /> Delete
            </Button>
          </div>
        )}

        {/* Submit Button */}
        {file && (
          <Button className="mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Submit"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
