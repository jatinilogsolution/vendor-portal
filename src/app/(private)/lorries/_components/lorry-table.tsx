/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Search, Eye, Calendar, FileText } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { debounce } from "lodash"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { LazyDate } from "@/components/lazzy-date"
import { getAllLRforVendorById } from "../../profile/_action/getVendor"
import { generateSingleInvoiceFromLorryPage } from "../../invoices/_action/invoice"
import { useUserCheck } from "@/hooks/useRoleCheck"

interface Lorry {
  LRNumber: string
  outDate: string
  vehicleNo: string
  origin: string
  vehicleType: string
  destination: string
  tvendorName: string
  fileNumber: string
  podLink?: string
}

interface LorryTableProps {
  vendorId?: string
  limit?: number
  pod?: boolean
  refernceNo?: string
  setOpen?: () => void
  height?: number
}

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_TIME = 500
const SKELETON_ROWS = PAGE_SIZE

const TableSkeletonLoader = () => (
  <>
    {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
      <TableRow key={`skeleton-${index}`} className="animate-pulse">
        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
        <TableCell><Skeleton className="h-8 w-20" /></TableCell>
      </TableRow>
    ))}
  </>
)

const LorryTable: React.FC<LorryTableProps> = ({ vendorId, limit = PAGE_SIZE, pod = false, refernceNo, setOpen }) => {
  const [data, setData] = useState<Lorry[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [querySearch, setQuerySearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")


  // store actual selected files across pages
  const [selectedFilesData, setSelectedFilesData] = useState<Record<string, Lorry[]>>({})

  const { roleCheck } = useUserCheck()
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = Number(searchParams.get("page")) || 1

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  const startIndex = Math.min((page - 1) * limit + 1, totalItems)
  const endIndex = Math.min(page * limit, totalItems)

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuerySearch(value)
        setPage(1)
      }, SEARCH_DEBOUNCE_TIME),
    []
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchTerm(value)
      debouncedSetQuery(value)
    },
    [debouncedSetQuery]
  )

  useEffect(() => () => debouncedSetQuery.cancel(), [debouncedSetQuery])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllLRforVendorById({
        vendorId,
        page,
        limit,
        search: querySearch,
        fromDate,
        toDate,
        pod
      })

      const formattedData: Lorry[] = res.data.map((item: any) => ({
        LRNumber: item.LRNumber,
        outDate: item.outDate,
        vehicleNo: item.vehicleNo,
        origin: item.origin,
        vehicleType: item.vehicleType,
        destination: item.destination || "",
        tvendorName: item.tvendor?.name || "-",
        fileNumber: item.fileNumber,
        podLink: item.podlink || "",
      }))

      setData(formattedData)
      setTotalPages(res.totalPages || 1)
      setTotalItems(res.totalItems || 0)

      if (querySearch && formattedData.length === 0) {
        toast.info(`No results found for "${querySearch}"`)
      }
    } catch (err) {
      console.error("Error fetching lorry receipts:", err)
      toast.error("Failed to fetch lorry receipts. Please try again.")
      setData([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [vendorId, page, querySearch, limit, fromDate, toDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const groupedData = useMemo(() => {
    return data.reduce((acc, curr) => {
      if (!acc[curr.fileNumber]) acc[curr.fileNumber] = []
      acc[curr.fileNumber].push(curr)
      return acc
    }, {} as Record<string, Lorry[]>)
  }, [data])

  // toggle selection of files, persist across pages
  const toggleFileSelection = useCallback(
    (fileNumber: string) => {
      setSelectedFilesData((prev) => {
        if (prev[fileNumber]) {
          const newData = { ...prev }
          delete newData[fileNumber]
          return newData
        } else if (groupedData[fileNumber]) {
          return { ...prev, [fileNumber]: groupedData[fileNumber] }
        }
        return prev
      })
    },
    [groupedData]
  )

  const handleGenerateInvoice =  async () => {
    const filesWithoutPods = Object.entries(selectedFilesData)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, lrs]) => lrs.some((lr) => !lr.podLink))
      .map(([fileNo]) => fileNo)

    if (filesWithoutPods.length > 0) {
      toast.error(`Cannot generate invoice. Files without POD: ${filesWithoutPods.join(", ")}`)
      return
    }

    const invoiceData = Object.entries(selectedFilesData).map(([fileNo, lrs]) => ({
      fileNumber: fileNo,
      LRs: lrs.map((lr) => ({
        LRNumber: lr.LRNumber,
        vehicleNo: lr.vehicleNo,
        vehicleType: lr.vehicleType,
        origin: lr.origin,
        destination: lr.destination,
        vendorId: vendorId,
      })),
    }))


    const { error } = await generateSingleInvoiceFromLorryPage(invoiceData, refernceNo ?? "")
    if (error) {
      toast.error(error)
    }
    // if (!refernceNo) {

    //   router.push(`/invoices/${reference?.id}`)
    // } else  {
    //   setOpen!()
    // }

    toast.success(`Invoice generated for ${Object.keys(selectedFilesData).length} file(s)!`)
    // console.log("Invoice Data:", invoiceData)
  } 

  const handleClearDates = useCallback(() => {
    setFromDate("")
    setToDate("")
    setPage(1)
  }, [])

  const handleViewPod = useCallback((e: React.MouseEvent, podLink: string) => {
    e.stopPropagation()
    if (podLink) {
      window.open(podLink, "_blank", "noopener,noreferrer")
    }
  }, [])



  const hasActiveFilters = searchTerm || fromDate || toDate

  return (
    <div className="space-y-4 relative">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by LR No, Vehicle, Warehouse, or Vendor..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value)
                  setPage(1)
                }}
                className="pl-8 w-[150px]"
              />
            </div>
            <span className="text-muted-foreground text-sm">to</span>
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value)
                  setPage(1)
                }}
                className="pl-8 w-[150px]"
              />
            </div>
            {(fromDate || toDate) && (
              <Button variant="ghost" size="sm" onClick={handleClearDates} className="text-xs">
                Clear
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active filters:</span>
            {searchTerm && <span className="px-2 py-1 bg-muted rounded-md">{searchTerm}</span>}
            {fromDate && <span className="px-2 py-1 bg-muted rounded-md">From: {fromDate}</span>}
            {toDate && <span className="px-2 py-1 bg-muted rounded-md">To: {toDate}</span>}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className={`overflow-auto  max-h-[45rem]`}>
          <Table>
            <TableHeader className="sticky top-0 bg-accent backdrop-blur-sm z-10">
              <TableRow>
                <TableHead className="w-12"><span className="sr-only">Select</span></TableHead>
                <TableHead className="font-semibold">LR Number</TableHead>
                <TableHead className="font-semibold">Vendor</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Origin</TableHead>
                <TableHead className="font-semibold">Destination</TableHead>
                <TableHead className="font-semibold text-center">POD</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableSkeletonLoader />
              ) : Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(([fileNo, records]) => {
                  const isSelected = !!selectedFilesData[fileNo]
                  const hasMissingPods = records.some((r) => !r.podLink)

                  return (
                    <React.Fragment key={fileNo}>
                      <TableRow className="bg-muted/40 hover:bg-muted/60 border transition-colors">
                        <TableCell className="py-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleFileSelection(fileNo)}
                          />
                        </TableCell>
                        <TableCell colSpan={6} className="font-semibold py-3">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span>File: {fileNo}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground font-normal">
                              <span>Vehicle: {records[0].vehicleNo}</span>
                              <span className="text-xs px-2 py-0.5 bg-background rounded-md">{records[0].vehicleType}</span>
                            </div>
                            <span className="text-sm text-muted-foreground font-normal">
                              {records.length} LR{records.length > 1 ? "s" : ""}
                            </span>
                            {hasMissingPods && (
                              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                                Missing POD
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {records.map((lr) => (
                        <TableRow
                          key={lr.LRNumber}
                          onClick={() => {
                            if (!pod) {
                              router.push(`/lorries/${lr.fileNumber}`);
                            }
                          }}
                          className="cursor-pointer hover:bg-muted/30 transition-colors"
                        >
                          <TableCell></TableCell>
                          <TableCell className="font-medium">{lr.LRNumber}</TableCell>
                          <TableCell>{lr.tvendorName}</TableCell>
                          <TableCell><LazyDate date={lr.outDate} /></TableCell>
                          <TableCell>{lr.origin}</TableCell>
                          <TableCell>{lr.destination}</TableCell>
                          <TableCell className="text-center">
                            {lr.podLink ? (
                              <Button variant="outline" size="sm" onClick={(e) => handleViewPod(e, lr.podLink!)} className="gap-1">
                                <Eye className="w-3.5 h-3.5" /> View
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">No POD</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="w-12 h-12 opacity-20" />
                      <p className="font-medium">No lorry receipts found</p>
                      {hasActiveFilters && <p className="text-sm">Try adjusting your filters</p>}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination & Invoice */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          {totalItems > 0
            ? `Showing ${startIndex}–${endIndex} of ${totalItems} result${totalItems !== 1 ? "s" : ""}`
            : "No results to display"}
        </div>

        <div className="flex items-center gap-3 order-1 sm:order-2">

          {roleCheck("TVENDOR") && <Button
            onClick={handleGenerateInvoice}
            disabled={Object.keys(selectedFilesData).length === 0}
            className="gap-2"
            size="sm"
          >
            <FileText className="w-4 h-4" />
            {pod ? `Add (${Object.keys(selectedFilesData).length})` : `Generate BCN (${Object.keys(selectedFilesData).length})`}
          </Button>
          }

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm min-w-[100px] text-center">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LorryTable
