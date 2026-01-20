"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getGlobalNotifications } from "@/app/(private)/lorries/_action/workflow-comments.action";
import { useSession } from "@/lib/auth-client";
import { UserRoleEnum } from "@/utils/constant";

interface Notification {
    id: string;
    content: string;
    authorName: string;
    authorRole: string;
    createdAt: Date;
    type: "system" | "user";
    targetId: string;
    targetType: "annexure" | "invoice";
    isRead: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            const res = await getGlobalNotifications({
                userId: session.user.id,
                role: session.user.role,
            });

            if (res.success && res.data) {
                const storedReadIds = JSON.parse(localStorage.getItem("read_notifications") || "[]");
                const now = new Date();
                const expiryLimit = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
                
                const newNotifications: Notification[] = res.data
                    .map<Notification>((c: any) => ({
                        id: c.id,
                        content: c.content,
                        authorName: c.Author.name,
                        authorRole: c.authorRole,
                        createdAt: new Date(c.createdAt),
                        type: (c.content.includes("[SYSTEM]") || c.content.includes("[SUBMITTED]") || c.content.includes("[APPROVED]") || c.content.includes("[REJECTED]") || c.content.includes("[FORWARDED]")) ? "system" : "user",
                        targetId: c.invoiceId || c.annexureId || "",
                        targetType: c.invoiceId ? "invoice" : "annexure",
                        isRead: storedReadIds.includes(c.id)
                    }))
                    .filter((n) => {
                        // Keep if unread OR if read but less than 48 hours old
                        if (!n.isRead) return true;
                        return (now.getTime() - n.createdAt.getTime()) < expiryLimit;
                    });

                // Sort by date desc
                newNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                
                setNotifications(newNotifications);
                setLastFetchTime(new Date());
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [session?.user?.id, session?.user?.role]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [session?.user?.id, fetchNotifications]);

    const markAsRead = (id: string) => {
        const storedReadIds = JSON.parse(localStorage.getItem("read_notifications") || "[]");
        if (!storedReadIds.includes(id)) {
            storedReadIds.push(id);
            localStorage.setItem("read_notifications", JSON.stringify(storedReadIds));
        }
        
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.id);
        localStorage.setItem("read_notifications", JSON.stringify(allIds));
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            refresh: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
