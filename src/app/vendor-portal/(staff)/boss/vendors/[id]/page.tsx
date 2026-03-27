// src/app/vendor-portal/(boss)/boss/vendors/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { getVpVendorById } from "@/actions/vp/vendor.action"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    IconArrowLeft, IconMail, IconPhone,
    IconShoppingCart, IconReceipt,
} from "@tabler/icons-react"
import {
    VP_BILLING_TYPE_LABELS,
    VP_RECURRING_CYCLE_LABELS,
} from "@/types/vendor-portal"

export default async function BossVendorDetailPage({
    params,
}: {
    params: { id: string }
}) {
    await requireVendorPortalSession([UserRoleEnum.BOSS])
    const result = await getVpVendorById(params.id)
    if (!result.success) notFound()

    const v = result.data
    const vv = v.vendor

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={vv.name}
                description={v.categoryName ?? "No category assigned"}
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/boss/vendors">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-1">
                    {/* Portal config */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Portal Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <Row label="Status">
                                <VpStatusBadge status={v.portalStatus} />
                            </Row>
                            <Row label="Vendor Type">
                                <VpStatusBadge status={v.vendorType} />
                            </Row>
                            {v.billingType && v.billingType.length > 0 && (
                                <Row label="Billing">
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {v.billingType.map((bt) => (
                                            <Badge key={bt} variant="outline" className="text-xs">
                                                {VP_BILLING_TYPE_LABELS[bt as keyof typeof VP_BILLING_TYPE_LABELS] || bt}
                                            </Badge>
                                        ))}
                                    </div>
                                </Row>
                            )}
                            {v.recurringCycle && (
                                <Row label="Cycle">
                                    <Badge variant="outline" className="text-xs">
                                        {VP_RECURRING_CYCLE_LABELS[
                                            v.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS
                                        ]}
                                    </Badge>
                                </Row>
                            )}
                            {v.createdBy && (
                                <Row label="Enrolled by">{v.createdBy.name}</Row>
                            )}
                            <Row label="Enrolled on">
                                {new Date(v.createdAt).toLocaleDateString("en-IN")}
                            </Row>
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            {vv.contactEmail && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <IconMail size={14} />
                                    <span className="break-all">{vv.contactEmail}</span>
                                </div>
                            )}
                            {vv.contactPhone && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <IconPhone size={14} />
                                    <span>{vv.contactPhone}</span>
                                </div>
                            )}
                            <Separator />
                            {vv.gstNumber && (
                                <Row label="GST">
                                    <code className="text-xs">{vv.gstNumber}</code>
                                </Row>
                            )}
                            {vv.panNumber && (
                                <Row label="PAN">
                                    <code className="text-xs">{vv.panNumber}</code>
                                </Row>
                            )}
                            {vv.paymentTerms && (
                                <Row label="Payment Terms">{vv.paymentTerms}</Row>
                            )}
                            {vv.address && (
                                <Row label="Location">
                                    {[vv.address.city, vv.address.state, vv.address.country]
                                        .filter(Boolean)
                                        .join(", ")}
                                </Row>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <CardContent className="grid grid-cols-3 gap-2 p-4 text-center">
                            <div>
                                <p className="text-xl font-bold">{v._count.purchaseOrders}</p>
                                <p className="text-[10px] text-muted-foreground">POs</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold">{v._count.proformaInvoices}</p>
                                <p className="text-[10px] text-muted-foreground">PIs</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold">{v._count.invoices}</p>
                                <p className="text-[10px] text-muted-foreground">Bills</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: POs + Invoices read-only */}
                <div className="space-y-4 lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <IconShoppingCart size={16} />
                                Recent Purchase Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {v.purchaseOrders.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    No purchase orders yet
                                </p>
                            ) : (
                                <div className="divide-y">
                                    {v.purchaseOrders.map((po) => (
                                        <div
                                            key={po.id}
                                            className="flex items-center justify-between px-4 py-3"
                                        >
                                            <div>
                                                <p className="font-mono text-sm font-medium">
                                                    {po.poNumber}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(po.createdAt).toLocaleDateString("en-IN")}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold">
                                                    ₹{po.grandTotal.toLocaleString("en-IN")}
                                                </span>
                                                <VpStatusBadge status={po.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <IconReceipt size={16} />
                                Recent Vendor Bills
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {v.invoices.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    No invoices yet
                                </p>
                            ) : (
                                <div className="divide-y">
                                    {v.invoices.map((inv) => (
                                        <div
                                            key={inv.id}
                                            className="flex items-center justify-between px-4 py-3"
                                        >
                                            <div>
                                                <p className="font-mono text-sm font-medium">
                                                    {inv.invoiceNumber ?? "Draft"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold">
                                                    ₹{inv.totalAmount.toLocaleString("en-IN")}
                                                </span>
                                                <VpStatusBadge status={inv.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
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