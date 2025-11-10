
// // "use client"

// // import { useEffect, useState } from "react"
// // import { useRouter } from "next/navigation"
// // import { Button } from "@/components/ui/button"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { Delete, Eye, Search } from "lucide-react"
// //  import { Separator } from "@/components/ui/separator"
// // import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
// // import { LazyDate } from "@/components/lazzy-date"
// // import { toast } from "sonner"
// // import { IconTrash } from "@tabler/icons-react"
// // import UploadAnnexureExtractor from "../_components/annexure/upload-annexure-extractor"

// // export default function AnnexureListPage() {
// //     const [annexures, setAnnexures] = useState<any[]>([])
// //     const [filtered, setFiltered] = useState<any[]>([])
// //     const [search, setSearch] = useState("")
// //     const router = useRouter()

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             const res = await fetch("/api/lorries/annexures")
// //             const data = await res.json()
// //             setAnnexures(data)
// //             setFiltered(data)
// //         }
// //         fetchData()
// //     }, [])

// //     useEffect(() => {
// //         const q = search.toLowerCase()
// //         setFiltered(
// //             annexures.filter(
// //                 (a) =>
// //                     a.name.toLowerCase().includes(q) ||
// //                     new Date(a.fromDate).toLocaleDateString().includes(q) ||
// //                     new Date(a.toDate).toLocaleDateString().includes(q)
// //             )
// //         )
// //     }, [search, annexures])


// //     const handleDeleteAnnexure = async (id: string) => {
// //         if (!confirm("Are you sure you want to delete this annexure? This will unlink all associated LRs.")) {
// //             return
// //         }

// //         try {
// //             const res = await fetch(`/api/lorries/annexures/${id}/delete`, { method: "DELETE" })
// //             const data = await res.json()

// //             if (!res.ok) throw new Error(data.error || "Failed to delete annexure")

// //             toast.success(`Annexure deleted. ${data.unlinkedCount} LRs unlinked.`)
// //             // Redirect to Annexure list or wherever appropriate
// //         } catch (err: any) {
// //             console.error(err)
// //             toast.error(err.message || "Unexpected error occurred")
// //         }
// //     }
// //     return (

// //         <div className="p-6">

// //             <div className="flex items-center justify-between">


// //                 <InputGroup className="md:max-w-lg w-full  mb-4">
// //                     <InputGroupInput placeholder="Search by name or date..."
// //                         value={search}
// //                         onChange={(e) => setSearch(e.target.value)}
// //                     />
// //                     <InputGroupAddon>
// //                         <Search />
// //                     </InputGroupAddon>
// //                     <InputGroupAddon align="inline-end">{filtered.length}</InputGroupAddon>
// //                 </InputGroup>

// //                 <div className=' flex items-center justify-between mb-4'>

// //                     <h2 className=' mb-2 font-medium text-md'></h2>
// //                     <UploadAnnexureExtractor />

// //                 </div>
// //             </div>
// //             <Separator />



// //             <div className="overflow-x-auto">
// //                 <Table>
// //                     <TableHeader>
// //                         <TableRow>
// //                             <TableHead>Name</TableHead>
// //                             <TableHead>From Date</TableHead>
// //                             <TableHead>To Date</TableHead>
// //                             <TableHead>Total LRs</TableHead>
// //                             <TableHead className="text-center">Action</TableHead>
// //                         </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                         {filtered.length > 0 ? (
// //                             filtered.map((annexure) => (
// //                                 <TableRow key={annexure.id}>
// //                                     <TableCell className="font-medium">{annexure.name}</TableCell>
// //                                     <TableCell>
// //                                         <LazyDate date={annexure.fromDate} />
// //                                      </TableCell>
// //                                     <TableCell>
// //                                         <LazyDate date={annexure.toDate} />

// //                                      </TableCell>
// //                                     <TableCell>{annexure._count.LRRequest}</TableCell>
// //                                     <TableCell className="text-center">
// //                                         <div className=" space-x-4">

// //                                             <Button
// //                                                 variant="link"
// //                                                 size="icon-sm"
// //                                                 className="gap-1 bg-primary/10"
// //                                                 onClick={() => router.push(`/lorries/annexure/${annexure.id}`)}
// //                                             >
// //                                                 <Eye size={16} />
// //                                             </Button>
// //                                             <Button
// //                                                 variant="ghost"
// //                                                 size={"icon-sm"}
// //                                                 className=" bg-destructive/10"
// //                                                 onClick={() => handleDeleteAnnexure(annexure.id)}
// //                                             >
// //                                                 <IconTrash size={16} className="text-red-500" />
// //                                             </Button>
// //                                         </div>

// //                                     </TableCell>

// //                                 </TableRow>
// //                             ))
// //                         ) : (
// //                             <TableRow>
// //                                 <TableCell colSpan={5} className="text-center text-muted-foreground">
// //                                     No annexures found
// //                                 </TableCell>
// //                             </TableRow>
// //                         )}
// //                     </TableBody>
// //                 </Table>
// //             </div>

// //         </div>
// //     )
// // }


// "use client"

// import { useEffect, useState } from "react"
//  import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
// import { Download, FileSearch } from "lucide-react"
// import { downloadCsv } from "@/lib/annexure-utils"
// import Link from "next/link"
// import { toast } from "sonner"
// import UploadAnnexureExtractor from "../_components/annexure/upload-annexure-extractor"

// export default function AnnexurePage() {
//   const [validatedFiles, setValidatedFiles] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)

//   const fetchValidatedFiles = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch("/api/lorries/annexures/list")
//       const data = await res.json()
//       if (res.ok) setValidatedFiles(data.files || [])
//     } catch (e) {
//       console.error(e)
//       toast.error("Failed to load validated annexures")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchValidatedFiles()
//   }, [])

//   const handleCSVDownload = () => {
//     if (!validatedFiles?.length) return toast.info("No validation data found")
//     downloadCsv(validatedFiles)
//   }

//   return (
//     <div className="space-y-6 p-6">
//       <Card className="border shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold">Upload & Validate Annexure</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <UploadAnnexureExtractor />
//         </CardContent>
//       </Card>

//       <Card className="border shadow-sm">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-lg font-semibold flex items-center gap-2">
//             <FileSearch className="w-4 h-4" /> Validated Annexures
//           </CardTitle>
//           <Button variant="outline" size="sm" onClick={handleCSVDownload}>
//             <Download className="w-4 h-4 mr-1" /> Download Validation Report
//           </Button>
//         </CardHeader>

//         <CardContent>
//           {validatedFiles.length === 0 ? (
//             <p className="text-sm text-muted-foreground">No validated annexures yet.</p>
//           ) : (
//             <div className="rounded-md border overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>File Number</TableHead>
//                     <TableHead>Total LRs</TableHead>
//                     <TableHead>Validated</TableHead>
//                     <TableHead>Extra Cost</TableHead>
//                     <TableHead>POD</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {validatedFiles.map((f) => (
//                     <TableRow key={f.fileNumber}>
//                       <TableCell className="font-medium">{f.fileNumber}</TableCell>
//                       <TableCell>{f.totalLRs}</TableCell>
//                       <TableCell>
//                         <span className="text-green-600 font-semibold">{f.validLRs}</span>
//                       </TableCell>
//                       <TableCell>
//                         {f.extraCostMissing?.length ? (
//                           <span className="text-red-500">{f.extraCostMissing.length} Missing</span>
//                         ) : (
//                           "OK"
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {f.podMissing?.length ? (
//                           <span className="text-yellow-600">{f.podMissing.length} Missing</span>
//                         ) : (
//                           "Available"
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Link href={`/lorries/annexure/${f.fileNumber}`}>
//                           <Button size="sm" variant="secondary">View Details</Button>
//                         </Link>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Search, Eye, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import UploadAnnexureExtractor from "../_components/annexure/upload-annexure-extractor"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function AnnexureListPage() {
  const [annexures, setAnnexures] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch("/api/lorries/annexures")
    const data = await res.json()
    setAnnexures(data)
    setFiltered(data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      annexures.filter(a =>
        a.name.toLowerCase().includes(q) ||
        new Date(a.fromDate).toLocaleDateString().includes(q)
      )
    )
  }, [search, annexures])

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/lorries/annexures/${id}/delete`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) return toast.error(data.error)
    toast.success(`Deleted successfully. ${data.unlinkedCount} LRs unlinked.`)
    fetchData()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <InputGroup className="md:max-w-lg w-full">
          <InputGroupInput
            placeholder="Search by name or date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <InputGroupAddon><Search /></InputGroupAddon>
          <InputGroupAddon align="inline-end">{filtered.length}</InputGroupAddon>
        </InputGroup>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}><RefreshCw size={16} /></Button>
          <UploadAnnexureExtractor />
        </div>
      </div>

      <Separator />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>From Date</TableHead>
              <TableHead>To Date</TableHead>
              <TableHead>Total LRs</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading…</TableCell></TableRow>
            ) : filtered.length ? (
              filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{new Date(a.fromDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(a.toDate).toLocaleDateString()}</TableCell>
                  <TableCell>{a._count.LRRequest}</TableCell>
                  <TableCell className="text-center flex justify-center gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/lorries/annexure/${a.id}`)}
                      className="bg-primary/10"
                    >
                      <Eye size={16} />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="bg-destructive/10"><Trash2 size={16} /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Annexure</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove all associated LRs. Continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(a.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No annexures found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
