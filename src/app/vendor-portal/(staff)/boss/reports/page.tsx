// src/app/vendor-portal/(boss)/boss/reports/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { prisma } from "@/lib/prisma"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatCard } from "@/components/ui/vp-stat-card"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    IconCash, IconShoppingCart,
    IconFileInvoice, IconBuildingStore,
} from "@tabler/icons-react"

async function getReportData() {
    const [
        totalVendors,
        totalPOs,
        totalInvoices,
        paidInvoices,
        topVendors,
        recentPayments,
        invoicesByStatus,
    ] = await Promise.all([
        prisma.vpVendor.count({ where: { portalStatus: "ACTIVE" } }),

        prisma.vpPurchaseOrder.count(),

        prisma.vpInvoice.count(),

        prisma.vpInvoice.aggregate({
            where: { status: "PAYMENT_CONFIRMED" },
            _sum: { totalAmount: true },
            _count: true,
        }),

        // Top 5 vendors by invoice value
        prisma.vpInvoice.groupBy({
            by: ["vendorId"],
            _sum: { totalAmount: true },
            _count: true,
            orderBy: { _sum: { totalAmount: "desc" } },
            take: 5,
        }),

        // Last 10 completed payments
        prisma.vpPayment.findMany({
            where: { status: "COMPLETED" },
            take: 10,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                amount: true,
                paymentMode: true,
                paymentDate: true,
                invoice: {
                    select: {
                        invoiceNumber: true,
                        vendor: { select: { existingVendor: { select: { name: true } } } },
                    },
                },
            },
        }),

        // Invoice counts by status
        prisma.vpInvoice.groupBy({
            by: ["status"],
            _count: true,
            orderBy: { _count: { status: "desc" } },
        }),
    ])

    // Resolve vendor names for top vendors
    const vendorIds = topVendors.map((t) => t.vendorId)
    const vendorNames = await prisma.vpVendor.findMany({
        where: { id: { in: vendorIds } },
        select: {
            id: true,
            existingVendor: { select: { name: true } },
        },
    })
    const nameMap = Object.fromEntries(
        vendorNames.map((v) => [v.id, v.existingVendor.name]),
    )

    return {
        totalVendors,
        totalPOs,
        totalInvoices,
        paidAmount: paidInvoices._sum.totalAmount ?? 0,
        paidCount: paidInvoices._count,
        topVendors: topVendors.map((t) => ({
            vendorId: t.vendorId,
            vendorName: nameMap[t.vendorId] ?? "Unknown",
            total: t._sum.totalAmount ?? 0,
            count: t._count,
        })),
        recentPayments,
        invoicesByStatus,
    }
}

export default async function BossReportsPage() {
    await requireVendorPortalSession([UserRoleEnum.BOSS])
    const data = await getReportData()

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Reports"
                description="Portal-wide spend and activity summary."
            />

            {/* KPI row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <VpStatCard
                    title="Active Vendors"
                    value={data.totalVendors}
                    icon={IconBuildingStore}
                    variant="default"
                />
                <VpStatCard
                    title="Total POs"
                    value={data.totalPOs}
                    icon={IconShoppingCart}
                    variant="info"
                />
                <VpStatCard
                    title="Total Invoices"
                    value={data.totalInvoices}
                    icon={IconFileInvoice}
                    variant="default"
                />
                <VpStatCard
                    title="Total Paid"
                    value={`₹${data.paidAmount.toLocaleString("en-IN")}`}
                    icon={IconCash}
                    description={`${data.paidCount} invoices paid`}
                    variant="success"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top vendors by spend */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Top Vendors by Spend</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data.topVendors.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                No invoice data yet.
                            </p>
                        ) : (
                            <div className="divide-y">
                                {data.topVendors.map((v, idx) => {
                                    const maxTotal = data.topVendors[0]?.total ?? 1
                                    const pct = Math.round((v.total / maxTotal) * 100)
                                    return (
                                        <div key={v.vendorId} className="flex items-center gap-3 px-4 py-3">
                                            <span className="w-5 shrink-0 text-sm font-bold text-muted-foreground">
                                                {idx + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {v.vendorName}
                                                </p>
                                                <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                                                    <div
                                                        className="h-1.5 rounded-full bg-primary transition-all"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-semibold">
                                                    ₹{v.total.toLocaleString("en-IN")}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {v.count} inv.
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Invoice status breakdown */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Invoices by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5 p-4">
                        {data.invoicesByStatus.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                No invoices yet.
                            </p>
                        ) : (
                            data.invoicesByStatus.map((row) => (
                                <div
                                    key={row.status}
                                    className="flex items-center justify-between"
                                >
                                    <VpStatusBadge status={row.status} />
                                    <span className="text-sm font-semibold">{row._count}</span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent payments */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Completed Payments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {data.recentPayments.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No completed payments yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Vendor</th>
                                        <th className="px-4 py-2 text-left font-medium">Invoice</th>
                                        <th className="px-4 py-2 text-right font-medium">Amount</th>
                                        <th className="px-4 py-2 text-center font-medium">Mode</th>
                                        <th className="px-4 py-2 text-right font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {data.recentPayments.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-4 py-2.5 font-medium">
                                                {p.invoice.vendor.existingVendor.name}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-xs">
                                                {p.invoice.invoiceNumber ?? "—"}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-semibold">
                                                ₹{p.amount.toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">
                                                {p.paymentMode ?? "—"}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                                                {p.paymentDate
                                                    ? new Date(p.paymentDate).toLocaleDateString("en-IN")
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}