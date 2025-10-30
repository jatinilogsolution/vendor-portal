
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, ExternalLink, FileText, Calendar } from "lucide-react"
import { LRRequest, Vendor } from "@/generated/prisma"
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
}

export function PodTable({ data }: PodTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10 // number of accordion items per page

  // Filter
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      item.CustomerName?.toLowerCase().includes(searchLower) ||
      item.LRNumber.toLowerCase().includes(searchLower) ||
      item.fileNumber.toLowerCase().includes(searchLower) ||
      item.vehicleNo?.toLowerCase().includes(searchLower) ||
      item.origin?.toLowerCase().includes(searchLower) ||
      item.destination?.toLowerCase().includes(searchLower)
    )
  })

  // Group by fileNumber
  const groupedData = filteredData.reduce((acc, item) => {
    const fileNumber = item.fileNumber
    if (!acc[fileNumber]) acc[fileNumber] = []
    acc[fileNumber].push(item)
    return acc
  }, {} as Record<string, (LRRequest & { warehouseName: string; tvendor: Vendor })[]>)

  const allGroups = Object.entries(groupedData)


  const totalPages = Math.ceil(allGroups.length / pageSize)
  const paginatedGroups = allGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const formatDate = (dateString: string | Date) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy")
    } catch {
      return "Invalid date"
    }
  }

  const getStatusVariant = (status: string | null | undefined) => {
    if (status === "APPROVED") return "default"
    if (status === "MISMATCHED") return "destructive"
    return "secondary"
  }

  const getStatusLabel = (status: string | null | undefined) => {
    if (status === "APPROVED") return "Approved"
    if (status === "MISMATCHED") return "Mismatched"
    return "Pending"
  }

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <InputGroup className=" ">
          <InputGroupAddon>
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search by customer, LR number, file number, vehicle..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
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
                  "flex items-center justify-between w-full px-4 py-2.5 rounded-md bg-card hover:bg-muted/40 transition-colors hover:no-underline"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <Link href={`/pod/${fileNumber}`} className="hover:underline">
                      <code className="text-sm font-mono font-semibold text-primary px-2 py-1 rounded-md bg-primary/10">
                        {fileNumber}
                      </code>
                    </Link>
                    <Badge variant={getStatusVariant(items[0].status)} className="px-3 py-1">
                      {getStatusLabel(items[0].status)}
                    </Badge>
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

              {/* Table inside accordion */}
              <AccordionContent className="px-2 pb-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">LR Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>POD</TableHead>
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
                          <TableCell className="text-sm font-medium">
                            {item.CustomerName || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.warehouseName} → {item.destination}
                          </TableCell>
                          <TableCell>
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
                // Show all if pages <= 8
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
}
