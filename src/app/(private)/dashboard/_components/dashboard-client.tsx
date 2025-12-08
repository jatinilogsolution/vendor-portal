"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    IconFileInvoice,
    IconTruck,
    IconCheck,
    IconX,
    IconCurrencyRupee,
    IconFolder,
    IconTrendingUp,
    IconUsers,
    IconRefresh
} from "@tabler/icons-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/utils/calculations"
import { useEffect, useState } from "react"
import { getDashboardStats } from "../_actions/dashboard"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface DashboardData {
    overview: {
        totalLRs: number
        lrsWithPOD: number
        lrsWithoutPOD: number
        invoicedLRs: number
        totalInvoices: number
        draftInvoices: number
        sentInvoices: number
        totalAnnexures: number
        totalRevenue: number
    }
    podCoverage: number
    invoiceConversion: number
    recentLRs: any[]
    recentInvoices: any[]
    vendorStats: any[] | null
    userRole: string
    isAdmin: boolean
    timestamp?: number
}

interface DashboardClientProps {
    data: DashboardData
    userName: string
}

const DB_NAME = "DashboardCache"
const STORE_NAME = "dashboardData"
const CACHE_KEY = "stats"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// IndexedDB utilities
async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }
    })
}

async function getCachedData(): Promise<DashboardData | null> {
    try {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readonly")
            const store = transaction.objectStore(STORE_NAME)
            const request = store.get(CACHE_KEY)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
                const cached = request.result
                if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_DURATION) {
                    resolve(cached.data)
                } else {
                    resolve(null)
                }
            }
        })
    } catch (error) {
        console.error("Error reading from IndexedDB:", error)
        return null
    }
}

async function setCachedData(data: DashboardData): Promise<void> {
    try {
        const db = await openDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite")
            const store = transaction.objectStore(STORE_NAME)
            const request = store.put({ data, timestamp: Date.now() }, CACHE_KEY)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve()
        })
    } catch (error) {
        console.error("Error writing to IndexedDB:", error)
    }
}

export default function DashboardClient({ data: initialData, userName }: DashboardClientProps) {
    const [data, setData] = useState<DashboardData>(initialData)
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Load cached data and set up auto-refresh
    useEffect(() => {
        async function loadCachedData() {
            const cached = await getCachedData()
            if (cached) {
                setData(cached)
                if (cached.timestamp) {
                    setLastUpdated(new Date(cached.timestamp))
                }
            } else {
                // Save initial data to cache
                await setCachedData(initialData)
            }
        }

        loadCachedData()

        // Auto-refresh every 5 minutes
        const interval = setInterval(async () => {
            await refreshData()
        }, CACHE_DURATION)

        return () => clearInterval(interval)
    }, [])

    async function refreshData() {
        setIsRefreshing(true)
        try {
            const result = await getDashboardStats()

            if ("error" in result) {
                toast.error("Failed to refresh dashboard data")
                return
            }

            if (result.data) {
                setData(result.data)
                setLastUpdated(new Date())
                await setCachedData(result.data)
                toast.success("Dashboard refreshed")
            }
        } catch (error) {
            console.error("Error refreshing dashboard:", error)
            toast.error("Failed to refresh dashboard")
        } finally {
            setIsRefreshing(false)
        }
    }

    const { overview, podCoverage, invoiceConversion, recentLRs, recentInvoices, vendorStats, isAdmin } = data

    return (
        <div className="@container/main flex flex-1 flex-col gap-6 p-4 lg:p-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {userName}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your {isAdmin ? "system" : "account"} today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-muted-foreground">
                        <div>Last updated:</div>
                        <div className="font-medium">{lastUpdated.toLocaleTimeString()}</div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className="gap-2"
                    >
                        <IconRefresh className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total LRs"
                    value={overview.totalLRs}
                    icon={IconTruck}
                    trend={`${invoiceConversion}% invoiced`}
                    trendUp={invoiceConversion > 50}
                    href="/lorries"
                />
                <MetricCard
                    title="Total Invoices"
                    value={overview.totalInvoices}
                    icon={IconFileInvoice}
                    trend={`${overview.sentInvoices} sent`}
                    subtitle={`${overview.draftInvoices} drafts`}
                    href="/invoices"
                />
                <MetricCard
                    title="POD Coverage"
                    value={`${podCoverage}%`}
                    icon={IconCheck}
                    trend={`${overview.lrsWithPOD} of ${overview.totalLRs}`}
                    trendUp={podCoverage > 70}
                    href="/pod"
                />
                <MetricCard
                    title="Total Revenue"
                    value={formatCurrency(overview.totalRevenue)}
                    icon={IconCurrencyRupee}
                    trend="Settled amount"
                    valueClassName="text-2xl"
                />
            </div>

            {/* Progress Indicators */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">POD Upload Progress</CardTitle>
                        <CardDescription>
                            {overview.lrsWithPOD} out of {overview.totalLRs} LRs have proof of delivery
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={podCoverage} className="h-2" />
                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-2">
                                <IconCheck className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-muted-foreground">
                                    {overview.lrsWithPOD} with POD
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconX className="w-4 h-4 text-destructive" />
                                <span className="text-sm text-muted-foreground">
                                    {overview.lrsWithoutPOD} pending
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Invoice Conversion</CardTitle>
                        <CardDescription>
                            {overview.invoicedLRs} out of {overview.totalLRs} LRs have been invoiced
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={invoiceConversion} className="h-2" />
                        <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-2">
                                <IconFileInvoice className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-muted-foreground">
                                    {overview.sentInvoices} sent
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconFolder className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-muted-foreground">
                                    {overview.draftInvoices} drafts
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isAdmin && vendorStats && vendorStats.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Recent LRs */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent LR Requests</CardTitle>
                                <Link href="/lorries" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <CardDescription>Latest lorry receipt entries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentLRs.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No recent LR requests
                                    </p>
                                ) : (
                                    recentLRs.map((lr) => (
                                        <div
                                            key={lr.id}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{lr.LRNumber}</span>
                                                    {lr.podlink && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <IconCheck className="w-3 h-3 mr-1" />
                                                            POD
                                                        </Badge>
                                                    )}
                                                    {lr.isInvoiced && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Invoiced
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {lr.vehicleNo} • {lr.fileNumber}
                                                </p>
                                            </div>
                                            {lr.priceSettled && (
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(lr.priceSettled)}
                                                </span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Invoices */}


                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Invoices</CardTitle>
                                <Link href="/invoices" className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <CardDescription>Latest booking cover notes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentInvoices.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No recent invoices
                                    </p>
                                ) : (
                                    recentInvoices.map((invoice) => (
                                        <Link
                                            key={invoice.id}
                                            href={`/invoices/${invoice.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors block"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{invoice.refernceNumber}</span>
                                                    <Badge
                                                        variant={invoice.status === "SENT" ? "default" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {invoice.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {invoice.invoiceNumber || "No invoice number"}
                                                </p>
                                            </div>
                                            {invoice.status === "SENT" && invoice.grandTotal > 0 && (
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(invoice.grandTotal)}
                                                </span>
                                            )}
                                        </Link>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* Vendor Stats - Only for Admins */}
            {isAdmin && vendorStats && vendorStats.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconUsers className="w-5 h-5" />
                            Top Vendors by Activity
                        </CardTitle>
                        <CardDescription>Vendors with the most LR requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {vendorStats.map((vendor: any, index) => (
                                <div key={vendor.id} className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{vendor.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {vendor._count.LRRequest} LRs • {vendor._count.invoices} Invoices
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline">
                                            {Math.round((vendor._count.invoices / (vendor._count.LRRequest || 1)) * 100)}% converted
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Shortcuts to common tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <QuickActionButton
                            href="/lorries"
                            icon={IconTruck}
                            label="View LRs"
                            description="Manage lorry receipts"
                        />
                        <QuickActionButton
                            href="/invoices"
                            icon={IconFileInvoice}
                            label="Invoices"
                            description="Create & manage"
                        />
                        <QuickActionButton
                            href="/pod"
                            icon={IconCheck}
                            label="Upload POD"
                            description="Proof of delivery"
                        />
                        <QuickActionButton
                            href="/lorries/annexure"
                            icon={IconFolder}
                            label="Annexures"
                            description="View BCN/Annexure"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Metric Card Component
function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    subtitle,
    href,
    valueClassName
}: {
    title: string
    value: string | number
    icon: any
    trend?: string
    trendUp?: boolean
    subtitle?: string
    href?: string
    valueClassName?: string
}) {
    const CardWrapper = href ? Link : "div"

    return (
        <CardWrapper href={href || "#"} className={href ? "block" : ""}>
            <Card className={href ? "hover:shadow-md transition-shadow cursor-pointer" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold ${valueClassName || ""}`}>{value}</div>
                    {trend && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${trendUp !== undefined
                            ? trendUp
                                ? "text-green-600"
                                : "text-orange-600"
                            : "text-muted-foreground"
                            }`}>
                            {trendUp !== undefined && (
                                <IconTrendingUp className={`w-3 h-3 ${!trendUp && "rotate-180"}`} />
                            )}
                            {trend}
                        </p>
                    )}
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </CardContent>
            </Card>
        </CardWrapper>
    )
}

// Quick Action Button
function QuickActionButton({
    href,
    icon: Icon,
    label,
    description
}: {
    href: string
    icon: any
    label: string
    description: string
}) {
    return (
        <Link
            href={href}
            className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-all group"
        >
            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </Link>
    )
}
