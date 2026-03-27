// src/app/vendor-portal/(admin)/admin/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { prisma } from "@/lib/prisma"

import {
    IconBuildingStore, IconShoppingCart,
    IconFileInvoice, IconReceipt,
    IconClock, IconCheck,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatCard } from "@/components/ui/vp-stat-card"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"

async function getStats() {
    const [
        activeVendors, pendingPos, pendingPis,
        underReviewInvoices, recentInvoices,
    ] = await Promise.all([
        prisma.vpVendor.count({ where: { portalStatus: "ACTIVE" } }),
        prisma.vpPurchaseOrder.count({ where: { status: "SUBMITTED" } }),
        prisma.vpProformaInvoice.count({ where: { status: "SUBMITTED" } }),
        prisma.vpInvoice.count({ where: { status: "UNDER_REVIEW" } }),
        prisma.vpInvoice.findMany({
            where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                invoiceNumber: true,
                status: true,
                totalAmount: true,
                createdAt: true,
                vendor: {
                    select: { existingVendor: { select: { name: true } } },
                },
            },
        }),
    ])
    return { activeVendors, pendingPos, pendingPis, underReviewInvoices, recentInvoices }
}

export default async function AdminDashboardPage() {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    const stats = await getStats()

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Admin Dashboard"
                description="Overview of vendor portal activity"
            />

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <VpStatCard
                    title="Active Vendors"
                    value={stats.activeVendors}
                    icon={IconBuildingStore}
                    href="/vendor-portal/admin/vendors"
                    variant="default"
                />
                <VpStatCard
                    title="POs Awaiting Approval"
                    value={stats.pendingPos}
                    icon={IconShoppingCart}
                    href="/vendor-portal/admin/purchase-orders"
                    variant={stats.pendingPos > 0 ? "warning" : "default"}
                />
                <VpStatCard
                    title="PIs Awaiting Approval"
                    value={stats.pendingPis}
                    icon={IconFileInvoice}
                    href="/vendor-portal/admin/proforma-invoices"
                    variant={stats.pendingPis > 0 ? "warning" : "default"}
                />
                <VpStatCard
                    title="Invoices Under Review"
                    value={stats.underReviewInvoices}
                    icon={IconReceipt}
                    href="/vendor-portal/admin/invoices"
                    variant={stats.underReviewInvoices > 0 ? "info" : "default"}
                />
            </div>

            {/* Recent Invoices */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recent Vendor Bills</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.recentInvoices.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No pending invoices</p>
                    ) : (
                        <div className="divide-y">
                            {stats.recentInvoices.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {inv.vendor.existingVendor.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {inv.invoiceNumber ?? "Draft"} · {new Date(inv.createdAt).toLocaleDateString("en-IN")}
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
    )
}