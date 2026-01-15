"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogs } from "@/hooks/useLogs";
import { Activity, FileText, Database, Trash2, Edit, PlusCircle } from "lucide-react";
import { useMemo } from "react";

export default function LogsStats() {
    const { logs, isLoading } = useLogs({ pageSize: 1000 }); // Get more logs for stats

    const stats = useMemo(() => {
        const byAction: Record<string, number> = {};
        const byModel: Record<string, number> = {};
        const byUser: Record<string, number> = {};

        logs.forEach((log) => {
            // Count by action
            byAction[log.action] = (byAction[log.action] || 0) + 1;

            // Count by model
            byModel[log.model] = (byModel[log.model] || 0) + 1;

            // Count by user
            const userName = log.user?.name || log.user?.email || "Unknown";
            byUser[userName] = (byUser[userName] || 0) + 1;
        });

        return {
            total: logs.length,
            byAction,
            byModel,
            byUser,
            creates: byAction.CREATE || 0,
            updates: byAction.UPDATE || 0,
            deletes: byAction.DELETE || 0,
        };
    }, [logs]);

    const mostActiveUsers = useMemo(() => {
        return Object.entries(stats.byUser)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
    }, [stats.byUser]);

    const mostModifiedModels = useMemo(() => {
        return Object.entries(stats.byModel)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
    }, [stats.byModel]);

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 bg-muted rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-muted rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-6">
            {/* Overview Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All audit events</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Creates</CardTitle>
                        <PlusCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.creates}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total > 0 ? ((stats.creates / stats.total) * 100).toFixed(1) : 0}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Updates</CardTitle>
                        <Edit className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.updates}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total > 0 ? ((stats.updates / stats.total) * 100).toFixed(1) : 0}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deletes</CardTitle>
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.deletes}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total > 0 ? ((stats.deletes / stats.total) * 100).toFixed(1) : 0}% of total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Insights */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Most Active Users</CardTitle>
                        <CardDescription>Top 3 users by activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mostActiveUsers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No user activity yet</p>
                        ) : (
                            <div className="space-y-2">
                                {mostActiveUsers.map(([user, count], index) => (
                                    <div key={user} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-mono text-muted-foreground">
                                                #{index + 1}
                                            </span>
                                            <span className="text-sm truncate max-w-[200px]">{user}</span>
                                        </div>
                                        <span className="text-sm font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Most Modified Models</CardTitle>
                        <CardDescription>Top 3 models by changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mostModifiedModels.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No model changes yet</p>
                        ) : (
                            <div className="space-y-2">
                                {mostModifiedModels.map(([model, count], index) => (
                                    <div key={model} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{model}</span>
                                        </div>
                                        <span className="text-sm font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
