// src/app/vendor-portal/(vendor)/vendor/notifications/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconBell, IconCheck, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { cn } from "@/lib/utils"
import {
    getMyVpNotifications, markVpNotifRead,
    markAllVpNotifsRead, deleteVpNotif, VpNotifRow,
} from "@/actions/vp/notification.action"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { Switch } from "@/components/ui/switch"

function buildHref(docType: string | null, docId: string | null): string | null {
    if (!docType || !docId) return null
    const map: Record<string, string> = {
        VpPurchaseOrder: `/vendor-portal/admin/purchase-orders/${docId}`,
        VpProformaInvoice: `/vendor-portal/admin/proforma-invoices/${docId}`,
        VpInvoice: `/vendor-portal/vendor/my-invoices/${docId}`,
        VpPayment: `/vendor-portal/vendor/my-invoices`,
        VpDeliveryRecord: `/vendor-portal/vendor/my-deliveries`,
    }
    return map[docType] ?? null
}

function timeAgo(date: Date): string {
    const diff = (Date.now() - new Date(date).getTime()) / 1000
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

export default function VendorNotificationsPage() {
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

    const handleRead = (notif: VpNotifRow) => {
        startTransition(async () => {
            if (!notif.isRead) await markVpNotifRead(notif.id)
            const href = buildHref(notif.refDocType, notif.refDocId)
            if (href) router.push(href)
            else {
                setNotifs((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
                )
            }
        })
    }

    const handleMarkAll = () => {
        startTransition(async () => {
            await markAllVpNotifsRead()
            setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
            toast.success("All notifications marked as read")
        })
    }

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
                                id="unread-only"
                                checked={unreadOnly}
                                onCheckedChange={setUnreadOnly}
                            />
                            <Label htmlFor="unread-only" className="text-sm cursor-pointer">
                                Unread only
                            </Label>
                        </div>
                        {unreadCount > 0 && (
                            <Button size="sm" variant="outline" onClick={handleMarkAll} disabled={isPending}>
                                <IconCheck size={14} className="mr-1.5" />
                                Mark all read
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
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
                    description={unreadOnly ? "No unread notifications." : "You're all caught up!"}
                />
            ) : (
                <div className="rounded-md border">
                    {notifs.map((n, idx) => {
                        const href = buildHref(n.refDocType, n.refDocId)
                        const hasLink = !!href

                        return (
                            <div key={n.id}>
                                <div
                                    className={cn(
                                        "flex items-start gap-3 px-4 py-4 transition-colors",
                                        hasLink && "cursor-pointer hover:bg-muted/40",
                                        !n.isRead && "bg-blue-50/50 dark:bg-blue-900/10",
                                    )}
                                    onClick={() => hasLink && handleRead(n)}
                                >
                                    {/* Unread dot */}
                                    <div className={cn(
                                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                        n.isRead ? "bg-muted" : "bg-blue-500",
                                    )} />

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <p className={cn(
                                            "text-sm leading-relaxed",
                                            !n.isRead && "font-medium",
                                        )}>
                                            {n.message}
                                        </p>
                                        <div className="mt-1 flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                                            {n.refDocType && (
                                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                                    {n.refDocType.replace("Vp", "")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
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
                                                            prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
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