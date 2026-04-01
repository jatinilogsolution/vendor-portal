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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "@/lib/auth-client"
import {
    banVpPortalUser,
    getVpPortalUsers,
    unbanVpPortalUser,
} from "@/actions/vp/user.action"
import {
    VpUserBanDialog,
} from "@/components/vendor-portal/vp-user-ban-dialog"
import {
    VpUserDetails,
    VpUserDetailsSheet,
} from "@/components/vendor-portal/vp-user-details-sheet"
import { canManageUserBan } from "@/lib/vendor-portal/user-ban-permissions"

type VpPortalUserRow = VpUserDetails

const roleStyles: Record<string, string> = {
    BOSS: "border-purple-200 text-purple-700",
    ADMIN: "border-blue-200 text-blue-700",
    VENDOR: "border-slate-200 text-slate-600",
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
})

function formatDate(value: string | Date | null) {
    if (!value) return "—"

    const parsed = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(parsed.getTime())) return "—"
    return dateFormatter.format(parsed)
}

export default function AdminUsersPage() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q") ?? ""
    const [users, setUsers] = useState<VpPortalUserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(initialQuery)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [banTargetId, setBanTargetId] = useState<string | null>(null)
    const [actionUserId, setActionUserId] = useState<string | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        const res = await getVpPortalUsers()
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setUsers(res.data)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])
    useEffect(() => { setSearch(initialQuery) }, [initialQuery])

    const selectedUser = users.find((user) => user.id === selectedUserId) ?? null
    const banTargetUser = users.find((user) => user.id === banTargetId) ?? null
    const canManageSelectedUser = selectedUser
        ? canManageUserBan(session?.user?.role, session?.user?.id, selectedUser.role, selectedUser.id)
        : false

    const normalizedQuery = search.trim().toLowerCase()
    const filteredUsers = normalizedQuery
        ? users.filter((u) =>
            [
                u.id,
                u.name,
                u.email,
                u.role,
                u.vendorName,
                u.vendorId,
                u.phone,
                u.companyId,
                u.banReason,
                ...u.providers,
            ]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(normalizedQuery)),
        )
        : users

    const handleBan = async (reason: string) => {
        if (!banTargetUser) return

        setActionUserId(banTargetUser.id)
        const res = await banVpPortalUser({
            userId: banTargetUser.id,
            banReason: reason,
        })

        if (!res.success) {
            toast.error(res.error)
            setActionUserId(null)
            return
        }

        toast.success(res.message ?? "User banned successfully")
        setBanTargetId(null)
        await load()
        setActionUserId(null)
    }

    const handleUnban = async (user: VpPortalUserRow) => {
        const confirmed = window.confirm(`Unban ${user.name}? They will regain portal access.`)
        if (!confirmed) return

        setActionUserId(user.id)
        const res = await unbanVpPortalUser({ userId: user.id })

        if (!res.success) {
            toast.error(res.error)
            setActionUserId(null)
            return
        }

        toast.success(res.message ?? "User unbanned successfully")
        await load()
        setActionUserId(null)
    }

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
                    placeholder="Search name, email, role, vendor, phone, provider or ID..."
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
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((u) => {
                                const canManageUser = canManageUserBan(
                                    session?.user?.role,
                                    session?.user?.id,
                                    u.role,
                                    u.id,
                                )

                                return (
                                    <TableRow key={u.id}>
                                    <TableCell className="font-medium text-sm">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-9">
                                                <AvatarImage src={u.image ?? undefined} alt={u.name} />
                                                <AvatarFallback>{u.name.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p>{u.name}</p>
                                                <p className="font-mono text-[11px] text-muted-foreground">{u.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        <div className="space-y-1">
                                            <p>{u.email}</p>
                                            <p className="text-xs">
                                                {u.emailVerified ? "Verified" : "Not verified"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={roleStyles[u.role] ?? "border-slate-200 text-slate-600"}
                                        >
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="space-y-1">
                                            <p>{u.vendorName ?? <span className="text-muted-foreground">—</span>}</p>
                                            <p className="font-mono text-[11px] text-muted-foreground">
                                                {u.vendorId ?? "No vendor linked"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {formatDate(u.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <VpStatusBadge status={u.banned ? "INACTIVE" : "ACTIVE"} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedUserId(u.id)}
                                            >
                                                Details
                                            </Button>
                                            {canManageUser && (
                                                <Button
                                                    size="sm"
                                                    variant={u.banned ? "outline" : "destructive"}
                                                    disabled={actionUserId === u.id}
                                                    onClick={() => (u.banned ? handleUnban(u) : setBanTargetId(u.id))}
                                                >
                                                    {actionUserId === u.id
                                                        ? "Please wait..."
                                                        : u.banned
                                                            ? "Unban"
                                                            : "Ban"}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            <VpUserDetailsSheet
                open={Boolean(selectedUser)}
                user={selectedUser}
                currentUserId={session?.user?.id}
                canManageBan={canManageSelectedUser}
                actionPending={selectedUser ? actionUserId === selectedUser.id : false}
                onOpenChange={(open) => !open && setSelectedUserId(null)}
                onBan={(user) => setBanTargetId(user.id)}
                onUnban={handleUnban}
            />

            <VpUserBanDialog
                isOpen={Boolean(banTargetUser)}
                userName={banTargetUser?.name ?? ""}
                isPending={banTargetUser ? actionUserId === banTargetUser.id : false}
                onClose={() => setBanTargetId(null)}
                onConfirm={handleBan}
            />
        </div>
    )
}
