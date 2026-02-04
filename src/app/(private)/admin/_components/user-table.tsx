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

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UserRoleBadge from "./user-badge";
import { admin, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  vendorId?: string | null;
  Vendor?: { name: string | null };
  banned?: boolean;
  banReason?: string | null;
  banExpires?: string | null;
}

import { BanUserDialog } from "./ban-user-dialog";

export default function UserTable({
  users,
  showBannedView = false,
}: {
  users: User[];
  showBannedView?: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = React.useState(false);
  const [isBanning, setIsBanning] = React.useState(false);

  const rolePriority: Record<string, number> = {
    BOSS: 1,
    TADMIN: 2,
    TVENDOR: 3,
    ADMIN: 4,
    VENDOR: 5,
  };

  const sortedUsers = [...users].sort((a, b) => {
    const rankA = rolePriority[a.role] ?? 999;
    const rankB = rolePriority[b.role] ?? 999;
    return rankA - rankB;
  });

  const handleBan = async (reason: string) => {
    if (!selectedUser) return;
    setIsBanning(true);
    try {
      await admin.banUser({
        userId: selectedUser.id,
        banReason: reason,
      });
      toast.success("User banned successfully");
      setIsBanDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to ban user");
    } finally {
      setIsBanning(false);
    }
  };

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
            {showBannedView && <TableHead>Ban Reason</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
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
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>
                        {user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{user.Vendor?.name || "—"}</span>
                    {(currentUser?.role === "BOSS" ||
                      currentUser?.role === "TVENDOR") &&
                      user.vendorId && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          ID: {user.vendorId}
                        </span>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  {user.banned ? (
                    <span className="text-red-500 font-medium">Banned</span>
                  ) : (
                    <span className="text-green-600 font-medium">Active</span>
                  )}
                </TableCell>
                {showBannedView && (
                  <TableCell className="max-w-[200px] truncate">
                    <span className="text-sm text-muted-foreground">
                      {user.banReason || "No reason provided"}
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  {currentUser?.id !== user.id && (
                    <Button
                      variant={user.banned ? "outline" : "destructive"}
                      size="sm"
                      onClick={async (e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (user.banned) {
                          const confirm = window.confirm(
                            `Are you sure you want to unban ${user.name}?`,
                          );
                          if (!confirm) return;
                          try {
                            await admin.unbanUser({ userId: user.id });
                            toast.success("User unbanned successfully");
                            router.refresh();
                          } catch (error) {
                            toast.error("Failed to unban user");
                          }
                        } else {
                          setSelectedUser(user);
                          setIsBanDialogOpen(true);
                        }
                      }}
                    >
                      {user.banned ? "Unban" : "Ban"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={showBannedView ? 7 : 6}
                className="text-center py-8 text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedUser && (
        <BanUserDialog
          userName={selectedUser.name}
          isOpen={isBanDialogOpen}
          onClose={() => setIsBanDialogOpen(false)}
          onConfirm={handleBan}
          isBanning={isBanning}
        />
      )}
    </div>
  );
}
