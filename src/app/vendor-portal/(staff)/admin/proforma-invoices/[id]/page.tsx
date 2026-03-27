"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft, IconPencil, IconSend,
    IconCheck, IconX, IconTrash,
    IconArrowRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpPiStatusStepper } from "@/components/ui/vp-pi-status-stepper"
import {
    getVpProformaInvoiceById,
    submitVpProformaInvoice, approveVpProformaInvoice,
    rejectVpProformaInvoice, sendVpPiToVendor,
    acceptVpProformaInvoice, declineVpProformaInvoice,
    convertPiToPo, deleteVpProformaInvoice, VpPiDetail,
} from "@/actions/vp/proforma-invoice.action"
import { useSession } from "@/lib/auth-client"
import { VP_BILLING_TYPE_LABELS } from "@/types/vendor-portal"

export default function ProformaInvoiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const role = session?.user?.role ?? ""
    const id = params.id as string

    const [pi, setPi] = useState<VpPiDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [rejectOpen, setRejectOpen] = useState(false)
    const [rejectReason, setReason] = useState("")
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [convertOpen, setConvertOpen] = useState(false)

    const load = async () => {
        setLoading(true)
        const res = await getVpProformaInvoiceById(id)
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setPi(res.data)
        setLoading(false)
    }

    useEffect(() => { load() }, [id])

    const act = (fn: () => Promise<any>, successMsg?: string) =>
        startTransition(async () => {
            const res = await fn()
            if (!res.success) { toast.error(res.error); return }
            toast.success(successMsg ?? "Done")
            load()
        })

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
    if (!pi) return (
        <p className="py-20 text-center text-muted-foreground">Proforma invoice not found.</p>
    )

    const canEdit = role === "ADMIN" && pi.status === "DRAFT"
    const canSubmit = role === "ADMIN" && pi.status === "DRAFT"
    const canApprove = (role === "ADMIN" || role === "BOSS") && pi.status === "SUBMITTED"
    const canReject = (role === "ADMIN" || role === "BOSS") && pi.status === "SUBMITTED"
    const canSend = role === "ADMIN" && pi.status === "APPROVED"
    const canAccept = role === "VENDOR" && pi.status === "SENT_TO_VENDOR"
    const canDecline = role === "VENDOR" && pi.status === "SENT_TO_VENDOR"
    const canConvert = role === "ADMIN" && pi.status === "ACCEPTED" && !pi.convertedToPoId
    const canDelete = role === "ADMIN" && pi.status === "DRAFT"

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={pi.piNumber}
                description={`${pi.vendor.vendorName} · Created by ${pi.createdBy.name}`}
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/admin/proforma-invoices">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back
                            </Link>
                        </Button>
                        {canEdit && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-portal/admin/proforma-invoices/${id}/edit`}>
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
                            <Button size="sm" onClick={() => act(() => submitVpProformaInvoice(id), "Submitted for approval")}>
                                <IconSend size={14} className="mr-1.5" />
                                Submit for Approval
                            </Button>
                        )}
                        {canApprove && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => act(() => approveVpProformaInvoice(id), "Proforma invoice approved")}
                                disabled={isPending}
                            >
                                <IconCheck size={14} className="mr-1.5" />
                                Approve
                            </Button>
                        )}
                        {canReject && (
                            <Button size="sm" variant="destructive" onClick={() => setRejectOpen(true)}>
                                <IconX size={14} className="mr-1.5" />
                                Reject
                            </Button>
                        )}
                        {canSend && (
                            <Button
                                size="sm"
                                onClick={() => act(() => sendVpPiToVendor(id), "Sent to vendor")}
                                disabled={isPending}
                            >
                                <IconSend size={14} className="mr-1.5" />
                                Send to Vendor
                            </Button>
                        )}
                        {canAccept && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => act(() => acceptVpProformaInvoice(id), "Proforma invoice accepted")}
                                disabled={isPending}
                            >
                                <IconCheck size={14} className="mr-1.5" />
                                Accept
                            </Button>
                        )}
                        {canDecline && (
                            <Button
                                size="sm" variant="destructive"
                                onClick={() => act(() => declineVpProformaInvoice(id), "Proforma invoice declined")}
                                disabled={isPending}
                            >
                                <IconX size={14} className="mr-1.5" />
                                Decline
                            </Button>
                        )}
                        {canConvert && (
                            <Button
                                size="sm"
                                className="bg-violet-600 hover:bg-violet-700 text-white"
                                onClick={() => setConvertOpen(true)}
                            >
                                <IconArrowRight size={14} className="mr-1.5" />
                                Convert to PO
                            </Button>
                        )}
                        {pi.convertedToPoId && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-portal/admin/purchase-orders/${pi.convertedToPoId}`}>
                                    View Converted PO →
                                </Link>
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Stepper */}
            <div className="overflow-x-auto rounded-md border bg-muted/20 px-4 py-4">
                <VpPiStatusStepper status={pi.status} />
                {pi.status === "REJECTED" && pi.rejectionReason && (
                    <p className="mt-3 text-sm text-destructive">
                        <span className="font-medium">Rejection reason: </span>{pi.rejectionReason}
                    </p>
                )}
                {pi.status === "DECLINED" && (
                    <p className="mt-3 text-sm text-orange-600 font-medium">
                        Vendor declined this proforma invoice.
                    </p>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Meta */}
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status">     <VpStatusBadge status={pi.status} /></Row>
                            <Row label="Vendor">     {pi.vendor.vendorName}</Row>
                            {pi.vendor.billingType && (
                                <Row label="Billing">
                                    <Badge variant="outline" className="text-xs">
                                        {VP_BILLING_TYPE_LABELS[pi.vendor.billingType as keyof typeof VP_BILLING_TYPE_LABELS]}
                                    </Badge>
                                </Row>
                            )}
                            <Row label="Category">   {pi.categoryName ?? "—"}</Row>
                            <Row label="Created by"> {pi.createdBy.name}</Row>
                            {pi.approvedBy && <Row label="Approved by">{pi.approvedBy.name}</Row>}
                            {pi.validityDate && (
                                <Row label="Valid until">
                                    {new Date(pi.validityDate).toLocaleDateString("en-IN")}
                                </Row>
                            )}
                            {pi.paymentTerms && <Row label="Payment">{pi.paymentTerms}</Row>}
                            {pi.notes && <><Separator /><p className="text-xs text-muted-foreground">{pi.notes}</p></>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Financials</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <Row label="Subtotal">₹{pi.subtotal.toLocaleString("en-IN")}</Row>
                            <Row label={`GST (${pi.taxRate}%)`}>₹{pi.taxAmount.toLocaleString("en-IN")}</Row>
                            <Separator />
                            <div className="flex justify-between text-base font-bold">
                                <span>Grand Total</span>
                                <span>₹{pi.grandTotal.toLocaleString("en-IN")}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoices & Payments */}
                    {pi.invoices.length > 0 && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    Linked Invoices
                                    <Badge variant="outline" className="text-[10px]">{pi.invoices.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pi.invoices.map((inv) => (
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
                </div>

                {/* Line items */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Line Items ({pi.items.length})</CardTitle>
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
                                    {pi.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2.5">
                                                <p className="font-medium">{item.description}</p>
                                                {item.itemCode && (
                                                    <p className="text-xs text-muted-foreground font-mono">{item.itemCode}</p>
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
                        <DialogTitle>Reject Proforma Invoice</DialogTitle>
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
                                const r = await rejectVpProformaInvoice(id, rejectReason)
                                setRejectOpen(false)
                                setReason("")
                                return r
                            }, "Rejected")}
                        >
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Convert to PO confirmation */}
            <AlertDialog open={convertOpen} onOpenChange={setConvertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Convert {pi.piNumber} to a Purchase Order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            A new Purchase Order will be created in DRAFT status with all line items
                            copied from this proforma invoice. You can then edit it before submitting.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-violet-600 text-white hover:bg-violet-700"
                            disabled={isPending}
                            onClick={() =>
                                act(async () => {
                                    const r = await convertPiToPo(id)
                                    setConvertOpen(false)
                                    if (r.success) {
                                        toast.success(`Created PO ${r.data.poNumber}`)
                                        router.push(`/vendor-portal/admin/purchase-orders/${r.data.poId}`)
                                    }
                                    return r
                                })
                            }
                        >
                            Convert to PO
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {pi.piNumber}?</AlertDialogTitle>
                        <AlertDialogDescription>This action is permanent.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                            onClick={() =>
                                act(async () => {
                                    const r = await deleteVpProformaInvoice(id)
                                    if (r.success) router.push("/vendor-portal/admin/proforma-invoices")
                                    return r
                                })
                            }
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