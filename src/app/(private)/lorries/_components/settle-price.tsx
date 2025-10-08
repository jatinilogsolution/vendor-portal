"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Plus, Eye } from 'lucide-react'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { addQuotationCostWithAttachment } from '../_action/pod'
import { deleteAttachmentFromAzure, uploadAttachmentToAzure } from '@/services/azure-blob'

interface SettlePriceProps {
    settlePrice?: string
    fileNumber: string
    vehicle: string
    extraCost?: string
    vendor: string
}

export const SettlePrice = ({ settlePrice, fileNumber, vehicle, extraCost: extraCostProp, vendor }: SettlePriceProps) => {
    const [settle, setSettle] = useState<string | undefined>(settlePrice)
    const [extraCost, setExtraCost] = useState<string | undefined>(extraCostProp)
    const [description, setDescription] = useState<string>("")
    const [file, setFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingFile, setLoadingFile] = useState(false)
    const [open, setOpen] = useState(false) // ✅ Dialog control

    const handleDrop = (files: File[]) => setFile(files[0] || null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // ✅ Attachment is required only if extra cost is entered
        if (extraCost && !file && !fileUrl) {
            toast.error("Attachment is required if extra cost is entered")
            return
        }

        if (settle && (isNaN(Number(settle)) || Number(settle) <= 0)) {
            toast.error("Please enter a valid settle cost")
            return
        }

        if (extraCost && isNaN(Number(extraCost))) {
            toast.error("Extra cost must be a valid number")
            return
        }

        setIsSubmitting(true)

        try {
            let attachmentUrl: string | undefined

            // Upload file if present
            if (file) {
                setLoadingFile(true)
                const formData = new FormData()
                formData.append("file", file)
                const fileName = `invoice//${fileNumber}/extra-${file.name}`

                // const fileName = `documents/${fileNumber}-${file.name}`

                if (fileUrl) await deleteAttachmentFromAzure(fileUrl)
                attachmentUrl = await uploadAttachmentToAzure(fileName, formData)
                setFileUrl(attachmentUrl)
                setLoadingFile(false)
            }

            const { error, message } = await addQuotationCostWithAttachment({
                fileNumber,
                settleCost: settle || "0",
                extraCost,
                attachmentUrl,
                descriptionForAttachment: description,
            })

            if (error) {
                toast.error(error)
            } else {
                toast.success(message)
                // ✅ Reset form
                setFile(null)
                setDescription("")
                setExtraCost(undefined)
                setSettle(undefined)
                setFileUrl(null)
                // ✅ Close dialog after success
                setOpen(false)
            }

        } catch (err) {
            console.error(err)
            toast.error("Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Plus /> Quotation Cost</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Cost for Vehicle: {vehicle}</DialogTitle>
                    <DialogDescription>
                        **Attachment is required only if extra cost is entered.**
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    {/* Settle Cost */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="settle" className="text-right">Cost</Label>
                        <Input
                            id="settle"
                            type="number"
                            value={settle ?? ""}
                            onChange={(e) => setSettle(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter settle cost"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Extra Cost */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="extraCost" className="text-right">Extra Cost</Label>
                        <Input
                            id="extraCost"
                            type="number"
                            value={extraCost ?? ""}
                            onChange={(e) => setExtraCost(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional extra cost"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Attachment */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right mt-2">Attachment</Label>
                        <div className="col-span-3 flex flex-col gap-2">
                            {fileUrl && !file ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(fileUrl!, "_blank")}
                                        className="flex-1"
                                    >
                                        <Eye size={16} className="mr-2" />
                                        View Document
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setFileUrl(null)}
                                        disabled={loadingFile}
                                    >
                                        Replace
                                    </Button>
                                </div>
                            ) : (
                                <Dropzone
                                    accept={{ "image/*": [], "application/pdf": [] }}
                                    maxFiles={1}
                                    maxSize={1024 * 1024 * 10} // 10MB
                                    onDrop={handleDrop}
                                    onError={console.error}
                                    src={file ? [file] : undefined}
                                    className="border-dashed border-2 border-gray-300 p-4 rounded"
                                >
                                    <DropzoneEmptyState />
                                    <DropzoneContent />
                                </Dropzone>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right mt-2">Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional description for attachment"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Submit */}
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting || loadingFile}
                        >
                            {isSubmitting || loadingFile ? <Spinner /> : 'Confirm Cost'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
