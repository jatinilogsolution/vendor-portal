// 'use client'

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import UserRoleBadge from "./user-badge"

// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
//   image?: string | null
//   Vendor?: { name: string | null }
//   banned?: boolean
// }

// export default function UserTable({ users }: { users: User[] }) {
//   // Define role order
//   const rolePriority: Record<string, number> = {
//     BOSS: 1,
//     TADMIN: 2,
//     TVENDOR: 3,
//     ADMIN: 4,
//     VENDOR: 5,
//   }

//   // Sort users according to the priority
//   const sortedUsers = [...users].sort((a, b) => {
//     const rankA = rolePriority[a.role] ?? 999
//     const rankB = rolePriority[b.role] ?? 999
//     return rankA - rankB
//   })

//   return (
//     <div className=" border ">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>User</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Vendor</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Status</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {sortedUsers.length ? (
//             sortedUsers.map((user) => (
//               <TableRow key={user.id}>
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <Avatar>
//                       <AvatarImage src={user.image || ''} />
//                       <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <div className="font-medium">{user.name}</div>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.Vendor?.name || '—'}</TableCell>
//                 <TableCell><UserRoleBadge role={user.role} /></TableCell>
//                 <TableCell>
//                   {user.banned ? (
//                     <span className="text-red-500 font-medium">Banned</span>
//                   ) : (
//                     <span className="text-green-600 font-medium">Active</span>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                 No users found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }


'use client'

import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import UserRoleBadge from "./user-badge"

interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
  Vendor?: { name: string | null }
  banned?: boolean
}

export default function UserTable({ users }: { users: User[] }) {
  const router = useRouter()

  const rolePriority: Record<string, number> = {
    BOSS: 1,
    TADMIN: 2,
    TVENDOR: 3,
    ADMIN: 4,
    VENDOR: 5,
  }

  const sortedUsers = [...users].sort((a, b) => {
    const rankA = rolePriority[a.role] ?? 999
    const rankB = rolePriority[b.role] ?? 999
    return rankA - rankB
  })

  return (
    <div className=" border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length ? (
            sortedUsers.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => router.push(`/profile/${user.id}`)}
                className="cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image || ''} />
                      <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.Vendor?.name || '—'}</TableCell>
                <TableCell><UserRoleBadge role={user.role} /></TableCell>
                <TableCell>
                  {user.banned ? (
                    <span className="text-red-500 font-medium">Banned</span>
                  ) : (
                    <span className="text-green-600 font-medium">Active</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
