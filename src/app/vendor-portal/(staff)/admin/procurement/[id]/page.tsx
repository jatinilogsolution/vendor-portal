// src/app/vendor-portal/(admin)/admin/procurement/[id]/page.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconArrowLeft, IconSend, IconCheck,
    IconX, IconFileInvoice, IconRefresh,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import {
    getVpProcurementById,
    submitVpProcurement,
    approveVpProcurement,
    rejectVpProcurement,
    selectProcurementQuote,
    VpProcurementDetail,
} from "@/actions/vp/procurement.action"
import {
    getVpProformaInvoices,
    VpPiRow,
} from "@/actions/vp/proforma-invoice.action"
import { useSession } from "@/lib/auth-client"

export default function ProcurementDetailPage() {
    const params = useParams()
    const { data: session } = useSession()
    const role = session?.user?.role ?? ""
    const id = params.id as string

    const [pr, setPr] = useState<VpProcurementDetail | null>(null)
    //   const [quotes,  setQuotes]  = useState<VpPiRow[]>([])
    const quotes = pr?.quotes ?? []

    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [rejectOpen, setRejectOpen] = useState(false)
    const [rejectReason, setReason] = useState("")
    const [selectConfirm, setSelectConfirm] = useState<{
        vendorId: string
        piId: string
        name: string
        amount: number
    } | null>(null)

    // ── Load data ────────────────────────────────────────────────

    const load = async () => {
        setLoading(true)
        const [prRes] = await Promise.all([
            getVpProcurementById(id),
            // ✅ Query directly by procurementId — no client-side filter needed
            //   getVpProformaInvoices({ procurementId: id, per_page: 50 }),
        ])
        if (!prRes.success) { toast.error(prRes.error); setLoading(false); return }
        // if (!quotesRes.success) { toast.error(quotesRes.error); setLoading(false); return }

        setPr(prRes.data)
        // setQuotes(quotesRes.data.data)
        setLoading(false)
    }

    useEffect(() => { load() }, [id])

    // ── Generic action wrapper ───────────────────────────────────

    const act = (fn: () => Promise<any>, msg?: string) =>
        startTransition(async () => {
            const res = await fn()
            if (!res.success) { toast.error(res.error); return }
            toast.success(msg ?? "Done")
            load()
        })

    // ── Loading / not found ──────────────────────────────────────

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
    if (!pr) return (
        <p className="py-20 text-center text-muted-foreground">Procurement not found.</p>
    )

    const canSubmit = role === "ADMIN" && pr.status === "DRAFT"
    const canApprove = role === "BOSS" && pr.status === "SUBMITTED"
    const canReject = role === "BOSS" && pr.status === "SUBMITTED"
    const canSelect = ["ADMIN", "BOSS"].includes(role) && pr.status === "OPEN_FOR_QUOTES"

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={pr.prNumber}
                description={pr.title}
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/admin/procurement">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back
                            </Link>
                        </Button>
                        <Button
                            variant="ghost" size="sm"
                            onClick={load} disabled={loading}
                        >
                            <IconRefresh size={14} className={loading ? "animate-spin" : ""} />
                        </Button>
                        {canSubmit && (
                            <Button
                                size="sm"
                                onClick={() => act(
                                    () => submitVpProcurement(id),
                                    "Submitted for approval",
                                )}
                                disabled={isPending}
                            >
                                <IconSend size={14} className="mr-1.5" />
                                Submit for Approval
                            </Button>
                        )}
                        {canApprove && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => act(
                                    () => approveVpProcurement(id),
                                    "Approved — vendors notified to quote",
                                )}
                                disabled={isPending}
                            >
                                <IconCheck size={14} className="mr-1.5" />
                                Approve & Open for Quotes
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

            {/* Status banner */}
            <div className="rounded-md border bg-muted/20 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                    <VpStatusBadge status={pr.status} />
                    {pr.status === "DRAFT" && (
                        <span className="text-sm text-muted-foreground">
                            Submit this request for management approval.
                        </span>
                    )}
                    {pr.status === "SUBMITTED" && (
                        <span className="text-sm text-muted-foreground">
                            Awaiting management approval.
                        </span>
                    )}
                    {pr.status === "OPEN_FOR_QUOTES" && (
                        <span className="text-sm text-amber-600 font-medium">
                            {quotes.length === 0
                                ? "Waiting for vendors to submit quotes…"
                                : `${quotes.length} quote${quotes.length > 1 ? "s" : ""} received`
                            }
                        </span>
                    )}
                    {pr.status === "QUOTE_SELECTED" && (
                        <span className="text-sm text-emerald-600 font-medium">
                            ✅ A quote has been selected. Procurement closed.
                        </span>
                    )}
                    {pr.status === "CANCELLED" && pr.rejectionReason && (
                        <span className="text-sm text-destructive">
                            Rejected: {pr.rejectionReason}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* ── Left: meta + vendors ────────────────────────── */}
                <div className="space-y-4 lg:col-span-1">

                    {/* Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Category">{pr.categoryName ?? "—"}</Row>
                            <Row label="Created by">{pr.createdBy.name}</Row>
                            {pr.approvedBy && (
                                <Row label="Approved by">{pr.approvedBy.name}</Row>
                            )}
                            {pr.requiredByDate && (
                                <Row label="Required by">
                                    {new Date(pr.requiredByDate).toLocaleDateString("en-IN")}
                                </Row>
                            )}
                            {pr.deliveryAddress && (
                                <Row label="Deliver to">{pr.deliveryAddress}</Row>
                            )}
                            {pr.billTo && (
                                <Row label="Bill To">{pr.billTo}</Row>
                            )}
                            {pr.billToGstin && (
                                <Row label="Bill To GSTIN">{pr.billToGstin}</Row>
                            )}
                            {pr.description && (
                                <>
                                    <Separator />
                                    <p className="text-xs text-muted-foreground">{pr.description}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Estimated financials */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Estimated Value</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <Row label="Subtotal">₹{pr.subtotal.toLocaleString("en-IN")}</Row>
                            {pr.taxRate > 0 && (
                                <Row label={`GST (${pr.taxRate}%)`}>
                                    ₹{pr.taxAmount.toLocaleString("en-IN")}
                                </Row>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold text-base">
                                <span>Est. Total</span>
                                <span>₹{pr.grandTotal.toLocaleString("en-IN")}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invited vendors + their quote status */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">
                                Invited Vendors ({pr.vendorInvites.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {pr.vendorInvites.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    No vendors invited yet.
                                </p>
                            ) : (
                                pr.vendorInvites.map((vi) => {
                                    // Check if this vendor has submitted a quote
                                    const quote = quotes.find(
                                        (q) => q.vendor.id === vi.vendor.id,
                                    )
                                    return (
                                        <div key={vi.id} className="flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm">{vi.vendor.vendorName}</p>
                                                {quote && (
                                                    <p className="text-xs text-muted-foreground">
                                                        ₹{quote.grandTotal.toLocaleString("en-IN")}
                                                    </p>
                                                )}
                                            </div>
                                            <VpStatusBadge status={quote ? "QUOTED" : vi.status} />
                                        </div>
                                    )
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Invoices & Payments */}
                {pr.invoices.length > 0 && (
                    <div className="space-y-4 lg:col-span-1">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center justify-between">
                                    Linked Invoices
                                    <Badge variant="outline" className="text-[10px]">{pr.invoices.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pr.invoices.map((inv) => (
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
                                        <p className="text-[10px] text-muted-foreground">{inv.vendor.vendorName}</p>
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
                    </div>
                )}

                {/* ── Right: required items + quotes ──────────────── */}
                <div className="space-y-4 lg:col-span-2">

                    {/* Required items */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">
                                Required Items ({pr.lineItems.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Description</th>
                                        <th className="px-4 py-2 text-right font-medium">Qty</th>
                                        <th className="px-4 py-2 text-right font-medium">Est. Price</th>
                                        <th className="px-4 py-2 text-right font-medium">Est. Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {pr.lineItems.map((li) => (
                                        <tr key={li.id}>
                                            <td className="px-4 py-2.5">
                                                <p className="font-medium">{li.description}</p>
                                                {li.itemCode && (
                                                    <p className="text-xs font-mono text-muted-foreground">
                                                        {li.itemCode}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">{li.qty}</td>
                                            <td className="px-4 py-2.5 text-right">
                                                ₹{li.estimatedUnitPrice.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-semibold">
                                                ₹{li.total.toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Vendor quotes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <IconFileInvoice size={16} />
                                Vendor Quotes
                                <Badge variant="outline" className="text-xs">
                                    {quotes.length}
                                </Badge>
                            </CardTitle>
                            {/* Refresh quotes */}
                            <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
                                <IconRefresh size={14} className={loading ? "animate-spin" : ""} />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {quotes.length === 0 ? (
                                <div className="space-y-3 py-6 text-center">
                                    {pr.status === "OPEN_FOR_QUOTES" ? (
                                        <>
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                                                <IconFileInvoice size={22} className="text-amber-600" />
                                            </div>
                                            <p className="font-medium text-sm">
                                                Waiting for vendor quotes
                                            </p>
                                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                                {pr.vendorInvites.length} vendor
                                                {pr.vendorInvites.length > 1 ? "s have" : " has"} been
                                                notified. Quotes will appear here once submitted.
                                            </p>
                                            <div className="flex flex-col items-center gap-1 mt-2">
                                                {pr.vendorInvites.map((vi) => (
                                                    <div key={vi.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                                        {vi.vendor.vendorName} — awaiting response
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : pr.status === "DRAFT" || pr.status === "SUBMITTED" ? (
                                        <p className="text-sm text-muted-foreground">
                                            Vendors will be invited to quote once this request is approved.
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No quotes received.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Comparison header if multiple quotes */}
                                    {quotes.length > 1 && (
                                        <p className="text-xs text-muted-foreground rounded-md bg-muted/30 px-3 py-2">
                                            {quotes.length} quotes received. Compare and select the best one.
                                        </p>
                                    )}

                                    {quotes.map((pi) => {
                                        // Compare against estimate
                                        const vsEstimate = pr.grandTotal > 0
                                            ? ((pi.grandTotal - pr.grandTotal) / pr.grandTotal) * 100
                                            : 0
                                        const isCheaper = vsEstimate < 0
                                        const isSelected = pr.status === "QUOTE_SELECTED" &&
                                            pr.vendorInvites.find(
                                                (vi) => vi.vendor.id === pi.vendor.id,
                                            )?.status === "SELECTED"

                                        return (
                                            <div
                                                key={pi.id}
                                                className={`rounded-md border p-4 transition-colors ${isSelected
                                                        ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20"
                                                        : "hover:bg-muted/30"
                                                    }`}
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    {/* Vendor + quote info */}
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-sm">
                                                                {pi.vendor.vendorName}
                                                            </p>
                                                            {isSelected && (
                                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                                                    ✓ Selected
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="font-mono text-xs text-muted-foreground">
                                                            {pi.piNumber}
                                                        </p>
                                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                            {pi.fulfillmentDate && (
                                                                <span>
                                                                    📦 Delivery:{" "}
                                                                    {new Date(pi.fulfillmentDate).toLocaleDateString("en-IN")}
                                                                </span>
                                                            )}
                                                            {pi.validityDate && (
                                                                <span>
                                                                    ⏳ Valid till:{" "}
                                                                    {new Date(pi.validityDate).toLocaleDateString("en-IN")}
                                                                </span>
                                                            )}
                                                            {pi.paymentTerms && (
                                                                <span>💳 {pi.paymentTerms}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Amount + comparison */}
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold">
                                                            ₹{pi.grandTotal.toLocaleString("en-IN")}
                                                        </p>
                                                        {pr.grandTotal > 0 && (
                                                            <p className={`text-xs font-medium ${isCheaper ? "text-emerald-600" : "text-red-500"
                                                                }`}>
                                                                {isCheaper ? "↓" : "↑"}{" "}
                                                                {Math.abs(vsEstimate).toFixed(1)}%{" "}
                                                                vs estimate
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quote line items preview */}
                                                <Separator className="my-3" />
                                                <div className="space-y-1">
                                                    {pi?.items?.slice(0, 3).map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span className="truncate flex-1 mr-4">{item.description}</span>
                                                            <span className="shrink-0">
                                                                {item.qty} × ₹{item.unitPrice.toLocaleString("en-IN")}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {(pi.items?.length ?? 0) > 3 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            +{(pi.items?.length ?? 0) - 3} more items
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-3 flex items-center gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/vendor-portal/admin/proforma-invoices/${pi.id}`}>
                                                            View Full Quote
                                                        </Link>
                                                    </Button>
                                                    {canSelect && !isSelected && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-violet-600 hover:bg-violet-700 text-white"
                                                            onClick={() => setSelectConfirm({
                                                                vendorId: pi.vendor.id,
                                                                piId: pi.id,
                                                                name: pi.vendor.vendorName,
                                                                amount: pi.grandTotal,
                                                            })}
                                                        >
                                                            <IconCheck size={13} className="mr-1.5" />
                                                            Select This Quote
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ── Reject dialog ────────────────────────────────────── */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Procurement Request</DialogTitle>
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
                                    const r = await rejectVpProcurement(id, rejectReason)
                                    setRejectOpen(false)
                                    setReason("")
                                    return r
                                }, "Rejected")
                            }
                        >
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Select quote confirmation ─────────────────────────── */}
            <AlertDialog
                open={!!selectConfirm}
                onOpenChange={(v) => !v && setSelectConfirm(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Select quote from {selectConfirm?.name}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Amount: ₹{selectConfirm?.amount.toLocaleString("en-IN")}
                            <br />
                            This will mark this vendor as selected and close the procurement.
                            Other vendors will be marked as not selected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-violet-600 text-white hover:bg-violet-700"
                            disabled={isPending}
                            onClick={() =>
                                selectConfirm &&
                                act(
                                    () => selectProcurementQuote(
                                        id,
                                        selectConfirm.vendorId,
                                        selectConfirm.piId,
                                    ),
                                    "Quote selected — procurement closed",
                                )
                            }
                        >
                            Confirm Selection
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