// src/app/(private)/lorries/annexure/[id]/page.tsx
"use client"

import { useEffect, useState, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  Search,
  ArrowLeft,
  FileText,
  Truck,
  IndianRupee,
  MapPin,
  Calendar,
  Package
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { UploadPod } from "../../_components/upload-pod"
import TableLoader from "@/components/table-loader"
import { usePageTitle } from "@/stores/usePageTitle"
import { useAnnexureStore } from "@/stores/useAnnexureStore"
import { SettlePrice } from "../../_components/settle-price"
import { BackToPage } from "@/components/back-to-page"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { setLrPrice } from "../../_action/lorry"
import { useRouter } from "next/navigation"
import SubmitAnnexure from "../../_components/annexure/submit-annexure"

interface LR {
  id: string
  LRNumber: string
  vehicleNo?: string
  vehicleType?: string
  CustomerName: string
  origin: string
  destination: string
  outDate: string | null
  lrPrice: number
  extraCost: number
  podlink?: string
  fileNumber: string
  tvendor?: { name: string }
}

interface Group {
  id: string
  fileNumber: string
  extraCost: number
  totalPrice: number
  LRs: LR[]
}

interface AnnexureData {
  name: string
  groups: Group[]
}

export default function AnnexureDetailPage() {
  const { id } = useParams() as { id: string }
  // const [data, setData] = useState<AnnexureData | null>(null)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { setTitle } = usePageTitle()
  const router = useRouter()
  const { details: data, loadAnnexure } = useAnnexureStore()


  const fetchData = async () => {
    try {
      const data = await loadAnnexure(id)
      setTitle(data.name || "Annexure")
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])
  const filteredGroups = useMemo(() => {
    if (!data?.groups) return []
    if (!search) return data.groups

    const q = search.toLowerCase()
    return data.groups.filter((group) =>
      group.fileNumber.toLowerCase().includes(q) ||
      group.LRs.some(
        (lr: { LRNumber: string; vehicleNo: string; vehicleType: string; CustomerName: string; origin: string; destination: string }) =>
          lr.LRNumber.toLowerCase().includes(q) ||
          lr.vehicleNo?.toLowerCase().includes(q) ||
          lr.vehicleType?.toLowerCase().includes(q) ||
          lr.CustomerName.toLowerCase().includes(q) ||
          lr.origin.toLowerCase().includes(q) ||
          lr.destination.toLowerCase().includes(q)
      )
    )
  }, [search, data])

  // Calculate totals
  const stats = useMemo(() => {
    if (!data?.groups) return { totalFiles: 0, totalLRs: 0, totalFreight: 0, totalExtra: 0, grandTotal: 0 }

    return data.groups.reduce((acc, group) => {
      const groupFreight = group.LRs.reduce((sum: any, lr: { lrPrice: any }) => sum + (lr.lrPrice || 0), 0)
      return {
        totalFiles: acc.totalFiles + 1,
        totalLRs: acc.totalLRs + group.LRs.length,
        totalFreight: acc.totalFreight + groupFreight,
        totalExtra: acc.totalExtra + (group.LRs?.[0].extraCost || 0),
        grandTotal: acc.grandTotal + (group.totalPrice || 0)
      }
    }, { totalFiles: 0, totalLRs: 0, totalFreight: 0, totalExtra: 0, grandTotal: 0 })
  }, [data])

  if (isLoading) return <TableLoader />

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto ">
        {/* Header Section */}
        <div className="space-y-4">

          <div className=" flex items-center justify-between">

            <BackToPage title="Back to annexure" location="/lorries/annexure" />
            <SubmitAnnexure annexureId={id} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-medium">Files</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-medium">LRs</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalLRs}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs font-medium">Freight</span>
                </div>
                <p className="text-xl font-bold">₹{stats.totalFreight.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs font-medium">Extra</span>
                </div>
                <p className="text-xl font-bold">₹{stats.totalExtra.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-xs font-medium">Total</span>
                </div>
                <p className="text-xl font-bold text-primary">₹{stats.grandTotal.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 my-2">
            <InputGroup className=" w-full">
              <InputGroupInput
                placeholder="Search LR, file, vehicle, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon>
                <Search className="w-4 h-4" />
              </InputGroupAddon>

            </InputGroup>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium text-muted-foreground">No results found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}

        {/* Group Cards */}
        <div className="space-y-6">
          {filteredGroups.map((group) => {
            const totalFreight = group.LRs.reduce(
              (sum: any, lr: { lrPrice: any }) => sum + (lr.lrPrice || 0),
              0
            )

            return (
              <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Group Header */}
                <div className="bg-linear-to-r from-primary/5 via-primary/10 to-background border-b p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          <FileText className="w-3 h-3 mr-1" />
                          {group.fileNumber}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          <Truck className="w-3 h-3 mr-1" />
                          {group.LRs[0]?.vehicleNo}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          {group.LRs[0]?.vehicleType || "N/A"}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          {group.LRs.length} LRs
                        </Badge>
                      </div>
                      {group.LRs[0]?.tvendor?.name && (
                        <p className="text-sm text-muted-foreground">
                          Vendor: <span className="font-medium">{group.LRs[0].tvendor.name}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Freight:</span>
                        <span>₹{totalFreight.toLocaleString()}</span>
                      </div>
                      <Separator orientation="vertical" className="h-5" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Extra:</span>
                        <span>


                          <SettlePrice fileNumber={group.fileNumber} vehicle={group.LRs[0]?.vehicleNo} extraCost={group.LRs?.[0].extraCost} label="+ Extra" mode="edit" settlePrice={totalFreight} />

                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-5" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-bold text-primary">
                          ₹{(group.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LR Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">LR Number</TableHead>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Origin
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Destination
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Out Date
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-right">Freight</TableHead>
                        {/* <TableHead className="font-semibold text-right">Extra</TableHead> */}
                        <TableHead className="font-semibold text-right pr-10">POD</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.LRs.map((lr: { id: Key | null | undefined; LRNumber: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; CustomerName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; origin: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; destination: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; outDate: string | number | Date; lrPrice: any; extraCost: any; fileNumber: string; podlink: string | null }) => (
                        <TableRow
                          key={lr.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <TableCell className="font-mono font-medium">
                            {lr.LRNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            {lr.CustomerName}
                          </TableCell>
                          <TableCell>{lr.origin}</TableCell>
                          <TableCell>{lr.destination}</TableCell>
                          <TableCell>
                            {lr.outDate
                              ? new Date(lr.outDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })
                              : "-"}
                          </TableCell>
                          {/* <TableCell className="text-right font-medium">
                            ₹{(lr.lrPrice || 0).toLocaleString()}
                          </TableCell> */}
                          <TableCell className="text-right font-medium">
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();

                                const form = e.currentTarget;
                                const input = form.querySelector("input");
                                const rawValue = input?.value ?? "0";
                                const lrPrice = Number(rawValue.replace(/,/g, ""));

                                if (form.dataset.submitting === "true") return;
                                form.dataset.submitting = "true";

                                try {
                                  await setLrPrice({
                                    lrNumber: lr.LRNumber as any,
                                    lrPrice,
                                  });

                                  toast.success(`Price for LR ${lr.LRNumber} updated successfully.`);
                                  // await loadAnnexure(id);          // <-- refresh whole page
                                  // await fetchData()
                                  // router.refresh()
                                  window.location.replace(`/lorries/annexure/${id}`)
                                } catch (err) {
                                  console.error(err);
                                  toast.error(`Failed to update price for LR ${lr.LRNumber}.`);
                                } finally {
                                  form.dataset.submitting = "false";
                                }
                              }}
                            >
                              <Label htmlFor={`${lr.LRNumber}-limit`} className="sr-only">
                                Freight
                              </Label>

                              <Input
                                id={`${lr.LRNumber}-limit`}
                                name="lrPrice"
                                defaultValue={(lr.lrPrice || 0).toLocaleString()}
                                onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                                className="hover:bg-input/30 focus-visible:bg-background 
                 dark:hover:bg-input/30 dark:focus-visible:bg-input/30
                 h-8 w-16 border-transparent bg-transparent text-right 
                 shadow-none focus-visible:border dark:bg-transparent"
                              />
                            </form>
                          </TableCell>
                          {/* <TableCell className="text-right font-medium">
                            ₹{(lr.extraCost || 0).toLocaleString()}
                          </TableCell> */}
                          <TableCell className=" text-right">
                            <UploadPod
                              LrNumber={lr.LRNumber as any}
                              customer={lr.CustomerName as any}
                              fileNumber={lr.fileNumber}
                              initialFileUrl={lr.podlink!}
                              vendor={group.LRs[0]?.tvendor?.name!}
                              whId={lr.origin as any}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}