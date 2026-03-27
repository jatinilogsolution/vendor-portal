// src/components/vendor-portal/vp-notification-bell.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { IconBell } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
    getMyVpNotifications, markVpNotifRead,
    markAllVpNotifsRead, getUnreadVpNotifCount,
    VpNotifRow,
} from "@/actions/vp/notification.action"
import { cn } from "@/lib/utils"

// Map refDocType to route path
function buildNotifHref(type: string, docType: string | null, docId: string | null): string | null {
    if (!docType || !docId) return null
    const map: Record<string, string> = {
        VpPurchaseOrder: `/vendor-portal/admin/purchase-orders/${docId}`,
        VpProformaInvoice: `/vendor-portal/admin/proforma-invoices/${docId}`,
        VpInvoice: `/vendor-portal/admin/invoices/${docId}`,
        VpPayment: `/vendor-portal/boss/payments`,
        VpDeliveryRecord: `/vendor-portal/admin/deliveries/${docId}`,
    }
    return map[docType] ?? null
}

function timeAgo(date: Date): string {
    const diff = (Date.now() - new Date(date).getTime()) / 1000
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}

export function VpNotificationBell({ role }: { role: string }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [notifs, setNotifs] = useState<VpNotifRow[]>([])
    const [unread, setUnread] = useState(0)
    const [isPending, startTransition] = useTransition()

    const loadCount = async () => {
        const res = await getUnreadVpNotifCount()
        if (res.success) setUnread(res.data.count)
    }

    const loadNotifs = async () => {
        const res = await getMyVpNotifications({ per_page: 10 })
        if (res.success) setNotifs(res.data.data)
    }

    useEffect(() => {
        loadCount()
        const interval = setInterval(loadCount, 30_000)
        return () => clearInterval(interval)
    }, [])

    const handleOpen = (v: boolean) => {
        setOpen(v)
        if (v) loadNotifs()
    }

    const handleClick = (notif: VpNotifRow) => {
        startTransition(async () => {
            if (!notif.isRead) {
                await markVpNotifRead(notif.id)
                setUnread((c) => Math.max(0, c - 1))
                setNotifs((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
                )
            }
            const href = buildNotifHref(notif.type, notif.refDocType, notif.refDocId)
            if (href) { setOpen(false); router.push(href) }
        })
    }

    const handleMarkAll = () => {
        startTransition(async () => {
            await markAllVpNotifsRead()
            setUnread(0)
            setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })))
        })
    }

    return (
        <Popover open={open} onOpenChange={handleOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <IconBell size={18} stroke={1.5} />
                    {unread > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                            {unread > 9 ? "9+" : unread}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0" sideOffset={6}>
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <p className="text-sm font-semibold">
                        Notifications
                        {unread > 0 && (
                            <Badge className="ml-2 h-5 px-1.5 text-[10px]">{unread}</Badge>
                        )}
                    </p>
                    {unread > 0 && (
                        <Button
                            variant="ghost" size="sm" className="h-7 text-xs"
                            onClick={handleMarkAll} disabled={isPending}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No notifications yet.
                        </p>
                    ) : (
                        notifs.map((n, idx) => (
                            <div key={n.id}>
                                <button
                                    className={cn(
                                        "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
                                        !n.isRead && "bg-blue-50/50 dark:bg-blue-900/10",
                                    )}
                                    onClick={() => handleClick(n)}
                                >
                                    <div className="flex items-start gap-2">
                                        {/* Unread dot */}
                                        <div className={cn(
                                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                            n.isRead ? "bg-transparent" : "bg-blue-500",
                                        )} />
                                        <div className="min-w-0 flex-1">
                                            <p className={cn(
                                                "text-xs leading-relaxed",
                                                !n.isRead && "font-medium",
                                            )}>
                                                {n.message}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                                                {timeAgo(n.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                                {idx < notifs.length - 1 && <Separator />}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-2">
                    <Button
                        variant="ghost" size="sm" className="w-full text-xs"
                        onClick={() => {
                            setOpen(false)
                            const notifPath =
                                role === "VENDOR" ? "/vendor-portal/vendor/notifications"
                                    : role === "ADMIN" ? "/vendor-portal/admin/notifications"
                                        : "/vendor-portal/boss/notifications"
                            router.push(notifPath)
                        }}
                    >
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}