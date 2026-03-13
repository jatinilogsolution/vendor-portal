"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, RefreshCw, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  getMyVpNotifications,
  getMyUnreadVpNotificationCount,
  markAllVpNotificationsReadAction,
  markVpNotificationReadAction,
} from "@/app/vendor-portal/_actions/notifications";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { UserRoleEnum } from "@/utils/constant";

type Notification = {
  id: string;
  type: string;
  message: string;
  refDocType: string | null;
  refDocId: string | null;
  isRead: boolean;
  createdAt: string;
};

function notificationHref(n: Notification, role?: string): string {
  const qp = n.refDocId ? `?focus=${encodeURIComponent(n.refDocId)}` : "";
  if (role === UserRoleEnum.BOSS) {
    if (n.refDocType === "VpPurchaseOrder" || n.refDocType === "VpProformaInvoice" || n.refDocType === "VpInvoice")
      return `/vendor-portal/boss/approvals${qp}`;
    return "/vendor-portal/boss";
  }
  if (role === UserRoleEnum.ADMIN) {
    if (n.refDocType === "VpPurchaseOrder") return `/vendor-portal/admin/purchase-orders${qp}`;
    if (n.refDocType === "VpProformaInvoice") return `/vendor-portal/admin/proforma-invoices${qp}`;
    if (n.refDocType === "VpInvoice") return `/vendor-portal/admin/invoices${qp}`;
    return "/vendor-portal/admin";
  }
  if (role === UserRoleEnum.VENDOR) {
    if (n.refDocType === "VpPurchaseOrder") return `/vendor-portal/vendor/purchase-orders${qp}`;
    if (n.refDocType === "VpProformaInvoice") return `/vendor-portal/vendor/proforma-invoices${qp}`;
    if (n.refDocType === "VpInvoice") return `/vendor-portal/vendor/invoices${qp}`;
    return "/vendor-portal/vendor";
  }
  return "/vendor-portal";
}

export function VendorPortalNotificationBell() {
  const pathname = usePathname();
  const { data } = useSession();
  const role = data?.user?.role as string | undefined;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasUnread = useMemo(() => unreadCount > 0, [unreadCount]);

  const load = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [list, count] = await Promise.all([
        getMyVpNotifications(15),
        getMyUnreadVpNotificationCount(),
      ]);
      const serialized = JSON.parse(JSON.stringify(list)) as Notification[];
      setNotifications(serialized);
      setUnreadCount(Number(count || 0));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, pathname]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      void load();
    }, 45_000);
    return () => window.clearInterval(id);
  }, [open, load]);

  const handleSelect = async (n: Notification) => {
    if (!n.isRead) {
      await markVpNotificationReadAction(n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setOpen(false);
  };

  const handleMarkAllRead = async () => {
    await markAllVpNotificationsReadAction();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">Notifications</p>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => void load()}
              disabled={isRefreshing}
              aria-label="Refresh notifications"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => void handleMarkAllRead()}
              disabled={!hasUnread}
              aria-label="Mark all as read"
            >
              <CheckCheck className="size-4" />
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem key={n.id} asChild>
              <Link
                href={notificationHref(n, role)}
                onClick={() => handleSelect(n)}
                className={`block cursor-pointer py-2 ${!n.isRead ? "font-medium" : "text-muted-foreground"}`}
              >
                <p className="line-clamp-2 text-sm">{n.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
