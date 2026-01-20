"use client";

import React, { useState } from "react";
import { Bell, MessageSquare, AlertCircle, CheckCircle2, Info, ArrowRight } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/notification-context";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

import { FormattedWorkflowContent } from "./formatted-workflow-content";

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const unreadNotifications = notifications.filter(n => !n.isRead);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-primary/10 transition-colors group"
                >
                    <Bell className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        unreadCount > 0 && "animate-pulse text-primary"
                    )} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] font-bold text-primary-foreground items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">New Alerts</h3>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 bg-primary/10 text-primary border-none">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7 px-2 text-primary hover:text-primary hover:bg-primary/5"
                            onClick={markAllAsRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[450px]">
                    {unreadNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground gap-3">
                            <div className="p-4 rounded-full bg-muted/30">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-50" />
                            </div>
                            <div className="text-center px-4">
                                <p className="text-sm font-semibold text-foreground">All caught up!</p>
                                <p className="text-xs">No new notifications at the moment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {unreadNotifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={notification.targetType === "invoice" 
                                        ? `/invoices/${notification.targetId}` 
                                        : `/lorries/annexure/${notification.targetId}`}
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "flex gap-4 p-4 hover:bg-muted/50 transition-all items-start relative group border-l-2",
                                        notification.isRead ? "border-transparent" : "border-primary bg-primary/2"
                                    )}
                                >
                                    <div className={cn(
                                        "mt-1 p-2 rounded-xl shrink-0 border shadow-sm",
                                        notification.type === "system" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {notification.type === "system" ? <AlertCircle className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                                {notification.type === "system" ? "Workflow Update" : `Message Arrived from ${notification.authorName}`}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                        
                                        <FormattedWorkflowContent 
                                            content={notification.content} 
                                            textClassName="text-xs line-clamp-3 leading-relaxed opacity-90"
                                            nested={true}
                                        />

                                        <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            View document <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-3 border-t text-center">
                        <Button variant="link" size="sm" className="text-xs h-auto p-0" asChild>
                            <Link href="/notifications" onClick={() => setIsOpen(false)}>See all notifications</Link>
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
