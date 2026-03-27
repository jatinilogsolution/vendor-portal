// src/app/vendor-portal/(admin)/admin/vendors/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { getVpVendorById } from "@/actions/vp/vendor.action"
import { getVpVendorBankDetails, verifyVpVendorBankDetails } from "@/actions/vp/bank-details.action"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    IconArrowLeft, IconMail, IconPhone,
    IconReceipt, IconShoppingCart,
} from "@tabler/icons-react"
import { VP_BILLING_TYPE_LABELS, VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import Row from "@/components/ui/row"
import { toast } from "sonner"

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    const { id } = await params
    const result = await getVpVendorById(id)
    if (!result.success) notFound()

    const v = result.data
    const vv = v.vendor
    const bankRes = await getVpVendorBankDetails(v.id)
    const bank = bankRes.success ? bankRes.data : null

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={vv.name}
                description={v.categoryName ?? "No category assigned"}
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/admin/vendors">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left column: vendor info */}
                <div className="space-y-4 lg:col-span-1">

                    {/* Portal config card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Portal Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <VpStatusBadge status={v.portalStatus} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Vendor Type</span>
                                <VpStatusBadge status={v.vendorType} />
                            </div>
                            {v.billingType?.length > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Billing</span>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {v.billingType.map(bt => (
                                            <Badge key={bt} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                                                {VP_BILLING_TYPE_LABELS[bt as keyof typeof VP_BILLING_TYPE_LABELS] || bt}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {v.recurringCycle && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cycle</span>
                                    <Badge variant="outline" className="text-xs">
                                        {VP_RECURRING_CYCLE_LABELS[v.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS]}
                                    </Badge>
                                </div>
                            )}
                            {v.createdBy && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Enrolled by</span>
                                    <span className="text-right text-xs">{v.createdBy.name}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Enrolled on</span>
                                <span className="text-xs">
                                    {new Date(v.createdAt).toLocaleDateString("en-IN")}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact card */}
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
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">GST</span>
                                    <code className="text-xs">{vv.gstNumber}</code>
                                </div>
                            )}
                            {vv.panNumber && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">PAN</span>
                                    <code className="text-xs">{vv.panNumber}</code>
                                </div>
                            )}
                            {vv.paymentTerms && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Terms</span>
                                    <span className="text-xs">{vv.paymentTerms}</span>
                                </div>
                            )}
                            {vv.address && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Location</span>
                                    <span className="text-xs text-right">
                                        {[vv.address.city, vv.address.state, vv.address.country]
                                            .filter(Boolean).join(", ")}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats card */}
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
                    {bank && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-sm">
                                    <span>Bank Details</span>
                                    {bank.verifiedAt
                                        ? <Badge className="bg-emerald-100 text-emerald-700 text-xs">Verified</Badge>
                                        : <Badge variant="outline" className="text-xs text-amber-600">Unverified</Badge>
                                    }
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <Row label="Account Name">{bank.accountHolderName}</Row>
                                <Row label="Bank">{bank.bankName}</Row>
                                <Row label="Account No.">
                                    <code className="text-xs">{"*".repeat(bank.accountNumber.length - 4)}{bank.accountNumber.slice(-4)}</code>
                                </Row>
                                <Row label="IFSC"><code className="text-xs">{bank.ifscCode}</code></Row>
                                {!bank.verifiedAt && (
                                    <Button size="sm" variant="outline" className="w-full mt-2" onClick={async () => {
                                        await verifyVpVendorBankDetails(v.id)
                                        toast.success("Bank details verified")
                                    }}>
                                        Mark as Verified
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right column: POs + Invoices */}
                <div className="space-y-4 lg:col-span-2">

                    {/* Recent POs */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <IconShoppingCart size={16} />
                                Recent Purchase Orders
                            </CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-portal/admin/purchase-orders?vendorId=${v.id}`}>
                                    View All
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {v.purchaseOrders.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">No purchase orders yet</p>
                            ) : (
                                <div className="divide-y">
                                    {v.purchaseOrders.map((po) => (
                                        <div key={po.id} className="flex items-center justify-between px-4 py-3">
                                            <div>
                                                <Link
                                                    href={`/vendor-portal/admin/purchase-orders/${po.id}`}
                                                    className="text-sm font-medium hover:underline"
                                                >
                                                    {po.poNumber}
                                                </Link>
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

                    {/* Recent invoices */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <IconReceipt size={16} />
                                Recent Vendor Bills
                            </CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/vendor-portal/admin/invoices?vendorId=${v.id}`}>View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {v.invoices.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">No invoices yet</p>
                            ) : (
                                <div className="divide-y">
                                    {v.invoices.map((inv) => (
                                        <div key={inv.id} className="flex items-center justify-between px-4 py-3">
                                            <div>
                                                <Link
                                                    href={`/vendor-portal/admin/invoices/${inv.id}`}
                                                    className="text-sm font-medium hover:underline"
                                                >
                                                    {inv.invoiceNumber ?? "Draft"}
                                                </Link>
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