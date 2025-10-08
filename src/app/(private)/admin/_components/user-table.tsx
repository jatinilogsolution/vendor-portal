'use client'

import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
    id: string
    name: string
    email: string
    role: string
    image?: string | null
    createdAt: Date | string
}

interface UserTableProps {
    users: User[]
}

export function UserTable({ users }: UserTableProps) {
    const router = useRouter()

    const handleRowClick = (userId: string) => {
        router.push(`/profile/${encodeURIComponent(userId)}`)
    }

    return (
        <div className="   ">
            <Table className="max-w-7xl mx-auto">
                <TableHeader className=" bg-foreground/10 ">
                    <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow
                                key={user.id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleRowClick(user.id)}
                            >
                                <TableCell>
                                    <Avatar className="size-8">
                                        <AvatarImage
                                            src={user.image ?? "/placeholder.svg?height=48&width=48"}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                // .join("")
                                                // .toUpperCase()
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{user.role}</Badge>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {new Date(user.createdAt).toISOString().split("T")[0]}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}