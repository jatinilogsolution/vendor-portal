
"use client"

import { useState, forwardRef, useImperativeHandle, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, ExternalLink, FileText, Calendar } from "lucide-react"
import { LRRequest, Vendor } from "@/generated/prisma/client"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface PodTableProps {
  data: (LRRequest & { warehouseName: string; tvendor: Vendor })[]
  allData?: (LRRequest & { warehouseName: string; tvendor: Vendor })[] // For global search
}

export interface PodTableRef {
  setStatusFilter: (value: string) => void
  setInvoiceFilter: (value: string) => void
}

export const PodTable = forwardRef<PodTableRef, PodTableProps>(({ data, allData }, ref) => {
  const [searchInput, setSearchInput] = useState("") // Raw input
  const [searchTerm, setSearchTerm] = useState("") // Debounced search term
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [invoiceFilter, setInvoiceFilter] = useState<string>("all")
  const pageSize = 10

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput)
      setCurrentPage(1) // Reset to page 1 when search changes
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchInput])

  // Expose filter setters to parent via ref
  useImperativeHandle(ref, () => ({
    setStatusFilter: (value: string) => {
      setStatusFilter(value)
      setCurrentPage(1)
    },
    setInvoiceFilter: (value: string) => {
      setInvoiceFilter(value)
      setCurrentPage(1)
    }
  }))

  // Use allData for searching if available, otherwise use data
  const searchableData = allData || data

  // Create a Map for faster lookup of display data IDs
  const displayDataIds = useMemo(() => {
    if (!allData) return null
    return new Set(data.map(d => d.id))
  }, [data, allData])

  // Memoize filtered data - only recalculate when dependencies change
  const filteredData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase()
    const hasSearch = searchLower.length > 0

    return searchableData.filter((item) => {
      // Skip search check if no search term
      if (hasSearch) {
        const statusText = item.status === 'VERIFIED' ? 'verified' :
          item.status === 'WRONG' ? 'wrong rejected' :
            'pending'

        const invoiceText = item.invoiceId ? 'invoiced' : 'not invoiced'

        const matchesSearch = (
          item.CustomerName?.toLowerCase().includes(searchLower) ||
          item.LRNumber.toLowerCase().includes(searchLower) ||
          item.fileNumber.toLowerCase().includes(searchLower) ||
          item.vehicleNo?.toLowerCase().includes(searchLower) ||
          item.origin?.toLowerCase().includes(searchLower) ||
          item.destination?.toLowerCase().includes(searchLower) ||
          statusText.includes(searchLower) ||
          invoiceText.includes(searchLower)
        )

        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "verified" && item.status !== "VERIFIED") return false
        if (statusFilter === "pending" && item.status && item.status !== "PENDING") return false
        if (statusFilter === "wrong" && item.status !== "WRONG") return false
      }

      // Invoice filter
      if (invoiceFilter !== "all") {
        if (invoiceFilter === "invoiced" && !item.invoiceId) return false
        if (invoiceFilter === "not-invoiced" && item.invoiceId) return false
      }

      // If searching globally, only include items in display data
      if (displayDataIds && !displayDataIds.has(item.id)) return false

      return true
    })
  }, [searchableData, searchTerm, statusFilter, invoiceFilter, displayDataIds])

  // Memoize grouped data
  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const fileNumber = item.fileNumber
      if (!acc[fileNumber]) acc[fileNumber] = []
      acc[fileNumber].push(item)
      return acc
    }, {} as Record<string, (LRRequest & { warehouseName: string; tvendor: Vendor })[]>)
  }, [filteredData])

  const allGroups = useMemo(() => Object.entries(groupedData), [groupedData])

  // Memoize pagination calculations
  const { totalPages, paginatedGroups } = useMemo(() => {
    const total = Math.ceil(allGroups.length / pageSize)
    const paginated = allGroups.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
    return { totalPages: total, paginatedGroups: paginated }
  }, [allGroups, currentPage, pageSize])

  const formatDate = useCallback((dateString: string | Date) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy")
    } catch {
      return "Invalid date"
    }
  }, [])

  const getStatusVariant = useCallback((status: string | null | undefined) => {
    if (status === "VERIFIED") return "default"
    if (status === "WRONG") return "destructive"
    return "secondary"
  }, [])

  const getStatusLabel = useCallback((status: string | null | undefined) => {
    if (status === "VERIFIED") return "Verified"
    if (status === "WRONG") return "Wrong"
    return "Pending"
  }, [])

  const handleStatusFilterClick = useCallback((filter: string) => {
    setStatusFilter(filter)
    setCurrentPage(1)
  }, [])

  const handleInvoiceFilterClick = useCallback((filter: string) => {
    setInvoiceFilter(filter)
    setCurrentPage(1)
  }, [])

  return (
    <div className="space-y-3">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-muted-foreground">Filter by Status:</span>
        <Button
          size="sm"
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => handleStatusFilterClick("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "verified" ? "default" : "outline"}
          onClick={() => handleStatusFilterClick("verified")}
          className={statusFilter === "verified" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Verified
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => handleStatusFilterClick("pending")}
          className={statusFilter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
        >
          Pending
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "wrong" ? "default" : "outline"}
          onClick={() => handleStatusFilterClick("wrong")}
          className={statusFilter === "wrong" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Wrong
        </Button>

        <span className="text-sm font-medium text-muted-foreground ml-4">Invoice Status:</span>
        <Button
          size="sm"
          variant={invoiceFilter === "all" ? "default" : "outline"}
          onClick={() => handleInvoiceFilterClick("all")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={invoiceFilter === "invoiced" ? "default" : "outline"}
          onClick={() => handleInvoiceFilterClick("invoiced")}
          className={invoiceFilter === "invoiced" ? "bg-purple-600 hover:bg-purple-700" : ""}
        >
          Invoiced
        </Button>
        <Button
          size="sm"
          variant={invoiceFilter === "not-invoiced" ? "default" : "outline"}
          onClick={() => handleInvoiceFilterClick("not-invoiced")}
        >
          Not Invoiced
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <InputGroup className=" ">
          <InputGroupAddon>
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search by customer, LR, file, status (verified/pending/wrong), invoice status..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <InputGroupAddon align="inline-end"> {filteredData.length} {filteredData.length === 1 ? "record" : "records"}</InputGroupAddon>

        </InputGroup>

      </div>


      {paginatedGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-3">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No results found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or date filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {paginatedGroups.map(([fileNumber, items]) => (
            <AccordionItem
              key={fileNumber}
              value={fileNumber}
              className="rounded-lg bg-card overflow-hidden"
            >
              <AccordionTrigger
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 rounded-md bg-card hover:bg-muted/40 transition-colors hover:no-underline"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <Link href={`/pod/${fileNumber}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                      <code className="text-sm font-mono font-semibold text-primary px-2 py-1 rounded-md bg-primary/10">
                        {fileNumber}
                      </code>
                    </Link>

                    {/* Status Counts */}
                    <div className="flex items-center gap-1.5">
                      {items.filter(i => i.status === 'VERIFIED').length > 0 && (
                        <Badge variant="default" className="px-2 py-0 text-xs bg-green-500 hover:bg-green-600">
                          ✓ {items.filter(i => i.status === 'VERIFIED').length}
                        </Badge>
                      )}
                      {items.filter(i => !i.status || i.status === 'PENDING').length > 0 && (
                        <Badge variant="secondary" className="px-2 py-0 text-xs bg-yellow-500/20 text-yellow-700">
                          ⏳ {items.filter(i => !i.status || i.status === 'PENDING').length}
                        </Badge>
                      )}
                      {items.filter(i => i.status === 'WRONG').length > 0 && (
                        <Badge variant="destructive" className="px-2 py-0 text-xs">
                          ✗ {items.filter(i => i.status === 'WRONG').length}
                        </Badge>
                      )}
                    </div>

                    {/* Invoice/Annexure Indicators */}
                    <div className="flex items-center gap-1.5">
                      {(items[0] as any).Invoice && (
                        <Badge variant="outline" className="px-2 py-0 text-xs border-purple-500 text-purple-700">
                          Invoice: {(items[0] as any).Invoice.refernceNumber}
                        </Badge>
                      )}
                      {(items[0] as any).Annexure && (
                        <Badge variant="outline" className="px-2 py-0 text-xs border-cyan-500 text-cyan-700">
                          Annexure: {(items[0] as any).Annexure.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <p className="text-xs font-mono text-muted-foreground">
                      {items[0].tvendor?.name || "-"}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {items.length} {items.length === 1 ? "LR" : "LRs"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(items[0].outDate)}</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">LR Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead className="text-center">POD</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <code className="text-sm font-mono bg-muted px-3 py-1 rounded-md w-fit">
                              {item.LRNumber}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(item.status)} className="text-xs">
                              {getStatusLabel(item.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {item.CustomerName || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.warehouseName} → {item.destination}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.podlink ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Link
                                  href={item.podlink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 text-primary hover:text-primary/80" />
                                </Link>
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}


      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 mt-4">
          {/* Previous Button */}
          <Button
            size="sm"
            variant="link"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {(() => {
              const pages: (number | string)[] = []
              const maxVisible = 8

              if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) pages.push(i)
              } else {
                const showLeftDots = currentPage > 4
                const showRightDots = currentPage < totalPages - 3

                pages.push(1)

                if (showLeftDots) pages.push("...")

                const start = Math.max(2, currentPage - 2)
                const end = Math.min(totalPages - 1, currentPage + 2)

                for (let i = start; i <= end; i++) {
                  pages.push(i)
                }

                if (showRightDots) pages.push("...")

                pages.push(totalPages)
              }

              return pages.map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="px-2 ">
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === currentPage ? "default" : "secondary"}
                    onClick={() => setCurrentPage(p as number)}
                  >
                    {p}
                  </Button>
                )
              )
            })()}
          </div>

          {/* Next Button */}
          <Button
            size="sm"
            variant="link"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}

    </div>
  )
})

PodTable.displayName = "PodTable"
