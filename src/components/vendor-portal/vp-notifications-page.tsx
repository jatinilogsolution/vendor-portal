// src/components/vendor-portal/vp-notifications-page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconBell, IconCheck, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { cn } from "@/lib/utils"
import {
    getMyVpNotifications, markVpNotifRead,
    markAllVpNotifsRead, deleteVpNotif, VpNotifRow,
} from "@/actions/vp/notification.action"

// Role-aware routing for "click to open doc"
const HREF_MAP: Record<string, (id: string, role: string) => string> = {
    VpPurchaseOrder: (id, role) =>
        role === "VENDOR"
            ? `/vendor-portal/vendor/my-pos/${id}`
            : `/vendor-portal/admin/purchase-orders/${id}`,
    VpProformaInvoice: (id, role) =>
        role === "VENDOR"
            ? `/vendor-portal/vendor/my-invoices`
            : `/vendor-portal/admin/proforma-invoices/${id}`,
    VpInvoice: (id, role) =>
        role === "VENDOR"
            ? `/vendor-portal/vendor/my-invoices/${id}`
            : `/vendor-portal/admin/invoices/${id}`,
    VpPayment: (_id, role) =>
        role === "BOSS"
            ? `/vendor-portal/boss/payments`
            : `/vendor-portal/vendor/my-invoices`,
    VpDeliveryRecord: (id, role) =>
        role === "VENDOR"
            ? `/vendor-portal/vendor/my-deliveries`
            : `/vendor-portal/admin/deliveries/${id}`,
}

function buildHref(
    docType: string | null,
    docId: string | null,
    role: string,
): string | null {
    if (!docType || !docId) return null
    return HREF_MAP[docType]?.(docId, role) ?? null
}

function timeAgo(date: Date): string {
    const diff = (Date.now() - new Date(date).getTime()) / 1000
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short",
    })
}

interface VpNotificationsPageProps {
    role: string
}

export function VpNotificationsPage({ role }: VpNotificationsPageProps) {
    const router = useRouter()
    const [notifs, setNotifs] = useState<VpNotifRow[]>([])
    const [loading, setLoading] = useState(true)
    const [unreadOnly, setUnreadOnly] = useState(false)
    const [isPending, startTransition] = useTransition()

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getMyVpNotifications({ unreadOnly, per_page: 50 })
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setNotifs(res.data.data)
        setLoading(false)
    }, [unreadOnly])

    useEffect(() => { load() }, [load])

    const handleClick = (n: VpNotifRow) => {
        startTransition(async () => {
            if (!n.isRead) {
                await markVpNotifRead(n.id)
                setNotifs((prev) =>
                    prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
                )
            }
            const href = buildHref(n.refDocType, n.refDocId, role)
            if (href) router.push(href)
        })
    }

    const handleMarkAll = () =>
        startTransition(async () => {
            await markAllVpNotifsRead()
            setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
            toast.success("All notifications marked as read")
        })

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        startTransition(async () => {
            await deleteVpNotif(id)
            setNotifs((prev) => prev.filter((n) => n.id !== id))
        })
    }

    const unreadCount = notifs.filter((n) => !n.isRead).length

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Notifications"
                description={`${unreadCount} unread`}
                actions={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="unread-toggle"
                                checked={unreadOnly}
                                onCheckedChange={setUnreadOnly}
                            />
                            <Label htmlFor="unread-toggle" className="cursor-pointer text-sm">
                                Unread only
                            </Label>
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                size="sm" variant="outline"
                                onClick={handleMarkAll} disabled={isPending}
                            >
                                <IconCheck size={14} className="mr-1.5" />
                                Mark all read
                            </Button>
                        )}
                        <Button
                            variant="outline" size="sm"
                            onClick={load} disabled={loading}
                        >
                            <IconRefresh
                                size={15}
                                className={loading ? "animate-spin" : ""}
                            />
                        </Button>
                    </div>
                }
            />

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : notifs.length === 0 ? (
                <VpEmptyState
                    icon={IconBell}
                    title="No notifications"
                    description={
                        unreadOnly ? "No unread notifications." : "You're all caught up!"
                    }
                />
            ) : (
                <div className="rounded-md border">
                    {notifs.map((n, idx) => {
                        const href = buildHref(n.refDocType, n.refDocId, role)
                        const hasLink = !!href
                        return (
                            <div key={n.id}>
                                <div
                                    className={cn(
                                        "flex items-start gap-3 px-4 py-4 transition-colors",
                                        hasLink && "cursor-pointer hover:bg-muted/40",
                                        !n.isRead && "bg-blue-50/50 dark:bg-blue-900/10",
                                    )}
                                    onClick={() => hasLink && handleClick(n)}
                                >
                                    <div className={cn(
                                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                        n.isRead ? "bg-muted" : "bg-blue-500",
                                    )} />

                                    <div className="min-w-0 flex-1">
                                        <p className={cn(
                                            "text-sm leading-relaxed",
                                            !n.isRead && "font-medium",
                                        )}>
                                            {n.message}
                                        </p>
                                        <div className="mt-1 flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">
                                                {timeAgo(n.createdAt)}
                                            </span>
                                            {n.refDocType && (
                                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                                    {n.refDocType.replace("Vp", "")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        {!n.isRead && (
                                            <Button
                                                variant="ghost" size="icon" className="h-7 w-7"
                                                title="Mark read"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    startTransition(async () => {
                                                        await markVpNotifRead(n.id)
                                                        setNotifs((prev) =>
                                                            prev.map((x) =>
                                                                x.id === n.id ? { ...x, isRead: true } : x,
                                                            ),
                                                        )
                                                    })
                                                }}
                                            >
                                                <IconCheck size={13} />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost" size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            title="Delete"
                                            onClick={(e) => handleDelete(n.id, e)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                </div>
                                {idx < notifs.length - 1 && <Separator />}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}