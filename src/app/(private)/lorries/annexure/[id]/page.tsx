// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
//  import { toast } from "sonner"
// import Link from "next/link"
// import { ArrowLeft } from "lucide-react"
// import UploadExtraAttachment from "../../_components/annexure/upload-extra-attachment"

// export default function AnnexureDetailPage() {
//   const { id } = useParams() as { id: string }
//   const [data, setData] = useState()
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`/api/lorries/annexures/${id}`)
//         const result = await res.json()
//         if (res.ok) setData(result)
//         else throw new Error(result.message || "Failed to fetch annexure")
//       } catch (e: any) {
//         toast.error(e.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [id])

//   if (loading) return <p className="p-6 text-sm">Loading annexure details...</p>
//   if (!data) return <p className="p-6 text-sm text-muted-foreground">No data found for this file.</p>

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <Link href="/lorries/annexure">
//           <Button variant="ghost" size="sm">
//             <ArrowLeft className="mr-1 w-4 h-4" /> Back
//           </Button>
//         </Link>
//         <h2 className="text-lg font-semibold">File Number: {id}</h2>
//       </div>

//       <Card className="border shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-md font-semibold">Annexure Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>LR Number</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Vehicle</TableHead>
//                   <TableHead>Origin</TableHead>
//                   <TableHead>Destination</TableHead>
//                   <TableHead>Freight Cost</TableHead>
//                   <TableHead>Extra Cost</TableHead>
//                   <TableHead>POD</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {data.lrRequests?.map((lr: any) => (
//                   <TableRow key={lr.id}>
//                     <TableCell>{lr.LRNumber}</TableCell>
//                     <TableCell>{lr.CustomerName}</TableCell>
//                     <TableCell>{lr.vehicleNo}</TableCell>
//                     <TableCell>{lr.origin}</TableCell>
//                     <TableCell>{lr.destination}</TableCell>
//                     <TableCell>{lr.freightCost}</TableCell>
//                     <TableCell>
//                       {lr.extraCost
//                         ? `₹${lr.extraCost}`
//                         : <span className="text-red-500">Missing</span>}
//                     </TableCell>
//                     <TableCell>
//                       {lr.podUrl ? (
//                         <a href={lr.podUrl} target="_blank" className="text-blue-600 underline">
//                           View
//                         </a>
//                       ) : (
//                         <span className="text-yellow-600">Not uploaded</span>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <UploadExtraAttachment fileNumber={id} lrNumber={lr.} />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function AnnexurePage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/lorries/annexures/${id}`)
      const json = await res.json()
      if (!res.ok) return toast.error(json.error)
      setData(json)
      setFiltered(json.annexure?.LRRequest ?? [])
    }
    fetchData()
  }, [id])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      data?.annexure?.LRRequest?.filter(
        (lr: any) =>
          lr.LRNumber?.toLowerCase().includes(q) ||
          lr.vehicleNo?.toLowerCase().includes(q) ||
          lr.fileNumber?.toLowerCase().includes(q)
      ) ?? []
    )
  }, [search, data])

  if (!data) return <p className="p-6">Loading annexure details…</p>

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{data.annexure.name}</h2>

      <InputGroup className="md:max-w-lg w-full mb-4">
        <InputGroupInput
          placeholder="Search by LR number or vehicle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupAddon align="inline-end">{filtered.length}</InputGroupAddon>
      </InputGroup>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>LR Number</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>File No</TableHead>
              <TableHead>Extra Cost</TableHead>
              <TableHead>POD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lr, i) => (
              <TableRow key={i}>
                <TableCell>{lr.LRNumber}</TableCell>
                <TableCell>{lr.vehicleNo}</TableCell>
                <TableCell>{lr.CustomerName}</TableCell>
                <TableCell>{lr.origin}</TableCell>
                <TableCell>{lr.destination}</TableCell>
                <TableCell>{lr.fileNumber}</TableCell>
                <TableCell>
                  {lr.extraCost
                    ? <Badge variant="secondary">₹{lr.extraCost}</Badge>
                    : <Badge variant="outline">0</Badge>}
                </TableCell>
                <TableCell>
                  {lr.podlink
                    ? <a href={lr.podlink} target="_blank" className="text-blue-600 underline">View</a>
                    : <Badge variant="destructive">Missing</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
