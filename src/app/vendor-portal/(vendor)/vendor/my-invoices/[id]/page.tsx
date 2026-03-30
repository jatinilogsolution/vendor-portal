// src/app/vendor-portal/(vendor)/vendor/my-invoices/[id]/page.tsx
"use client"

import { useEffect, useState, useTransition, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft, IconSend, IconTrash,
    IconPencil, IconUpload, IconFile,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpInvoiceStatusStepper } from "@/components/ui/vp-invoice-status-stepper"
import { VpActivityTimeline } from "@/components/ui/vp-activity-timeline"
import {
    getVpInvoiceById, submitVpInvoice,
    deleteVpInvoice, addVpInvoiceDocument, VpInvoiceDetail,
} from "@/actions/vp/invoice.action"
import { uploadAttachmentToAzure } from "@/services/azure-blob"

export default function VendorInvoiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [inv, setInv] = useState<VpInvoiceDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const load = async () => {
        setLoading(true)
        const res = await getVpInvoiceById(id)
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setInv(res.data)
        setLoading(false)
    }

    useEffect(() => { load() }, [id])

    const act = (fn: () => Promise<any>, msg?: string) =>
        startTransition(async () => {
            const res = await fn()
            if (!res.success) { toast.error(res.error); return }
            toast.success(msg ?? "Done")
            load()
        })

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !inv) return
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)
            const path = `vp/invoices/${inv.vendor.id}/${id}/${Date.now()}_${file.name}`
            const url = await uploadAttachmentToAzure(path, formData)
            const res = await addVpInvoiceDocument(id, url)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Document uploaded")
            load()
        } catch {
            toast.error("Upload failed")
        } finally {
            setUploading(false)
            if (fileRef.current) fileRef.current.value = ""
        }
    }

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
    if (!inv) return <p className="py-20 text-center text-muted-foreground">Invoice not found.</p>

    const canEdit = inv.status === "DRAFT"
    const canSubmit = inv.status === "DRAFT"
    const canDelete = inv.status === "DRAFT"
    const canUpload = ["DRAFT", "SUBMITTED"].includes(inv.status)

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={inv.invoiceNumber ?? "Invoice"}
                description={`${inv.vendor.vendorName} · ${new Date(inv.createdAt).toLocaleDateString("en-IN")}`}
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/vendor/my-invoices">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back
                            </Link>
                        </Button>
                        {canEdit && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-portal/vendor/my-invoices/${id}/edit`}>
                                    <IconPencil size={14} className="mr-1.5" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                        {canUpload && (
                            <>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    variant="outline" size="sm"
                                    onClick={() => fileRef.current?.click()}
                                    disabled={uploading}
                                >
                                    <IconUpload size={14} className="mr-1.5" />
                                    {uploading ? "Uploading…" : "Attach File"}
                                </Button>
                            </>
                        )}
                        {canDelete && (
                            <Button
                                variant="outline" size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleteOpen(true)}
                            >
                                <IconTrash size={14} className="mr-1.5" />
                                Delete
                            </Button>
                        )}
                        {canSubmit && (
                            <Button
                                size="sm"
                                onClick={() => act(() => submitVpInvoice(id), "Invoice submitted successfully")}
                                disabled={isPending}
                            >
                                <IconSend size={14} className="mr-1.5" />
                                Submit Invoice
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Stepper */}
            <div className="overflow-x-auto rounded-md border bg-muted/20 px-4 py-4">
                <VpInvoiceStatusStepper status={inv.status} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: meta */}
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status">    <VpStatusBadge status={inv.status} /></Row>
                            <Row label="Company">   {inv.companyName ?? "—"}</Row>
                            <Row label="Type">      <Badge variant="secondary" className="text-xs">{inv.type}</Badge></Row>
                            {inv.poNumber && <Row label="PO Ref">
                                <Link href={`/vendor-portal/vendor/my-pos`}
                                    className="font-mono text-xs text-primary hover:underline">
                                    {inv.poNumber}
                                </Link>
                            </Row>}
                            {inv.piNumber && <Row label="PI Ref">
                                <span className="font-mono text-xs">{inv.piNumber}</span>
                            </Row>}
                            {inv.notes && <><Separator /><p className="text-xs text-muted-foreground">{inv.notes}</p></>}
                            {inv.timeline.length > 0 && (
                                <>
                                    <Separator />
                                    <VpActivityTimeline events={inv.timeline} />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Financials</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <Row label="Subtotal">₹{inv.subtotal.toLocaleString("en-IN")}</Row>
                            <Row label={`GST (${inv.taxRate}%)`}>₹{inv.taxAmount.toLocaleString("en-IN")}</Row>
                            <Separator />
                            <div className="flex justify-between text-base font-bold">
                                <span>Total</span>
                                <span>₹{inv.totalAmount.toLocaleString("en-IN")}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payments */}
                    {inv.payments.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm">Payments</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {inv.payments.map((p) => (
                                    <div key={p.id} className="space-y-2 border-b last:border-0 pb-3 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-emerald-700">₹{p.amount.toLocaleString("en-IN")}</p>
                                            <VpStatusBadge status={p.status} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                            <div className="text-muted-foreground">Mode:</div>
                                            <div className="font-medium">{p.paymentMode || "—"}</div>
                                            <div className="text-muted-foreground">Ref No:</div>
                                            <div className="font-mono">{p.transactionRef || "—"}</div>
                                            <div className="text-muted-foreground">Boss Note:</div>
                                            <div>{p.notes || "—"}</div>
                                            <div className="text-muted-foreground">Date:</div>
                                            <div>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : "—"}</div>
                                        </div>
                                        {p.proofUrl && (
                                            <a
                                                href={p.proofUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 mt-2 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100 transition-colors"
                                            >
                                                <IconFile size={13} />
                                                <span className="truncate">View Payment Proof</span>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Documents */}
                    {inv.documents.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm">Attachments</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {inv.documents.map((doc) => (

                                    <a key={doc.id}
                                        href={doc.filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
                                    >
                                        <IconFile size={14} className="text-muted-foreground" />
                                        <span className="truncate flex-1 text-xs">
                                            {doc.filePath.split("/").pop()}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground shrink-0">
                                            {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                                        </span>
                                    </a>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: line items */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Line Items ({inv.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Description</th>
                                        <th className="px-4 py-2 text-right font-medium">Qty</th>
                                        <th className="px-4 py-2 text-right font-medium">Unit Price</th>
                                        <th className="px-4 py-2 text-right font-medium">Tax %</th>
                                        <th className="px-4 py-2 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {inv.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2.5 font-medium">{item.description}</td>
                                            <td className="px-4 py-2.5 text-right">{item.qty}</td>
                                            <td className="px-4 py-2.5 text-right">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                                            <td className="px-4 py-2.5 text-right">{item.tax}%</td>
                                            <td className="px-4 py-2.5 text-right font-semibold">
                                                ₹{item.total.toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                            onClick={() => act(async () => {
                                const r = await deleteVpInvoice(id)
                                if (r.success) router.push("/vendor-portal/vendor/my-invoices")
                                return r
                            }, "Invoice deleted")}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-2">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="text-right">{children}</span>
        </div>
    )
}
