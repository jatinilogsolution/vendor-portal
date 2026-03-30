// src/app/vendor-portal/(vendor)/vendor/my-pos/[id]/page.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { IconArrowLeft, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpPoStatusStepper } from "@/components/ui/vp-po-status-stepper"
import {
    getVpPurchaseOrderById,
    acknowledgeVpPo,
    VpPoDetail,
} from "@/actions/vp/purchase-order.action"

export default function VendorPoDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [po, setPo] = useState<VpPoDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const load = async () => {
        setLoading(true)
        const res = await getVpPurchaseOrderById(id)
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setPo(res.data)
        setLoading(false)
    }

    useEffect(() => { load() }, [id])

    const handleAck = () =>
        startTransition(async () => {
            const res = await acknowledgeVpPo(id)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Purchase order acknowledged")
            load()
        })

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
    if (!po) return (
        <p className="py-20 text-center text-muted-foreground">Purchase order not found.</p>
    )

    const canAck = po.status === "SENT_TO_VENDOR"

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={po.poNumber}
                description={`Issued by ${po.createdBy.name}`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/vendor/my-pos">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back
                            </Link>
                        </Button>
                        {canAck && (
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={handleAck}
                                disabled={isPending}
                            >
                                <IconCheck size={14} className="mr-1.5" />
                                Acknowledge
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Stepper */}
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
                {/* Meta */}
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status">    <VpStatusBadge status={po.status} /></Row>
                            <Row label="Category">  {po.categoryName ?? "—"}</Row>
                            {po.deliveryDate && (
                                <Row label="Delivery">
                                    {new Date(po.deliveryDate).toLocaleDateString("en-IN")}
                                </Row>
                            )}
                            {po.deliveryAddress && (
                                <Row label="Address">{po.deliveryAddress}</Row>
                            )}
                            {po.billTo && (
                                <Row label="Bill To">{po.billTo}</Row>
                            )}
                            {po.billToGstin && (
                                <Row label="Bill To GSTIN">{po.billToGstin}</Row>
                            )}
                            {po.notes && (
                                <>
                                    <Separator />
                                    <p className="text-xs text-muted-foreground">{po.notes}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Financials</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <Row label="Subtotal">
                                ₹{po.subtotal.toLocaleString("en-IN")}
                            </Row>
                            <Row label={`GST (${po.taxRate}%)`}>
                                ₹{po.taxAmount.toLocaleString("en-IN")}
                            </Row>
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
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {po.invoices.map((inv) => (
                                    <div key={inv.id} className="space-y-2 border-b last:border-0 pb-3 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/vendor-portal/vendor/my-invoices/${inv.id}`}
                                                className="font-mono text-xs font-semibold text-primary hover:underline"
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
                                                            <span className="text-[10px] text-muted-foreground italic">{p.status.toLowerCase()}</span>
                                                        </div>
                                                        {p.notes && (
                                                            <p className="text-[10px] text-muted-foreground">{p.notes}</p>
                                                        )}
                                                        {p.proofUrl && (
                                                            <a
                                                                href={p.proofUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] text-emerald-600 hover:underline inline-flex items-center gap-1"
                                                            >
                                                                View Payment Proof →
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
                        <CardTitle className="text-sm">
                            Line Items ({po.items.length})
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
                                        <th className="px-4 py-2 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {po.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2.5">
                                                <p className="font-medium">{item.description}</p>
                                                {item.itemCode && (
                                                    <p className="text-xs text-muted-foreground font-mono">
                                                        {item.itemCode}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-right">{item.qty}</td>
                                            <td className="px-4 py-2.5 text-right">
                                                ₹{item.unitPrice.toLocaleString("en-IN")}
                                            </td>
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
