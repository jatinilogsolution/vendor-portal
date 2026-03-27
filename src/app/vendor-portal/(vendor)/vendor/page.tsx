// src/app/vendor-portal/(vendor)/vendor/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { prisma } from "@/lib/prisma"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    IconShoppingCart, IconReceipt,
    IconTruckDelivery, IconPlus,
} from "@tabler/icons-react"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpStatCard } from "@/components/ui/vp-stat-card"
import { VpPageHeader } from "@/components/ui/vp-page-header"

async function getVendorStats(vendorUserId: string) {
    // Find vpVendor via the user's vendorId
    const user = await prisma.user.findUnique({
        where: { id: vendorUserId },
        select: { vendorId: true },
    })
    if (!user?.vendorId) return null

    const vpVendor = await prisma.vpVendor.findFirst({
        where: { existingVendorId: user.vendorId },
    })
    if (!vpVendor) return null

    const [activePOs, myInvoices, recentInvoices] = await Promise.all([
        prisma.vpPurchaseOrder.count({
            where: { vendorId: vpVendor.id, status: { not: "CLOSED" } },
        }),
        prisma.vpInvoice.count({ where: { vendorId: vpVendor.id } }),
        prisma.vpInvoice.findMany({
            where: { vendorId: vpVendor.id },
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true, invoiceNumber: true,
                status: true, totalAmount: true, createdAt: true,
            },
        }),
    ])

    return { vpVendorId: vpVendor.id, activePOs, myInvoices, recentInvoices }
}

export default async function VendorDashboardPage() {
    const { userId } = await requireVendorPortalSession([UserRoleEnum.VENDOR])
    const stats = await getVendorStats(userId)

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-lg font-semibold">Account not linked</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Your account is not linked to a vendor profile yet. Please contact your admin.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="My Dashboard"
                description="Track your purchase orders, invoices and deliveries"
                actions={
                    <Button size="sm" asChild>
                        <Link href="/vendor-portal/vendor/my-invoices/new">
                            <IconPlus className="mr-2 h-4 w-4" />
                            Submit Invoice
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <VpStatCard title="Active POs" value={stats.activePOs} icon={IconShoppingCart} href="/vendor-portal/vendor/my-pos" variant="info" />
                <VpStatCard title="My Invoices" value={stats.myInvoices} icon={IconReceipt} href="/vendor-portal/vendor/my-invoices" variant="default" />
                <VpStatCard title="Deliveries" value={0} icon={IconTruckDelivery} href="/vendor-portal/vendor/my-deliveries" variant="default" />
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Recent Invoices</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/vendor/my-invoices">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {stats.recentInvoices.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No invoices yet. Submit your first bill.
                        </p>
                    ) : (
                        <div className="divide-y">
                            {stats.recentInvoices.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium">{inv.invoiceNumber ?? "Draft"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold">₹{inv.totalAmount.toLocaleString("en-IN")}</span>
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