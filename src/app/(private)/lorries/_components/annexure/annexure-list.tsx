// // app/lorries/annexure/components/AnnexureList.tsx

// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { TableRow, TableCell } from "@/components/ui/table"
// import { Eye, Trash2, Search } from "lucide-react"
// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { Annexure } from "../../_action/annexure"

// interface AnnexureListProps {
//   filtered: Annexure[]
//   loading: boolean
//   handleDelete: (id: string) => void
// }

// export default function AnnexureList({ filtered, loading, handleDelete }: AnnexureListProps) {
//   if (loading) {
//     return (
//       <>
//         {Array.from({ length: 5 }).map((_, i) => (
//           <TableRow key={i}>
//             <TableCell><Skeleton className="h-4 w-32" /></TableCell>
//             <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//             <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//             <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
//             <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
//             <TableCell className="text-right">
//               <div className="flex justify-end gap-1">
//                 <Skeleton className="h-8 w-8 rounded-md" />
//                 <Skeleton className="h-8 w-8 rounded-md" />
//               </div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </>
//     )
//   }

//   if (!filtered.length) {
//     return (
//       <TableRow>
//         <TableCell colSpan={6} className="text-center py-12">
//           <div className="flex flex-col items-center gap-2 text-muted-foreground">
//             <Search className="h-10 w-10 text-muted-foreground/50" />
//             <p className="text-lg font-medium">No annexures found</p>
//             <p className="text-sm">Try adjusting your search query</p>
//           </div>
//         </TableCell>
//       </TableRow>
//     )
//   }

//   return (
//     <>
//       {filtered.map((a) => (
//         <TableRow key={a.id} className="hover:bg-muted/50 transition-colors">
//           <TableCell className="font-medium">{a.name}</TableCell>
//           <TableCell>{new Date(a.fromDate).toLocaleDateString()}</TableCell>
//           <TableCell>{new Date(a.toDate).toLocaleDateString()}</TableCell>
//           <TableCell className="text-center font-mono text-sm">{a._count?.LRRequest ?? 0}</TableCell>
//           <TableCell className="text-center font-mono text-sm">{a.groups?.length ?? 0}</TableCell>
//           <TableCell className="flex justify-center items-center gap-4">
//             <Link href={`/lorries/annexure/${a.id}`}>
//               <Button variant="default" size="icon" className="h-8 w-8">
//                 <Eye className="h-4 w-4" />
//               </Button>
//             </Link>
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant="destructive" size="icon" className="h-8 w-8 hover:text-destructive">
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Delete Annexure?</AlertDialogTitle>
//                   <p className="text-sm text-muted-foreground">
//                     This will unlink all associated LRs. This action cannot be undone.
//                   </p>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={() => handleDelete(a.id)}
//                     className="bg-destructive/50 text-destructive-foreground hover:bg-destructive/90"
//                   >
//                     Delete
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </TableCell>
//         </TableRow>
//       ))}
//     </>
//   )
// }

// app/lorries/annexure/components/AnnexureList.tsx

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TableRow, TableCell } from "@/components/ui/table"
import { Eye, Trash2, Search, Pencil, FileCheck, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Annexure } from "../../_action/annexure"
import { WorkflowStatusBadge } from "@/components/modules/workflow/workflow-status-badge"
import { useSession } from "@/lib/auth-client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AnnexureListProps {
  filtered: Annexure[]
  loading: boolean
  handleDelete: (id: string) => void
  isAdmin?: boolean
}

export default function AnnexureList({ filtered, loading, handleDelete, isAdmin = false }: AnnexureListProps) {
  const { data: session } = useSession()
  const role = session?.user?.role

  if (loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            {isAdmin && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-8 w-24 mx-auto" /></TableCell>
            <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
            <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </>
    )
  }

  if (!filtered.length) {
    return (
      <TableRow>
        <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-12">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Search className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-lg font-medium">No annexures found</p>
            <p className="text-sm">Try adjusting your search query</p>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TooltipProvider>
      {filtered.map((a) => (
        <TableRow key={a.id} className="hover:bg-muted/50 transition-colors">
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="max-w-[180px] truncate cursor-help">{a.name}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{a.name}</p>
                </TooltipContent>
              </Tooltip>
              {a.isInvoiced && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                  <FileCheck className="h-3 w-3 mr-1" />
                  {a.invoiceDetails?.refernceNumber || "Invoiced"}
                </Badge>
              )}
            </div>
          </TableCell>

          {/* Vendor column - only for admin */}
          {isAdmin && (
            <TableCell>
              {(a as any).vendor?.name ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 cursor-help">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate max-w-[150px]">{(a as any).vendor.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{(a as any).vendor.name}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </TableCell>
          )}

          <TableCell>{new Date(a.fromDate).toLocaleDateString()}</TableCell>
          <TableCell>{new Date(a.toDate).toLocaleDateString()}</TableCell>
          
          <TableCell className="text-center">
            <WorkflowStatusBadge status={a.status || "DRAFT"} type="annexure" role={role as string} />
          </TableCell>

          <TableCell className="text-center font-mono text-sm">{a._count?.LRRequest ?? 0}</TableCell>
          <TableCell className="text-center font-mono text-sm">{a.groups?.length ?? 0}</TableCell>

          <TableCell className="flex justify-center items-center gap-4">

            {/* VIEW */}
            <Link href={`/lorries/annexure/${a.id}`}>
              <Button variant="default" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            {/* EDIT - Only show if not invoiced */}
            {!a.isInvoiced && (
              <Link href={`/lorries/annexure/${a.id}/edit`}>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* DELETE - Only show if not invoiced */}
            {!a.isInvoiced && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="h-8 w-8 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Annexure?</AlertDialogTitle>
                    <p className="text-sm text-muted-foreground">
                      This will unlink all associated LRs. This action cannot be undone.
                    </p>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(a.id)}
                      className="bg-destructive/50 text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TooltipProvider>
  )
}



