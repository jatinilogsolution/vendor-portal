// 'use client'

// import { useRouter } from "next/navigation"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// interface User {
//     id: string
//     name: string
//     email: string
//     role: string
//     image?: string | null
//     createdAt: Date | string
// }

// interface UserTableProps {
//     users: User[]
// }

// export function UserTable({ users }: UserTableProps) {
//     const router = useRouter()

//     const handleRowClick = (userId: string) => {
//         router.push(`/profile/${encodeURIComponent(userId)}`)
//     }

//     return (
//         <div className="   ">
//             <Table className="max-w-7xl mx-auto">
//                 <TableHeader className=" bg-foreground/10 ">
//                     <TableRow>
//                         <TableHead>Avatar</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Email</TableHead>
//                         <TableHead>Role</TableHead>
//                         <TableHead className="text-right">Created</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {users.length === 0 ? (
//                         <TableRow>
//                             <TableCell colSpan={5} className="text-center text-muted-foreground">
//                                 No users found
//                             </TableCell>
//                         </TableRow>
//                     ) : (
//                         users.map((user) => (
//                             <TableRow
//                                 key={user.id}
//                                 className="cursor-pointer hover:bg-muted/50 transition-colors"
//                                 onClick={() => handleRowClick(user.id)}
//                             >
//                                 <TableCell>
//                                     <Avatar className="size-8">
//                                         <AvatarImage
//                                             src={user.image ?? "/placeholder.svg?height=48&width=48"}
//                                             alt={user.name}
//                                         />
//                                         <AvatarFallback>
//                                             {user.name
//                                                 .split(" ")
//                                                 .map((n) => n[0])
//                                                 // .join("")
//                                                 // .toUpperCase()
//                                             }
//                                         </AvatarFallback>
//                                     </Avatar>
//                                 </TableCell>
//                                 <TableCell className="font-medium">{user.name}</TableCell>
//                                 <TableCell className="text-muted-foreground">{user.email}</TableCell>
//                                 <TableCell>
//                                     <Badge variant="secondary">{user.role}</Badge>
//                                 </TableCell>
//                                 <TableCell className="text-right text-muted-foreground">
//                                     {new Date(user.createdAt).toISOString().split("T")[0]}
//                                 </TableCell>
//                             </TableRow>
//                         ))
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     )
// }

'use client'

import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

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

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'default'
      case 'vendor':
        return 'secondary'
      case 'user':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="w-full  ">
      <div className="bg-card border border-border/20  overflow-hidden">
        <Table role="grid" aria-label="User list table">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-muted/30">
              <TableHead className="w-16">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/20 transition-colors duration-200"
                  onClick={() => handleRowClick(user.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleRowClick(user.id)}
                >
                  <TableCell className="py-3">
                    <Avatar className="size-10 ring-1 ring-border/30">
                      <AvatarImage
                        src={user.image ?? '/placeholder.svg?height=100&width=100'}
                        alt={user.name}
                        className="object-contain"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-foreground truncate max-w-[200px]" title={user.name}>
                    {user.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-[250px]" title={user.email}>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs font-medium">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}