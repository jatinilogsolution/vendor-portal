// src/app/vendor-portal/(admin)/admin/invoices/[id]/page.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { IconArrowLeft, IconFile } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpInvoiceStatusStepper } from "@/components/ui/vp-invoice-status-stepper"
import { VpActivityTimeline } from "@/components/ui/vp-activity-timeline"
import { VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"
import {
    getVpInvoiceById, startVpInvoiceReview, approveVpInvoice, rejectVpInvoice, VpInvoiceDetail,
} from "@/actions/vp/invoice.action"
import { useSession } from "@/lib/auth-client"
import { IconCheck, IconX } from "@tabler/icons-react"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

export default function AdminInvoiceDetailPage() {
    const params = useParams()
    const { data: session } = useSession()
    const role = session?.user?.role ?? ""
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

    const handleStartReview = () =>
        startTransition(async () => {
            const res = await startVpInvoiceReview(id)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Moved to Under Review — forwarded to management for approval.")
            load()
        })

    const handleApprove = () =>
        startTransition(async () => {
            const res = await approveVpInvoice(id)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Invoice approved.")
            load()
        })

    const handleReject = () => {
        if (!rejectReason.trim()) return
        startTransition(async () => {
            const res = await rejectVpInvoice(id, rejectReason)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Invoice rejected.")
            setRejectOpen(false)
            setReason("")
            load()
        })
    }

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
    if (!inv) return <p className="py-20 text-center text-muted-foreground">Invoice not found.</p>

    const canReview = (role === "ADMIN" || role === "BOSS") && inv.status === "SUBMITTED"
    const canApprove = (role === "ADMIN" || role === "BOSS") && inv.status === "UNDER_REVIEW"
    const canReject = (role === "ADMIN" || role === "BOSS") && ["SUBMITTED", "UNDER_REVIEW"].includes(inv.status)
    const recurringLabel = inv.recurringCycle
        ? VP_RECURRING_CYCLE_LABELS[inv.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS] || inv.recurringCycle
        : null
    const taxableAmount = Math.max(0, inv.subtotal - inv.discountAmount)

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={inv.invoiceNumber ?? "Invoice"}
                description={`${inv.vendor.vendorName} · Submitted ${inv.submittedAt
                    ? new Date(inv.submittedAt).toLocaleDateString("en-IN")
                    : "—"}`}
                actions={
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/admin/invoices">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back
                            </Link>
                        </Button>
                        {canReview && (
                            <Button size="sm" onClick={handleStartReview} disabled={isPending}>
                                <IconCheck size={14} className="mr-1.5" />
                                Start Review
                            </Button>
                        )}
                        {canApprove && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={handleApprove}
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
                                disabled={isPending}
                            >
                                <IconX size={14} className="mr-1.5" />
                                Reject
                            </Button>
                        )}
                    </div>
                }
            />

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
                            onClick={handleReject}
                        >
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="overflow-x-auto rounded-md border bg-muted/20 px-4 py-4">
                <VpInvoiceStatusStepper status={inv.status} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status">    <VpStatusBadge status={inv.status} /></Row>
                            <Row label="Vendor">    {inv.vendor.vendorName}</Row>
                            <Row label="Company">   {inv.companyName ?? "—"}</Row>
                            <Row label="Type">      <Badge variant="secondary" className="text-xs">{inv.type}</Badge></Row>
                            <Row label="Bill Type">
                                <div className="flex flex-wrap justify-end gap-1">
                                    <Badge variant="outline" className="text-xs">{inv.billType}</Badge>
                                    {recurringLabel && (
                                        <Badge variant="secondary" className="text-xs">{recurringLabel}</Badge>
                                    )}
                                </div>
                            </Row>
                            {inv.recurringTitle && <Row label="Recurring Schedule">{inv.recurringTitle}</Row>}
                            {inv.parentInvoiceId && (
                                <Row label="Copied From">
                                    <Link
                                        href={`/vendor-portal/admin/invoices/${inv.parentInvoiceId}`}
                                        className="font-mono text-xs text-primary hover:underline"
                                    >
                                        {inv.parentInvoiceNumber ?? inv.parentInvoiceId}
                                    </Link>
                                </Row>
                            )}
                            {inv.deliveryStatus && (
                                <Row label="Delivery Status">
                                    <VpStatusBadge status={inv.deliveryStatus} />
                                </Row>
                            )}
                            {inv.reviewedBy && <Row label="Reviewed by">{inv.reviewedBy.name}</Row>}
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
                            {inv.discountAmount > 0 && (
                                <Row label="Discount">- ₹{inv.discountAmount.toLocaleString("en-IN")}</Row>
                            )}
                            <Row label="Taxable Amount">₹{taxableAmount.toLocaleString("en-IN")}</Row>
                            <Row label={`GST (${inv.taxRate}%)`}>₹{inv.taxAmount.toLocaleString("en-IN")}</Row>
                            <Separator />
                            <div className="flex justify-between text-base font-bold">
                                <span>Total</span>
                                <span>₹{inv.totalAmount.toLocaleString("en-IN")}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {inv.deliveries.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    Related Deliveries
                                    <Badge variant="outline" className="text-[10px]">{inv.deliveries.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {inv.deliveries.map((delivery) => (
                                    <div key={delivery.id} className="space-y-2 border-b last:border-0 pb-3 last:pb-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <Link
                                                href={`/vendor-portal/admin/deliveries/${delivery.id}`}
                                                className="font-mono text-xs font-semibold text-primary hover:underline"
                                            >
                                                {delivery.id}
                                            </Link>
                                            <VpStatusBadge status={delivery.status} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                            <span className="text-muted-foreground">PO</span>
                                            <span className="text-right font-mono">{delivery.poNumber}</span>
                                            <span className="text-muted-foreground">Date</span>
                                            <span className="text-right">
                                                {delivery.deliveryDate
                                                    ? new Date(delivery.deliveryDate).toLocaleDateString("en-IN")
                                                    : "—"}
                                            </span>
                                            <span className="text-muted-foreground">Items</span>
                                            <span className="text-right">{delivery.itemCount}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    
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

                    {inv.documents.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm">Attachments ({inv.documents.length})</CardTitle></CardHeader>
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
                                        {/* <th className="px-4 py-2 text-center font-medium">Discount Basis</th> */}
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
                                            {/* <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">
                                                {inv.discountAmount > 0 ? "Overall invoice" : "—"}
                                            </td> */}
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
