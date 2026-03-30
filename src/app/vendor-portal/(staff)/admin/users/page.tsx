// src/app/vendor-portal/(admin)/admin/users/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { IconUsers, IconRefresh, IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { getVpPortalUsers } from "@/actions/vp/user.action"

type VpPortalUserRow = {
    id: string
    name: string
    email: string
    role: string
    createdAt: Date
    banned: boolean | null
    vendorName: string | null
}

export default function AdminUsersPage() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q") ?? ""
    const [users, setUsers] = useState<VpPortalUserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(initialQuery)

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpPortalUsers()
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setUsers(res.data)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])
    useEffect(() => { setSearch(initialQuery) }, [initialQuery])

    const normalizedQuery = search.trim().toLowerCase()
    const filteredUsers = normalizedQuery
        ? users.filter((u) =>
            [u.id, u.name, u.email, u.role, u.vendorName]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(normalizedQuery)),
        )
        : users

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Portal Users"
                description={`${filteredUsers.length} of ${users.length} users with vendor portal access`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        <CreateVpUserButton onSuccess={load} />
                    </div>
                }
            />

            <div className="relative max-w-md">
                <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, role, vendor or ID..."
                    className="pl-9"
                />
            </div>

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            ) : filteredUsers.length === 0 ? (
                <VpEmptyState
                    icon={IconUsers}
                    title="No portal users found"
                    description={search ? "Try a different search term." : "Add users to give them access to the vendor portal."}
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
                            {filteredUsers.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium text-sm">
                                        <div>
                                            <p>{u.name}</p>
                                            <p className="font-mono text-[11px] text-muted-foreground">{u.id}</p>
                                        </div>
                                    </TableCell>
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
                                        {u.vendorName ?? (
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
