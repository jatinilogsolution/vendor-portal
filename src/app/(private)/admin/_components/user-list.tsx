
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
 
 import { headers } from "next/headers"
import { auth } from "@/lib/auth"
 
import { UserTable } from "./user-table"

// Mock types - replace with your actual types
enum UserRoleEnum {
    BOSS = "BOSS",
    ADMIN = "ADMIN",
    TADMIN = "TADMIN",
    VENDOR = "VENDOR",
    TVENDOR = "TVENDOR",
}


interface UserListProps {
    page?: number
    name?: string
    pageSize?: number
}



export async function UserList({
    page = 1,
    name = "",
    pageSize = 10,
    user,
}: UserListProps & { user: { id: string; role: UserRoleEnum } }) {
    const offset = (page - 1) * pageSize

    const { users, total } = await auth.api.listUsers({
        headers: await headers(),
        query: {
            sortBy: 'name',
            filterField: 'name',
            filterValue: name,
            limit: pageSize,
            filterOperator: "contains",
            offset,
        },
    });

    const filteredUsers = users.filter((u) => {
        // Only exclude the user if their id matches and their role matches as well
        if (u.id === user.id && u.role === user.role) return false

        if (user.role === UserRoleEnum.TADMIN) {
            return u.role === UserRoleEnum.TVENDOR
        } else if (user.role === UserRoleEnum.ADMIN) {
            return u.role === UserRoleEnum.VENDOR
        } else {
            return u.role !== UserRoleEnum.BOSS
        }
    })

    const totalPages = Math.ceil(total / pageSize)

    // Helper function to generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = []

        for (let i = 1; i <= totalPages; i++) {
            if (i <= 3 || i > totalPages - 3 || (i >= page - 1 && i <= page + 1)) {
                pages.push(i)
            } else if ((i === page - 2 && page > 4) || (i === page + 2 && page < totalPages - 3)) {
                if (pages[pages.length - 1] !== "ellipsis") {
                    pages.push("ellipsis")
                }
            }
        }

        return pages
    }

    return (
        <div className="space-y-4">
            <UserTable users={filteredUsers as any} />


            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={page > 1 ? `?page=${page - 1}&name=${encodeURIComponent(name)}` : undefined}
                                aria-disabled={page <= 1}
                                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {getPageNumbers().map((pageNum, idx) => {
                            if (pageNum === "ellipsis") {
                                return (
                                    <PaginationItem key={`ellipsis-${idx}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )
                            }

                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        href={`?page=${pageNum}&name=${encodeURIComponent(name)}`}
                                        isActive={pageNum === page}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href={page < totalPages ? `?page=${page + 1}&name=${encodeURIComponent(name)}` : undefined}
                                aria-disabled={page >= totalPages}
                                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}
