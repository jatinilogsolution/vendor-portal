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
import { Eye, Trash2, Search, Pencil } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
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

interface AnnexureListProps {
  filtered: Annexure[]
  loading: boolean
  handleDelete: (id: string) => void
}

export default function AnnexureList({ filtered, loading, handleDelete }: AnnexureListProps) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
        <TableCell colSpan={6} className="text-center py-12">
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
    <>
      {filtered.map((a) => (
        <TableRow key={a.id} className="hover:bg-muted/50 transition-colors">
          <TableCell className="font-medium">{a.name}</TableCell>
          <TableCell>{new Date(a.fromDate).toLocaleDateString()}</TableCell>
          <TableCell>{new Date(a.toDate).toLocaleDateString()}</TableCell>
          <TableCell className="text-center font-mono text-sm">{a._count?.LRRequest ?? 0}</TableCell>
          <TableCell className="text-center font-mono text-sm">{a.groups?.length ?? 0}</TableCell>

          <TableCell className="flex justify-center items-center gap-4">

            {/* VIEW */}
            <Link href={`/lorries/annexure/${a.id}`}>
              <Button variant="default" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            {/* EDIT */}
            <Link href={`/lorries/annexure/${a.id}/edit`}>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>

            {/* DELETE */}
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
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}


