// // 'use client'

// // import { useEffect, useState } from "react"
// // import Link from "next/link"
// // import { Button } from "@/components/ui/button"
// // import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
// // import { Eye, RefreshCw, Search, Trash2, Upload, FileText } from "lucide-react"
// // import { toast } from "sonner"
// // import UploadAnnexureExtractor from "../_components/annexure/upload-annexure-extractor"
// // import { Skeleton } from "@/components/ui/skeleton" // Assuming you have Skeleton component
// // import { Separator } from "@/components/ui/separator"

// // interface Annexure {
// //   id: string
// //   name: string
// //   fromDate: string
// //   toDate: string
// //   _count?: { LRRequest: number }
// //   groups?: any[]
// // }

// // export default function AnnexureListPage() {
// //   const [annexures, setAnnexures] = useState<Annexure[]>([])
// //   const [filtered, setFiltered] = useState<Annexure[]>([])
// //   const [loading, setLoading] = useState(false)
// //   const [search, setSearch] = useState("")

// //   const fetchData = async () => {
// //     try {
// //       setLoading(true)
// //       const res = await fetch("/api/lorries/annexures")
// //       const data = await res.json()

// //       const arr = Array.isArray(data)
// //         ? data
// //         : Array.isArray(data.annexures)
// //           ? data.annexures
// //           : []

// //       setAnnexures(arr)
// //       setFiltered(arr)
// //     } catch (err) {
// //       console.error(err)
// //       toast.error("Failed to load annexures")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchData()
// //   }, [])

// //   useEffect(() => {
// //     const q = search.toLowerCase()
// //     const result = annexures.filter(a =>
// //       a.name.toLowerCase().includes(q) ||
// //       new Date(a.fromDate).toLocaleDateString().toLowerCase().includes(q) ||
// //       new Date(a.toDate).toLocaleDateString().toLowerCase().includes(q)
// //     )
// //     setFiltered(result)
// //   }, [search, annexures])

// //   const handleDelete = async (id: string) => {
// //     try {
// //       const res = await fetch(`/api/lorries/annexures/${id}/delete`, { method: "DELETE" })
// //       const data = await res.json()
// //       if (!res.ok) throw new Error(data.error || "Delete failed")
// //       toast.success(`Annexure deleted. ${data.unlinkedCount ?? 0} LRs unlinked.`)
// //       fetchData()
// //     } catch (err: any) {
// //       toast.error(err.message || "Delete failed")
// //     }
// //   }

// //   const hasData = annexures.length > 0
// //   const hasResults = filtered.length > 0

// //   return (
// //     <div className=" px-4 w-full  ">
// //       {/* Header */}
// //       <div className=" flex justify-between items-center">

// //         <div className="relative">
// //           <InputGroup className="w-full min-w-lg">
// //             <InputGroupInput
// //               placeholder="Search by name or date..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="pr-10 w-full"
// //             />
// //             <InputGroupAddon>
// //               <Search className="h-4 w-4" />
// //             </InputGroupAddon>
// //           </InputGroup>
// //           {search && (
// //             <div className="absolute right-2 top-2.5 text-xs text-muted-foreground">
// //               {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
// //             </div>
// //           )}
// //         </div>
// //         <UploadAnnexureExtractor />

// //       </div>
// //       <Separator className=" my-2" />

// //       {/* Search Bar */}


// //       {/* Table Card */}
// //       <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
// //         <Table>
// //           <TableHeader>
// //             <TableRow className="bg-muted/50">
// //               <TableHead className="font-semibold">Name</TableHead>
// //               <TableHead className="font-semibold">From Date</TableHead>
// //               <TableHead className="font-semibold">To Date</TableHead>
// //               <TableHead className="font-semibold text-center">Total LRs</TableHead>
// //               <TableHead className="font-semibold text-center">Groups</TableHead>
// //               <TableHead className="font-semibold text-right">Actions</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {loading ? (
// //               // Loading Skeleton
// //               Array.from({ length: 5 }).map((_, i) => (
// //                 <TableRow key={i}>
// //                   <TableCell><Skeleton className="h-4 w-32" /></TableCell>
// //                   <TableCell><Skeleton className="h-4 w-24" /></TableCell>
// //                   <TableCell><Skeleton className="h-4 w-24" /></TableCell>
// //                   <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
// //                   <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
// //                   <TableCell className="text-right">
// //                     <div className="flex justify-end gap-1">
// //                       <Skeleton className="h-8 w-8 rounded-md" />
// //                       <Skeleton className="h-8 w-8 rounded-md" />
// //                     </div>
// //                   </TableCell>
// //                 </TableRow>
// //               ))
// //             ) : !hasResults ? (
// //               // No Search Results
// //               <TableRow>
// //                 <TableCell colSpan={6} className="text-center py-12">
// //                   <div className="flex flex-col items-center gap-2 text-muted-foreground">
// //                     <Search className="h-10 w-10 text-muted-foreground/50" />
// //                     <p className="text-lg font-medium">No annexures found</p>
// //                     <p className="text-sm">Try adjusting your search query</p>
// //                   </div>
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               // Data Rows
// //               filtered.map((a, index) => (
// //                 <TableRow
// //                   key={a.id}
// //                   className="hover:bg-muted/50 transition-colors cursor-default"
// //                 >
// //                   <TableCell className="font-medium">{a.name}</TableCell>
// //                   <TableCell>{new Date(a.fromDate).toLocaleDateString()}</TableCell>
// //                   <TableCell>{new Date(a.toDate).toLocaleDateString()}</TableCell>
// //                   <TableCell className="text-center font-mono text-sm">
// //                     {a._count?.LRRequest ?? 0}
// //                   </TableCell>
// //                   <TableCell className="text-center font-mono text-sm">
// //                     {a.groups?.length ?? 0}
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex justify-end gap-1">
// //                       <Link href={`/lorries/annexure/${a.id}`}>
// //                         <Button variant="ghost" size="icon" className="h-8 w-8">
// //                           <Eye className="h-4 w-4" />
// //                         </Button>
// //                       </Link>
// //                       <AlertDialog>
// //                         <AlertDialogTrigger asChild>
// //                           <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
// //                             <Trash2 className="h-4 w-4" />
// //                           </Button>
// //                         </AlertDialogTrigger>
// //                         <AlertDialogContent>
// //                           <AlertDialogHeader>
// //                             <AlertDialogTitle>Delete Annexure?</AlertDialogTitle>
// //                             <p className="text-sm text-muted-foreground">
// //                               This will unlink all associated LRs. This action cannot be undone.
// //                             </p>
// //                           </AlertDialogHeader>
// //                           <AlertDialogFooter>
// //                             <AlertDialogCancel>Cancel</AlertDialogCancel>
// //                             <AlertDialogAction
// //                               onClick={() => handleDelete(a.id)}
// //                               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
// //                             >
// //                               Delete
// //                             </AlertDialogAction>
// //                           </AlertDialogFooter>
// //                         </AlertDialogContent>
// //                       </AlertDialog>
// //                     </div>
// //                   </TableCell>
// //                 </TableRow>
// //               ))
// //             )}
// //           </TableBody>
// //         </Table>
// //       </div>
// //     </div>
// //   )
// // }

// // app/lorries/annexure/page.tsx

// "use client"

// import { Separator } from "@/components/ui/separator"
// import { Table, TableHeader, TableHead, TableRow, TableBody } from "@/components/ui/table"
// import { useAnnexures } from "../_hook/useAnnexures"
// import AnnexureHeader from "../_components/annexure/annexure-header"
// import AnnexureList from "../_components/annexure/annexure-list"


// export default function AnnexureListPage() {
//   const { filtered, loading, search, setSearch, handleDelete } = useAnnexures()

//   return (
//     <div className="px-4 w-full">
//       <AnnexureHeader search={search} setSearch={setSearch} resultsCount={filtered.length} />
//       <Separator className="my-2" />


//       <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/50">
//               <TableHead>Name</TableHead>
//               <TableHead>From</TableHead>
//               <TableHead>To</TableHead>
//               <TableHead className="text-center">LRs</TableHead>
//               <TableHead className="text-center">Groups</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             <AnnexureList filtered={filtered} loading={loading} handleDelete={handleDelete} />
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }


'use client'

import { Separator } from "@/components/ui/separator"
import { Table, TableHeader, TableHead, TableRow, TableBody } from "@/components/ui/table"
import { useAnnexures } from "../_hook/useAnnexures"
import AnnexureHeader from "../_components/annexure/annexure-header"
import AnnexureList from "../_components/annexure/annexure-list"
import { useAnnexureValidationContext } from "../_components/annexure/annexure-context"
import AnnexureValidationPanel from "../_components/annexure/annexure-validation-panel"

export default function AnnexureListContent() {
  const { filtered, loading, search, setSearch, handleDelete } = useAnnexures()
  const { validationData } = useAnnexureValidationContext()

  return (
    <div className="px-4 w-full space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <AnnexureHeader search={search} setSearch={setSearch} resultsCount={filtered.length} />

      </div>

      <Separator className="my-2" />

      {/* Annexure Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-center">LRs</TableHead>
              <TableHead className="text-center">Total Transecton</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnnexureList filtered={filtered} loading={loading} handleDelete={handleDelete} />
          </TableBody>
        </Table>
      </div>

      {/* Render Validation Data (if any) */}
      {validationData && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Validated Annexure Preview</h2>
          <AnnexureValidationPanel validationResponse={validationData} />
        </div>
      )}
    </div>
  )
}
