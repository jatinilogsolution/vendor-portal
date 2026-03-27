// src/app/vendor-portal/(admin)/admin/users/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { IconUsers, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { CreateVpUserButton } from "@/components/vendor-portal/create-vp-user-button"
import { prisma } from "@/lib/prisma"

// We fetch directly since this is a simple list —
// a server action would work identically.
// async function getPortalUsers() {
//     "use server"
//     const { prisma } = await import("@/lib/prisma")
//     return prisma.user.findMany({
//         where: { role: { in: ["ADMIN", "BOSS", "VENDOR"] } },
//         select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//             createdAt: true,
//             banned: true,
//             Vendor: { select: { name: true } },
//         },
//         orderBy: { createdAt: "desc" },
//     })
// }

import { getVpPortalUsers } from "@/actions/vp/user.action"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpPortalUsers()
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setUsers(res.data)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Portal Users"
                description={`${users.length} users with vendor portal access`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <CreateVpUserButton onSuccess={load} />
                    </div>
                }
            />

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <VpEmptyState
                    icon={IconUsers}
                    title="No portal users yet"
                    description="Add users to give them access to the vendor portal."
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Linked Vendor</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium text-sm">{u.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {u.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                u.role === "BOSS"
                                                    ? "border-purple-200 text-purple-700"
                                                    : u.role === "ADMIN"
                                                        ? "border-blue-200 text-blue-700"
                                                        : "border-slate-200 text-slate-600"
                                            }
                                        >
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {u.Vendor?.name ?? (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                                    </TableCell>
                                    <TableCell>
                                        <VpStatusBadge status={u.banned ? "INACTIVE" : "ACTIVE"} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}