"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Upload, Eye, Replace } from "lucide-react"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { deleteAttachmentFromAzure, uploadAttachmentToAzure } from "@/services/azure-blob"
import { uploadPodForLr } from "../_action/pod"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { useSession } from "@/lib/auth-client"
import { UserRoleEnum } from "@/utils/constant"

type UploadPodProps = {
  LrNumber: string
  initialFileUrl: string | null
  customer: string
  vendor: string;
  fileNumber: string
  whId: string
  readOnly?: boolean
}

export function UploadPod({ LrNumber, customer, vendor, initialFileUrl, fileNumber, readOnly = false }: UploadPodProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(initialFileUrl)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const session = useSession()
  const fileName = `pod/${customer}/${LrNumber}-${vendor}`

  const handleDrop = (files: File[]) => {
    setLoading(true)

    setFile(files[0] || null)
    setLoading(false)

  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)

    if (!file) {
      toast.error("Please select a file before uploading")
      return
    }

    formData.append("file", file)

    try {
      if (fileUrl) await deleteAttachmentFromAzure(fileUrl)

      const url = await uploadAttachmentToAzure(fileName, formData)
      setFileUrl(url)



      const { error } = await uploadPodForLr({
        lrNumber: LrNumber,
        fileNumber: fileNumber,
        podLink: url,
      })

      if (error) toast.error(error)
      else {
        toast.success("POD uploaded successfully")
        setOpenDialog(false)
        setFile(null)
      }
    } catch (err) {
      console.error(err)
      toast.error("Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    // Read-only mode: just view the POD
    if (readOnly) {
      if (fileUrl) window.open(fileUrl, "_blank")
      return
    }
    if (fileUrl) setShowAlert(true)
    else setOpenDialog(true)
  }

  const handleView = () => {
    if (fileUrl) window.open(fileUrl, "_blank")
    setShowAlert(false)
  }

  const handleReplace = () => {
    setShowAlert(false)
    setOpenDialog(true)
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant={fileUrl ? "link" : "ghost"}
        size="sm"
        onClick={handleButtonClick}
        className="gap-2 text-sm font-mono  "
      >
        {readOnly ? (
          fileUrl ? <><Eye size={12} /> View</> : <span className="text-muted-foreground">No POD</span>
        ) : (
          <><Upload size={12} /> {fileUrl ? "Replace" : "Upload"}</>
        )}
      </Button>

      {/* View / Replace Alert */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>POD File Found</AlertDialogTitle>
            <AlertDialogDescription>
              A POD file is already uploaded for <strong>LR #{LrNumber}</strong>.
              What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleView} className="gap-1 ">
              <Eye size={16} /> View
            </AlertDialogAction>
            {session.data?.user.role === UserRoleEnum.TVENDOR && <AlertDialogAction
              onClick={handleReplace}
              className="gap-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Replace size={16} /> Replace
            </AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Upload POD</DialogTitle>
            <DialogDescription>
              LR Number: <span className="font-semibold">{LrNumber}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={async (e) => {
            e.preventDefault() // prevent full form reload
            const formData = new FormData(e.currentTarget)
            await handleSubmit(formData)
          }} className="grid gap-5 mt-2">
            <div className="grid gap-2">
              <Label>File</Label>
              <Dropzone
                accept={{
                  "image/*": [],
                  "application/pdf": [],
                }}
                maxFiles={1}
                maxSize={20 * 1024 * 1024} // 10 MB
                onDrop={handleDrop}
                onError={(err) => toast.error(err.message)}
                src={file ? [file] : undefined}
                className="border-dashed border-2 border-gray-300 p-6 rounded-md text-center bg-muted/10"
              >
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setOpenDialog(false)
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={loading || !file}>
                {loading ? <Spinner className="scale-90" /> : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}


// BLR020018162 ///


// BLR010020171
// BLR010020168
// BLR010020166

// BLR020018170 ///
// BLR090016601