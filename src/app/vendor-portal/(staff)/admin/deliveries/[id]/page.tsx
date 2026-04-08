// src/app/vendor-portal/(admin)/admin/deliveries/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { getVpDeliveryById } from "@/actions/vp/delivery.action"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconArrowLeft, IconFile } from "@tabler/icons-react"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"

export default async function DeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    const { id } = await params
    const res = await getVpDeliveryById(id)
    if (!res.success) notFound()

    const d = res.data

    const conditionColor: Record<string, string> = {
        GOOD: "bg-emerald-100 text-emerald-700",
        DAMAGED: "bg-red-100 text-red-700",
        PARTIAL: "bg-amber-100 text-amber-700",
        EXTRA: "bg-violet-100 text-violet-700",
    }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={`Delivery — ${d.po.poNumber}`}
                description={`${d.po.vendorName} · ${d.deliveryDate
                    ? new Date(d.deliveryDate).toLocaleDateString("en-IN")
                    : "Date not set"}`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/vendor-portal/admin/deliveries/new?poId=${d.po.id}`}>
                                Update Delivery
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/vendor-portal/admin/deliveries">
                                <IconArrowLeft size={14} className="mr-1.5" />
                                Back
                            </Link>
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-1">
                    {/* Meta card */}
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status">       <VpStatusBadge status={d.status} /></Row>
                            <Row label="PO Number">
                                <Link
                                    href={`/vendor-portal/admin/purchase-orders/${d.po.id}`}
                                    className="font-mono text-xs text-primary hover:underline"
                                >
                                    {d.po.poNumber}
                                </Link>
                            </Row>
                            <Row label="PO Status"><VpStatusBadge status={d.poStatus} /></Row>
                            <Row label="Vendor">       {d.po.vendorName}</Row>
                            <Row label="Company">{d.poCompanyName ?? "—"}</Row>
                            <Row label="Delivery Date">
                                {d.deliveryDate ? new Date(d.deliveryDate).toLocaleDateString("en-IN") : "—"}
                            </Row>
                            <Row label="PO Delivery Date">
                                {d.poDeliveryDate ? new Date(d.poDeliveryDate).toLocaleDateString("en-IN") : "—"}
                            </Row>
                            <Row label="Dispatched By">{d.dispatchedBy ?? "—"}</Row>
                            <Row label="Received By">  {d.receivedBy ?? "—"}</Row>
                            <Row label="Delivery Proof">
                                {d.proofUrl ? (
                                    <a
                                        href={d.proofUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        View proof
                                    </a>
                                ) : "—"}
                            </Row>
                            {d.poDeliveryAddress && (
                                <>
                                    <Separator />
                                    <p className="text-xs text-muted-foreground">
                                        Delivery Address: {d.poDeliveryAddress}
                                    </p>
                                </>
                            )}
                            {d.notes && (
                                <>
                                    <Separator />
                                    <p className="text-xs text-muted-foreground">{d.notes}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Related Invoices ({d.invoices.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {d.invoices.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No invoices linked with this PO yet.</p>
                            ) : d.invoices.map((invoice) => (
                                <div key={invoice.id} className="rounded-md border px-3 py-2 text-xs">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link
                                            href={`/vendor-portal/admin/invoices/${invoice.id}`}
                                            className="font-mono text-primary hover:underline"
                                        >
                                            {invoice.invoiceNumber ?? invoice.id}
                                        </Link>
                                        <VpStatusBadge status={invoice.status} />
                                    </div>
                                    <div className="mt-1 text-muted-foreground">
                                        Amount: ₹{invoice.totalAmount.toLocaleString("en-IN")} · Docs: {invoice.documentCount}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Related Documents ({d.documents.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {d.documents.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No delivery/invoice documents available.</p>
                            ) : d.documents.map((document) => (
                                <a
                                    key={document.id}
                                    href={document.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs hover:bg-muted/40"
                                >
                                    <IconFile size={13} className="text-muted-foreground" />
                                    <span className="truncate flex-1">{document.label}</span>
                                    <span className="text-muted-foreground">
                                        {new Date(document.uploadedAt).toLocaleDateString("en-IN")}
                                    </span>
                                </a>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Line items */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Delivered Items ({d.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Description</th>
                                        <th className="px-4 py-2 text-right font-medium">Ordered</th>
                                        <th className="px-4 py-2 text-right font-medium">Delivered</th>
                                        <th className="px-4 py-2 text-center font-medium">Condition</th>
                                        <th className="px-4 py-2 text-right font-medium">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {d.items.map((item) => {
                                        const pct = Math.min(100, Math.round((item.qtyDelivered / item.qtyOrdered) * 100))
                                        return (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium">{item.description}</p>
                                                    {(item.itemCode || item.itemId) && (
                                                        <p className="text-xs font-mono text-muted-foreground">
                                                            {[item.itemCode, item.itemId].filter(Boolean).join(" · ")}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">{item.qtyOrdered}</td>
                                                <td className="px-4 py-3 text-right font-semibold">{item.qtyDelivered}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={conditionColor[item.condition ?? "GOOD"] ?? ""}
                                                    >
                                                        {item.condition ?? "GOOD"}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="h-1.5 w-20 rounded-full bg-muted">
                                                            <div
                                                                className="h-1.5 rounded-full bg-emerald-500 transition-all"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground w-8 text-right">
                                                            {pct}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
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
