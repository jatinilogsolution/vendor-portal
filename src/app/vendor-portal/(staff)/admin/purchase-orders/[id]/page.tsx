// src/app/vendor-portal/(admin)/admin/purchase-orders/[id]/page.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft, IconPencil, IconSend,
    IconCheck, IconX, IconTrash,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { Badge } from "@/components/ui/badge"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpPoStatusStepper } from "@/components/ui/vp-po-status-stepper"
import {
    getVpPurchaseOrderById, submitVpPurchaseOrder,
    approveVpPurchaseOrder, rejectVpPurchaseOrder,
    sendVpPoToVendor, acknowledgeVpPo,
    deleteVpPurchaseOrder, VpPoDetail,
} from "@/actions/vp/purchase-order.action"
import { useSession } from "@/lib/auth-client"
import { VpPdfButton } from "@/components/ui/vp-pdf-button"
import { getVpPoPdfData } from "@/actions/vp/pdf.action"


export default function PurchaseOrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const role = session?.user?.role ?? ""
    const id = params.id as string

    const [po, setPo] = useState<VpPoDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const [rejectOpen, setRejectOpen] = useState(false)
    const [rejectReason, setReason] = useState("")
    const [deleteOpen, setDeleteOpen] = useState(false)

    const load = async () => {
        setLoading(true)
        const res = await getVpPurchaseOrderById(id)
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setPo(res.data)
        setLoading(false)
    }

    const handlePdf = async () => {
        if (!po) return
        const res = await getVpPoPdfData(po.id)
        if (!res.success) { toast.error(res.error); return }
        const { generatePoPdf } = await import("@/lib/vp-pdf")
        const doc = generatePoPdf(res.data)
        doc.save(`PO-${po.poNumber}.pdf`)
    }
    useEffect(() => { load() }, [id])

    const act = (fn: () => Promise<any>) =>
        startTransition(async () => {
            const res = await fn()
            if (!res.success) { toast.error(res.error); return }
            toast.success("Done")
            load()
        })

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
    if (!po) return <p className="text-center text-muted-foreground py-20">Purchase order not found.</p>

    const canEdit = role === "ADMIN" && po.status === "DRAFT"
    const canSubmit = role === "ADMIN" && po.status === "DRAFT"
    const canApprove = (role === "ADMIN" || role === "BOSS") && po.status === "SUBMITTED"
    const canReject = (role === "ADMIN" || role === "BOSS") && po.status === "SUBMITTED"
    const canSend = role === "ADMIN" && po.status === "APPROVED"
    const canAck = role === "VENDOR" && po.status === "SENT_TO_VENDOR"
    const canDelete = role === "ADMIN" && po.status === "DRAFT"

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={po.poNumber}
                description={`${po.vendor.vendorName} · Created by ${po.createdBy.name}`}
                actions={
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/admin/purchase-orders">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back
                            </Link>
                        </Button>
                        <VpPdfButton
                            filename={`PO-${po?.poNumber}.pdf`}
                            onGenerate={handlePdf}
                        />
                        {canEdit && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-portal/admin/purchase-orders/${id}/edit`}>
                                    <IconPencil size={14} className="mr-1.5" />
                                    Edit
                                </Link>
                            </Button>
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
                            <Button size="sm" onClick={() => act(() => submitVpPurchaseOrder(id))}>
                                <IconSend size={14} className="mr-1.5" />
                                Submit for Approval
                            </Button>
                        )}
                        {canApprove && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => act(() => approveVpPurchaseOrder(id))}
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
                        {canSend && (
                            <Button size="sm" onClick={() => act(() => sendVpPoToVendor(id))} disabled={isPending}>
                                <IconSend size={14} className="mr-1.5" />
                                Send to Vendor
                            </Button>
                        )}
                        {canAck && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => act(() => acknowledgeVpPo(id))}
                                disabled={isPending}
                            >
                                <IconCheck size={14} className="mr-1.5" />
                                Acknowledge
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Status stepper */}
            <div className="overflow-x-auto rounded-md border bg-muted/20 px-4 py-4">
                <VpPoStatusStepper status={po.status} />
                {po.status === "REJECTED" && po.rejectionReason && (
                    <p className="mt-3 text-sm text-destructive">
                        <span className="font-medium">Rejection reason: </span>
                        {po.rejectionReason}
                    </p>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: meta */}
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status">    <VpStatusBadge status={po.status} /></Row>
                            <Row label="Vendor">    {po.vendor.vendorName}</Row>
                            <Row label="Company">   {po.companyName ?? "—"}</Row>
                            <Row label="Categories">
                                {po.categoryNames.length > 0 ? po.categoryNames.join(", ") : "—"}
                            </Row>
                            {po.deliveryStatus && (
                                <Row label="Delivery Status">
                                    <VpStatusBadge status={po.deliveryStatus} />
                                </Row>
                            )}
                            <Row label="Created by">{po.createdBy.name}</Row>
                            {po.approvedBy && <Row label="Approved by">{po.approvedBy.name}</Row>}
                            {po.deliveryDate && (
                                <Row label="Delivery">
                                    {new Date(po.deliveryDate).toLocaleDateString("en-IN")}
                                </Row>
                            )}
                            {po.deliveryAddress && <Row label="Address">{po.deliveryAddress}</Row>}
                            {po.billTo && <Row label="Bill To">{po.billTo}</Row>}
                            {po.billToGstin && <Row label="Bill To GSTIN">{po.billToGstin}</Row>}
                            {po.notes && <><Separator /><p className="text-xs text-muted-foreground">{po.notes}</p></>}
                        </CardContent>
                    </Card>

                    {/* Totals */}
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Financials</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <Row label="Subtotal">   ₹{po.subtotal.toLocaleString("en-IN")}</Row>
                            <Row label={`GST (${po.taxRate}%)`}>₹{po.taxAmount.toLocaleString("en-IN")}</Row>
                            <Separator />
                            <div className="flex justify-between text-base font-bold">
                                <span>Grand Total</span>
                                <span>₹{po.grandTotal.toLocaleString("en-IN")}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoices & Payments */}
                    {po.invoices.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    Linked Invoices
                                    <Badge variant="outline" className="text-[10px]">{po.invoices.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {po.invoices.map((inv) => (
                                    <div key={inv.id} className="space-y-2 border-b last:border-0 pb-3 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/vendor-portal/admin/invoices/${inv.id}`}
                                                className="font-mono text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                            >
                                                # {inv.invoiceNumber || "DRAFT"}
                                            </Link>
                                            <VpStatusBadge status={inv.status} />
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span>Amount:</span>
                                            <span>₹{inv.totalAmount.toLocaleString("en-IN")}</span>
                                        </div>

                                        {inv.payments.length > 0 && (
                                            <div className="mt-2 space-y-1.5 rounded-md bg-muted/30 p-2">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payments</p>
                                                {inv.payments.map((p) => (
                                                    <div key={p.id} className="flex flex-col gap-1 border-t border-muted-foreground/10 pt-1.5 first:border-0 first:pt-0">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-emerald-700">₹{p.amount.toLocaleString("en-IN")}</span>
                                                            <Badge variant="outline" className="text-[10px] lowercase">{p.status}</Badge>
                                                        </div>
                                                        {p.notes && (
                                                            <p className="text-[10px] text-muted-foreground">{p.notes}</p>
                                                        )}
                                                        {p.proofUrl && (
                                                            <a
                                                                href={p.proofUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[10px] text-emerald-600 hover:underline"
                                                            >
                                                                <IconCheck size={10} /> View Proof
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {po.deliveries.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    Deliveries
                                    <Badge variant="outline" className="text-[10px]">{po.deliveries.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {po.deliveries.map((delivery) => (
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
                                            <span className="text-muted-foreground">Date</span>
                                            <span className="text-right">
                                                {delivery.deliveryDate
                                                    ? new Date(delivery.deliveryDate).toLocaleDateString("en-IN")
                                                    : "—"}
                                            </span>
                                            <span className="text-muted-foreground">Items</span>
                                            <span className="text-right">{delivery._count.items}</span>
                                            <span className="text-muted-foreground">Dispatched By</span>
                                            <span className="text-right">{delivery.dispatchedBy ?? "—"}</span>
                                            <span className="text-muted-foreground">Received By</span>
                                            <span className="text-right">{delivery.receivedBy ?? "—"}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: line items */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Line Items ({po.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Description</th>
                                        <th className="px-4 py-2 text-right font-medium">Qty</th>
                                        <th className="px-4 py-2 text-right font-medium">Unit Price</th>
                                        <th className="px-4 py-2 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {po.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2.5">
                                                <p className="font-medium">{item.description}</p>
                                                {(item.itemCode || item.itemId) && (
                                                    <p className="text-xs text-muted-foreground font-mono">
                                                        {[item.itemCode, item.itemId].filter(Boolean).join(" · ")}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">{item.qty}</td>
                                            <td className="px-4 py-2.5 text-right">₹{item.unitPrice.toLocaleString("en-IN")}</td>
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
                        <DialogTitle>Reject Purchase Order</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        placeholder="Reason for rejection (required)…"
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <DialogFooter className="gap-2">
                        <Button variant="secondary" onClick={() => setRejectOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            disabled={!rejectReason.trim() || isPending}
                            onClick={() => act(async () => {
                                const r = await rejectVpPurchaseOrder(id, rejectReason)
                                setRejectOpen(false)
                                setReason("")
                                return r
                            })}
                        >
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete dialog */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {po.poNumber}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is permanent and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                            onClick={() => act(async () => {
                                const r = await deleteVpPurchaseOrder(id)
                                if (r.success) router.push("/vendor-portal/admin/purchase-orders")
                                return r
                            })}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
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
