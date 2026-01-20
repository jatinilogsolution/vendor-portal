"use client";

import React, { useState, useMemo } from "react";
import { useNotifications } from "@/context/notification-context";
import { 
    Bell, 
    MessageSquare, 
    AlertCircle, 
    CheckCircle2, 
    Info, 
    ArrowRight, 
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    FileText,
    CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { FormattedWorkflowContent } from "@/components/formatted-workflow-content";

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filteredNotifications = useMemo(() => {
        let filtered = notifications;

        // Tab Filtering
        if (activeTab === "unread") {
            filtered = filtered.filter(n => !n.isRead);
        } else if (activeTab === "system") {
            filtered = filtered.filter(n => n.type === "system");
        } else if (activeTab === "user") {
            filtered = filtered.filter(n => n.type === "user");
        }

        // Search Filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(n => 
                n.content.toLowerCase().includes(query) || 
                n.authorName.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [notifications, activeTab, searchQuery]);

    const stats = useMemo(() => ({
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length,
        system: notifications.filter(n => n.type === "system").length,
        user: notifications.filter(n => n.type === "user").length
    }), [notifications]);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications Center</h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                        <Bell className="h-4 w-4" />
                        Manage all your workflow updates and communications in one place
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {stats.unread > 0 && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={markAllAsRead}
                            className="text-primary border-primary/20 hover:bg-primary/5"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-primary/10 shadow-sm">
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-semibold">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 space-y-1">
                            {[
                                { id: "all", label: "All Items", icon: Bell, count: stats.total, color: "text-blue-600" },
                                { id: "unread", label: "Unread Only", icon: Clock, count: stats.unread, color: "text-amber-600" },
                                { id: "system", label: "System Alerts", icon: AlertCircle, count: stats.system, color: "text-emerald-600" },
                                { id: "user", label: "Team Messages", icon: User, count: stats.user, color: "text-indigo-600" }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-all",
                                        activeTab === item.id 
                                            ? "bg-primary/10 text-primary shadow-sm" 
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-primary" : item.color)} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.count > 0 && (
                                        <Badge variant={activeTab === item.id ? "default" : "secondary"} className="h-5 px-1.5 min-w-[20px] justify-center">
                                            {item.count}
                                        </Badge>
                                    )}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-primary/10 shadow-sm bg-primary/5">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Info className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Helpful Tip</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                System notifications marked with <span className="text-emerald-600 font-bold">AlertCircle</span> are automated status changes in the workflow.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Card className="lg:col-span-3 border-primary/10 shadow-sm min-h-[600px] flex flex-col">
                    <CardHeader className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search notifications by content or sender..." 
                                className="pl-10 h-10 border-primary/10 bg-muted/30 focus-visible:ring-primary/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-0 flex-1">
                        {filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground gap-4">
                                <div className="p-6 rounded-full bg-muted/50 border border-dashed border-muted-foreground/20">
                                    <Bell className="h-12 w-12 opacity-10" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-foreground/70">No notifications found</p>
                                    <p className="text-sm">Try adjusting your filters or search query</p>
                                </div>
                                {activeTab !== "all" && (
                                    <Button variant="outline" size="sm" onClick={() => setActiveTab("all")}>
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredNotifications.map((notification) => (
                                    <Link
                                        key={notification.id}
                                        href={notification.targetType === "invoice" 
                                            ? `/invoices/${notification.targetId}` 
                                            : `/lorries/annexure/${notification.targetId}`}
                                        onClick={() => markAsRead(notification.id)}
                                        className={cn(
                                            "flex flex-col sm:flex-row gap-4 p-5 hover:bg-muted/30 transition-all group relative border-l-4",
                                            notification.isRead ? "border-transparent" : "border-primary bg-primary/2"
                                        )}
                                    >
                                        {/* Icon Section */}
                                        <div className={cn(
                                            "mt-1 p-3 rounded-xl shrink-0 h-fit transition-transform group-hover:scale-105 shadow-sm border",
                                            notification.type === "system" 
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                : "bg-blue-50 text-blue-600 border-blue-100"
                                        )}>
                                            {notification.type === "system" ? <AlertCircle className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                                            {notification.type === "system" ? "Workflow Automation" : `Message Arrived from ${notification.authorName}`}
                                                        </span>
                                                        <Badge variant="outline" className="text-[10px] h-4 uppercase font-bold tracking-tighter bg-background">
                                                            {notification.targetType}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <FormattedWorkflowContent 
                                                        content={notification.content} 
                                                        textClassName="text-sm text-foreground/80 leading-relaxed"
                                                        nested={true}
                                                    />
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                                                        {format(notification.createdAt, "MMM dd, yyyy")}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                                    <div className="flex items-center gap-1 group/link">
                                                        <FileText className="h-3 w-3" />
                                                        <span className="group-hover/link:underline">Ref: {notification.targetId.slice(-8).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                    Open Document <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    
                    {filteredNotifications.length > 0 && (
                        <div className="p-4 border-t bg-muted/20 text-center">
                            <p className="text-xs text-muted-foreground">
                                Showing {filteredNotifications.length} of {notifications.length} notifications
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
