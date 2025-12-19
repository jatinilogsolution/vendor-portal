// src/app/(private)/lorries/annexure/[id]/page.tsx
"use client"

import { useEffect, useState, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Package,
  AlertTriangle,
  FileCheck,
  Receipt,
  Download,
  Lock,
  Plus,
  Edit
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UploadPod } from "../../_components/upload-pod"
import TableLoader from "@/components/table-loader"
import { usePageTitle } from "@/stores/usePageTitle"
import { useAnnexureStore } from "@/stores/useAnnexureStore"
import { SettlePrice } from "../../_components/settle-price"
import { BackToPage } from "@/components/back-to-page"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { setLrPrice } from "../../_action/lorry"
import { useSession } from "@/lib/auth-client"
import { UserRoleEnum } from "@/utils/constant"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

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
  tvendor?: { name: string; id: string }
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
  vendorId?: string
}

export default function AnnexureDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const session = useSession()
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setTitle } = usePageTitle()
  const { details: data, loadAnnexure } = useAnnexureStore()

  // Authorization checks
  const role = session.data?.user?.role
  const userId = session.data?.user?.id

  const isAdmin = role !== undefined && role !== null &&
    [UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(role as UserRoleEnum)
  const isVendor = role === UserRoleEnum.TVENDOR

  // Check if user can edit this annexure
  const canEdit = useMemo(() => {
    if (!data) return false
    if (data.isInvoiced) return false // Cannot edit if invoiced
    if (isAdmin) return false // Admins view only
    if (isVendor) return true // Vendors can edit their annexures in draft
    return false
  }, [data, isAdmin, isVendor])

  // Check if there are missing LRs
  const hasMissingLRs = useMemo(() => {
    return data?.missingLRsPerFile && data.missingLRsPerFile.length > 0
  }, [data])

  // Get list of file numbers with missing LRs
  const incompleteFileNumbers = useMemo(() => {
    if (!data?.missingLRsPerFile) return new Set<string>()
    return new Set(data.missingLRsPerFile.map(f => f.fileNumber))
  }, [data])

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

  useEffect(() => {
    if (!session.data) {
      session.refetch()
    }
  }, [])

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

  // Handle submit annexure
  const handleSubmit = async () => {
    if (hasMissingLRs) {
      toast.error("Cannot submit: Please add all missing LRs first")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch("/api/lorries/annexures/submit", {
        method: "POST",
        body: JSON.stringify({ annexureId: id }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || "Something went wrong")
        return
      }

      toast.success(`Invoice Generated: ${result.invoice.refernceNumber}`)
      fetchData() // Refresh to show invoiced state

      router.push(`/invoices/${result.invoice?.id}`)

    } catch (err) {
      toast.error("Unexpected error while submitting annexure")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <div className="flex items-center gap-2">
              {/* Download CSV Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!data?.groups) return

                  // Build CSV content
                  const headers = ["File Number", "LR Number", "Customer", "Vehicle No", "Vehicle Type", "Origin", "Destination", "Out Date", "LR Price", "Extra Cost", "POD Link"]
                  const rows: string[][] = []

                  data.groups.forEach((group: any) => {
                    group.LRs.forEach((lr: any) => {
                      rows.push([
                        group.fileNumber || "",
                        lr.LRNumber || "",
                        lr.CustomerName || "",
                        lr.vehicleNo || "",
                        lr.vehicleType || "",
                        lr.origin || "",
                        lr.destination || "",
                        lr.outDate ? new Date(lr.outDate).toLocaleDateString("en-IN") : "",
                        String(lr.lrPrice || 0),
                        String(lr.extraCost || 0),
                        lr.podlink || ""
                      ])
                    })
                  })

                  const csvContent = [
                    headers.join(","),
                    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
                  ].join("\n")

                  // Create and download file
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement("a")
                  link.setAttribute("href", url)
                  link.setAttribute("download", `${data.name || "annexure"}_${new Date().toISOString().split("T")[0]}.csv`)
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  URL.revokeObjectURL(url)

                  toast.success("Annexure data downloaded as CSV")
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>

              {/* Edit Button - Only show if can edit */}
              {canEdit && !data.isInvoiced && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/lorries/annexure/${id}/edit`)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Annexure
                </Button>
              )}

              {/* Submit Button - Only show if not invoiced and can edit */}
              {!data.isInvoiced && canEdit && (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || hasMissingLRs}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Submitting...
                    </>
                  ) : hasMissingLRs ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Add Missing LRs First
                    </>
                  ) : (
                    "Submit Annexure"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Invoice Status Banner */}
          {data.isInvoiced && data.invoiceDetails && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <FileCheck className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700 dark:text-green-400">Invoice Generated</AlertTitle>
              <AlertDescription className="text-green-600 dark:text-green-300">
                <div className="flex items-center gap-4 mt-1">
                  <span><strong>Ref:</strong> {data.invoiceDetails.refernceNumber}</span>
                  {data.invoiceDetails.invoiceNumber && <span><strong>Invoice #:</strong> {data.invoiceDetails.invoiceNumber}</span>}
                  <span><strong>Status:</strong> {data.invoiceDetails.status}</span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Missing LRs Warning - Now blocking */}
          {hasMissingLRs && !data.isInvoiced && (
            <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Missing LRs - Submission Blocked
              </AlertTitle>
              <AlertDescription className="text-red-600 dark:text-red-300">
                <p className="mb-2">You must add all LRs from each file before submitting. The following files are incomplete:</p>
                <div className="mt-2 space-y-1">
                  {data.missingLRsPerFile?.map((file: { fileNumber: string; missing: string[]; total: number }) => (
                    <div key={file.fileNumber} className="text-sm flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">{file.fileNumber}</Badge>
                      <span>{file.missing.length} of {file.total} LRs missing</span>
                      <span className="text-xs text-muted-foreground">({file.missing.join(", ")})</span>
                    </div>
                  ))}
                </div>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2 border-red-400 text-red-700 hover:bg-red-100"
                    onClick={() => router.push(`/lorries/annexure/${id}/edit`)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Missing LRs
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

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

        {/* <Separator  /> */}

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center ">
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

            // Check if this file has missing LRs
            const isIncomplete = incompleteFileNumbers.has(group.fileNumber)

            return (
              <Card key={group.id} className={`gap-0 py-0 overflow-hidden hover:shadow-lg transition-shadow ${isIncomplete ? 'border-red-300 bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                {/* Group Header */}
                <div className={`bg-linear-to-r from-primary/5 via-primary/10 to-background border-b p-4 ${isIncomplete ? 'bg-red-100/50 dark:bg-red-900/20' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={isIncomplete ? "destructive" : "secondary"} className="text-sm px-3 py-1">
                          <FileText className="w-3 h-3 mr-1" />
                          {group.fileNumber}
                          {isIncomplete && <Lock className="w-3 h-3 ml-1" />}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          <Truck className="w-3 h-3 mr-1" />
                          {isIncomplete ? "**" : group.LRs[0]?.vehicleNo}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          {isIncomplete ? "**" : (group.LRs[0]?.vehicleType || "N/A")}
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          {group.LRs.length} LRs
                        </Badge>
                        {isIncomplete && (
                          <Badge variant="destructive" className="text-xs">
                            Incomplete File
                          </Badge>
                        )}
                      </div>

                    </div>

                    <div className="flex flex-wrap gap-3 text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Freight:</span>
                        <span>{isIncomplete ? "**" : `₹${totalFreight.toLocaleString()}`}</span>
                      </div>
                      <Separator orientation="vertical" className="h-5" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Extra:</span>
                        <span>
                          {isIncomplete ? (
                            "**"
                          ) : (
                            <SettlePrice disbleCost={true} fileNumber={group.fileNumber} vehicle={group.LRs[0]?.vehicleNo} extraCost={group.LRs?.[0].extraCost} label="+ Extra" mode={data.isInvoiced ? "view" : "edit"} settlePrice={totalFreight} />
                          )}
                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-5" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-bold text-primary">
                          {isIncomplete ? "**" : `₹${(group.totalPrice || 0).toLocaleString()}`}
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
                          className={`hover:bg-muted/20 transition-colors ${isIncomplete ? 'blur-sm select-none pointer-events-none' : ''}`}
                        >
                          <TableCell className="font-mono font-medium">
                            {isIncomplete ? "******" : lr.LRNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            {isIncomplete ? "******" : lr.CustomerName}
                          </TableCell>
                          <TableCell>{isIncomplete ? "**" : lr.origin}</TableCell>
                          <TableCell>{isIncomplete ? "**" : lr.destination}</TableCell>
                          <TableCell>
                            {isIncomplete ? "**" : (lr.outDate
                              ? new Date(lr.outDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })
                              : "-")}
                          </TableCell>

                          <TableCell className="text-right font-medium">
                            {isIncomplete ? (
                              <span className="text-sm">**</span>
                            ) : data.isInvoiced ? (
                              <span className="text-sm">₹{(lr.lrPrice || 0).toLocaleString()}</span>
                            ) : (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();

                                  const form = e.currentTarget;
                                  const input = form.querySelector("input");
                                  const rawValue = input?.value ?? "0";
                                  const lrPrice = Number(rawValue.replace(/,/g, ""));

                                  if (form.dataset.submitting === "true") return;
                                  form.dataset.submitting = "true";
                                  if (lr.lrPrice === lrPrice) {
                                    return
                                  }
                                  try {
                                    await setLrPrice({
                                      lrNumber: lr.LRNumber as any,
                                      lrPrice,
                                    });

                                    toast.success(`Price for LR ${lr.LRNumber} updated successfully.`);
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
                                          h-8 w-16 border-transparent bg-primary border text-right 
                                          shadow-none focus-visible:border "
                                />
                              </form>
                            )}
                          </TableCell>
                          {/* <TableCell className="text-right font-medium">
                            ₹{(lr.extraCost || 0).toLocaleString()}
                          </TableCell> */}
                          <TableCell className=" text-right">
                            {isIncomplete ? (
                              <span className="text-sm text-muted-foreground">**</span>
                            ) : (
                              <UploadPod
                                LrNumber={lr.LRNumber as any}
                                customer={lr.CustomerName as any}
                                fileNumber={lr.fileNumber}
                                initialFileUrl={lr.podlink!}
                                vendor={group.LRs[0]?.tvendor?.name!}
                                whId={lr.origin as any}
                                readOnly={data.isInvoiced}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Add Missing LRs for incomplete files */}
                {isIncomplete && canEdit && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">This file is incomplete. Add all LRs to view details.</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-red-400 text-red-700 hover:bg-red-100"
                      onClick={() => router.push(`/lorries/annexure/${id}/edit`)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Missing LRs
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}