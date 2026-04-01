// src/app/vendor-portal/(boss)/boss/approvals/invoice/[id]/page.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft, IconCheck, IconX,
    IconDownload, IconFile,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

import {
    getVpInvoiceById,
    approveVpInvoice,
    rejectVpInvoice,
    VpInvoiceDetail,
} from "@/actions/vp/invoice.action"
import { getVpInvoicePdfData } from "@/actions/vp/pdf.action"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpPdfButton } from "@/components/ui/vp-pdf-button"
import { VpInvoiceStatusStepper } from "@/components/ui/vp-invoice-status-stepper"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpActivityTimeline } from "@/components/ui/vp-activity-timeline"
import { VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"

export default function BossInvoiceApprovalPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [inv, setInv] = useState<VpInvoiceDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [rejectOpen, setRejectOpen] = useState(false)
    const [rejectReason, setReason] = useState("")

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

    const handlePdf = async () => {
        const res = await getVpInvoicePdfData(id)
        if (!res.success) { toast.error(res.error); return }
        const { generateInvoicePdf } = await import("@/lib/vp-pdf")
        const doc = generateInvoicePdf(res.data)
        doc.save(`Invoice-${inv?.invoiceNumber ?? id}.pdf`)
    }

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
    if (!inv) return (
        <p className="py-20 text-center text-muted-foreground">Invoice not found.</p>
    )

    const canApprove = inv.status === "UNDER_REVIEW"
    const canReject = inv.status === "UNDER_REVIEW" || inv.status === "SUBMITTED"
    const recurringLabel = inv.recurringCycle
        ? VP_RECURRING_CYCLE_LABELS[inv.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS] || inv.recurringCycle
        : null

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={inv.invoiceNumber ?? "Invoice"}
                description={`${inv.vendor.vendorName} · Submitted ${inv.submittedAt
                    ? new Date(inv.submittedAt).toLocaleDateString("en-IN")
                    : "—"
                    }`}
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/boss/approvals">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back to Queue
                            </Link>
                        </Button>

                        {/* PDF download */}
                        <VpPdfButton
                            filename={`Invoice-${inv.invoiceNumber}.pdf`}
                            onGenerate={handlePdf}
                        />

                        {canApprove && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => act(() => approveVpInvoice(id), "Invoice approved")}
                                disabled={isPending}
                            >
                                <IconCheck size={14} className="mr-1.5" />
                                Approve
                            </Button>
                        )}
                        {canReject && (
                            <Button
                                size="sm" variant="destructive"
                                onClick={() => setRejectOpen(true)}
                            >
                                <IconX size={14} className="mr-1.5" />
                                Reject
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
                {/* Meta */}
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status">    <VpStatusBadge status={inv.status} /></Row>
                            <Row label="Vendor">    {inv.vendor.vendorName}</Row>
                            <Row label="Type">
                                <Badge variant="secondary" className="text-xs">{inv.type}</Badge>
                            </Row>
                            <Row label="Bill Type">
                                <div className="flex flex-wrap justify-end gap-1">
                                    <Badge variant="outline" className="text-xs">{inv.billType}</Badge>
                                    {recurringLabel && (
                                        <Badge variant="secondary" className="text-xs">{recurringLabel}</Badge>
                                    )}
                                </div>
                            </Row>
                            {inv.recurringTitle && <Row label="Recurring Schedule">{inv.recurringTitle}</Row>}
                            {inv.reviewedBy && (
                                <Row label="Reviewed by">{inv.reviewedBy.name}</Row>
                            )}
                            {inv.poNumber && (
                                <Row label="PO Ref">
                                    <Link
                                        href={`/vendor-portal/admin/purchase-orders/${inv.poId}`}
                                        className="font-mono text-xs text-primary hover:underline"
                                    >
                                        {inv.poNumber}
                                    </Link>
                                </Row>
                            )}
                            {inv.piNumber && (
                                <Row label="PI Ref">
                                    <Link
                                        href={`/vendor-portal/admin/proforma-invoices/${inv.piId}`}
                                        className="font-mono text-xs text-primary hover:underline"
                                    >
                                        {inv.piNumber}
                                    </Link>
                                </Row>
                            )}
                            {inv.notes && (
                                <>
                                    <Separator />
                                    <p className="text-xs text-muted-foreground">{inv.notes}</p>
                                </>
                            )}
                            {inv.timeline.length > 0 && (
                                <>
                                    <Separator />
                                    <VpActivityTimeline events={inv.timeline} />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Financials */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Financials</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <Row label="Subtotal">
                                ₹{inv.subtotal.toLocaleString("en-IN")}
                            </Row>
                            {inv.discountAmount > 0 && (
                                <Row label="Discount">
                                    - ₹{inv.discountAmount.toLocaleString("en-IN")}
                                </Row>
                            )}
                            <Row label={`GST (${inv.taxRate}%)`}>
                                ₹{inv.taxAmount.toLocaleString("en-IN")}
                            </Row>
                            <Separator />
                            <div className="flex justify-between text-base font-bold">
                                <span>Total</span>
                                <span>₹{inv.totalAmount.toLocaleString("en-IN")}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attachments */}
                    {inv.documents.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">
                                    Attachments ({inv.documents.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {inv.documents.map((doc) => (

                                    <a key={doc.id}
                                        href={doc.filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted transition-colors"
                                    >
                                        <IconFile size={14} className="shrink-0 text-muted-foreground" />
                                        <span className="truncate flex-1 text-xs">
                                            {doc.filePath.split("/").pop()}
                                        </span>
                                    </a>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Line items */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Line Items ({inv.items.length})
                        </CardTitle>
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
                                            <td className="px-4 py-2.5 text-right">
                                                ₹{item.unitPrice.toLocaleString("en-IN")}
                                            </td>
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

            {/* Reject dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Invoice</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        placeholder="Reason for rejection (required)…"
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <DialogFooter className="gap-2">
                        <Button variant="secondary" onClick={() => setRejectOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={!rejectReason.trim() || isPending}
                            onClick={() =>
                                act(async () => {
                                    const r = await rejectVpInvoice(id, rejectReason)
                                    setRejectOpen(false)
                                    setReason("")
                                    return r
                                }, "Invoice rejected")
                            }
                        >
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
