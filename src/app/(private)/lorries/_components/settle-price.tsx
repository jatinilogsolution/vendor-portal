"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useTransition } from 'react'
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
import { Plus, Eye, Link, ViewIcon, EyeIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { Skeleton } from "@/components/ui/skeleton"
import { addQuotationCostWithAttachment, getExtraCostDocumentByFileNumber } from '../_action/pod'
import { deleteAttachmentFromAzure, uploadAttachmentToAzure } from '@/services/azure-blob'

interface SettlePriceProps {
    settlePrice?: string | number
    fileNumber: string
    vehicle: string
    extraCost?: string | number | null
    label?: string
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
    mode?: "edit" | "view" // default is edit
    costView?: boolean
    disbleCost?: boolean
}

export const SettlePrice = ({
    settlePrice,
    fileNumber,
    vehicle,
    extraCost: extraCostProp,
    label,
    size = "default",
    mode = "edit",
    costView = true,
    disbleCost = false
}: SettlePriceProps) => {
    const [settle, setSettle] = useState<string | undefined>(
        settlePrice?.toString().replace(/,/g, "")
    ); const [extraCost, setExtraCost] = useState<string | undefined>(extraCostProp?.toString())
    const [description, setDescription] = useState<string>("")
    const [file, setFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingFile, setLoadingFile] = useState(false)
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDrop = (files: File[]) => setFile(files[0] || null)

    // fetch existing attachment info
    useEffect(() => {
        if (!open) return
        if (Number(extraCost) <= 0 || !extraCost?.toString().trim()) return
        startTransition(async () => {
            try {
                const { data } = await getExtraCostDocumentByFileNumber(fileNumber)
                setDescription(data?.description || "")
                setFileUrl(data?.url || "")
            } catch (err) {
                console.error(err)
                toast.error("Failed to load attachment info")
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, fileNumber])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

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

            if (file) {
                setLoadingFile(true)
                const formData = new FormData()
                formData.append("file", file)
                const fileName = `pod/${fileNumber}/extra-${file.name}`
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
                setFile(null)
                setDescription("")
                setExtraCost(undefined)
                setSettle(undefined)
                setFileUrl(null)
                setOpen(false)
                window.location.reload() // refresh parent page
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
                <Button className=' w-full max-w-32 min-w-24 ' variant={Number(extraCost!) > 0 ? `${costView ? "ghost" : "outline"}` : "outline"} size={size}>
                    {
                        Number(extraCost!) > 0 ? <span className=' text-green-500 flex items-center justify-center gap-2'> {costView ? `₹ ${extraCost}` : "View"}  <EyeIcon className='text-primary' /></span> : label
                    }
                </Button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Cost for Vehicle: {vehicle}</DialogTitle>
                    <DialogDescription>
                        {mode === "edit"
                            ? "Attachment is required only if extra cost is entered."
                            : ""}
                    </DialogDescription>
                </DialogHeader>

                {isPending ? (
                    <div className="space-y-4 py-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-24 w-full rounded-md" />
                        <Skeleton className="h-10 w-32 rounded-md mx-auto" />
                    </div>
                ) : mode === "view" ? (
                    // ------------------ VIEW ONLY ------------------
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between">
                            <Label>Vendor Cost:</Label>
                            <span>₹ {settle ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <Label>Extra Cost:</Label>
                            <span>₹ {extraCost ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <Label>Remark:</Label>
                            <span className=' line-clamp-4'>{description || "No Remark"}</span>
                        </div>
                        {fileUrl && (
                            <div className="flex justify-between items-center">
                                <Label>Attachment:</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(fileUrl, "_blank")}
                                >
                                    <Eye size={16} className="mr-2" /> View
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    // ------------------ EDIT MODE ------------------
                    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                        {/* Settle Cost */}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="settle" className="text-right">Cost</Label>
                            <Input
                                id="settle"
                                type="number"

                                value={settle ?? ""}     // <<< FIXED
                                onChange={(e) => setSettle(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter settle cost"
                                disabled={isSubmitting || disbleCost}
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
                                        maxSize={1024 * 1024 * 20}
                                        onDrop={handleDrop}
                                        onError={() => toast.error(`File must be less than 20MB`)}
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

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting || loadingFile}>
                                {isSubmitting || loadingFile ? <Spinner /> : 'Confirm Cost'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
