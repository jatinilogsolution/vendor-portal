// src/app/vendor-portal/(boss)/boss/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { prisma } from "@/lib/prisma"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    IconShoppingCart, IconFileInvoice,
    IconCash, IconReceipt,
} from "@tabler/icons-react"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatCard } from "@/components/ui/vp-stat-card"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"

async function getStats() {
    const [posToApprove, pisToApprove, invoicesToApprove, paymentsInitiated] =
        await Promise.all([
            prisma.vpPurchaseOrder.count({ where: { status: "SUBMITTED" } }),
            prisma.vpProformaInvoice.count({ where: { status: "SUBMITTED" } }),
            prisma.vpInvoice.count({ where: { status: "UNDER_REVIEW" } }),
            prisma.vpPayment.count({ where: { status: "INITIATED" } }),
        ])
    const pending = await prisma.vpInvoice.findMany({
        where: { status: "UNDER_REVIEW" },
        take: 5,
        orderBy: { submittedAt: "asc" },
        select: {
            id: true, invoiceNumber: true, totalAmount: true, submittedAt: true,
            vendor: { select: { existingVendor: { select: { name: true } } } },
        },
    })
    return { posToApprove, pisToApprove, invoicesToApprove, paymentsInitiated, pending }
}

export default async function BossDashboardPage() {
    await requireVendorPortalSession([UserRoleEnum.BOSS])
    const stats = await getStats()

    return (
        <div className="space-y-6">
            <VpPageHeader title="Management Dashboard" description="Your approval queue at a glance" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <VpStatCard title="POs to Approve" value={stats.posToApprove} icon={IconShoppingCart} href="/vendor-portal/boss/approvals" variant={stats.posToApprove > 0 ? "warning" : "default"} />
                <VpStatCard title="PIs to Approve" value={stats.pisToApprove} icon={IconFileInvoice} href="/vendor-portal/boss/approvals" variant={stats.pisToApprove > 0 ? "warning" : "default"} />
                <VpStatCard title="Invoices to Review" value={stats.invoicesToApprove} icon={IconReceipt} href="/vendor-portal/boss/approvals" variant={stats.invoicesToApprove > 0 ? "info" : "default"} />
                <VpStatCard title="Payments Pending" value={stats.paymentsInitiated} icon={IconCash} href="/vendor-portal/boss/payments" variant={stats.paymentsInitiated > 0 ? "danger" : "default"} />
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Invoices Awaiting Your Review</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/boss/approvals">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {stats.pending.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No invoices pending review</p>
                    ) : (
                        <div className="divide-y">
                            {stats.pending.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium">{inv.vendor.existingVendor.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {inv.invoiceNumber ?? "—"} · Submitted {inv.submittedAt
                                                ? new Date(inv.submittedAt).toLocaleDateString("en-IN")
                                                : "—"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold">₹{inv.totalAmount.toLocaleString("en-IN")}</span>
                                        <VpStatusBadge status="UNDER_REVIEW" />
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/vendor-portal/boss/approvals/invoice/${inv.id}`}>Review</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}