"use client"
import { LazyDate } from "@/components/lazzy-date"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { getLRInfo } from "../_action/lorry"
import { UploadPod } from "./upload-pod"

type LRData = Awaited<ReturnType<typeof getLRInfo>>["data"]  

export const LRForFileNumber = ({ data }: { data: LRData }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
        <p className="text-sm font-medium">No LR records found.</p>
      </div>
    )
  }

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentData = data.slice(startIndex, startIndex + rowsPerPage)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="max-h-[40rem] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[120px]">LR</TableHead>
              {/* <TableHead>Vendor</TableHead> */}
              <TableHead>Vehicle</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Out Date</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.map((i) => (
              <TableRow
                key={i.LRNumber}
                className="hover:bg-muted/20 transition-colors duration-150"
              >
                <TableCell className="font-medium">{i.LRNumber}</TableCell>
                {/* <TableCell>{i.tvendor?.name || "—"}</TableCell> */}
                <TableCell>
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{i.vehicleNo || "—"}</span>
                    <span className="text-xs text-muted-foreground">{i.vehicleType || "—"}</span>
                  </div>
                </TableCell>
                <TableCell>{i.origin || "—"}</TableCell>
                <TableCell>{i.destination || "—"}</TableCell>
                <TableCell>
                  <LazyDate date={i.outDate.toString()} />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <UploadPod
                    LrNumber={i.LRNumber}
                    customer={i.CustomerName || ""}
                    vendor={i.tvendor?.name || ""}
                    initialFileUrl={i.podlink || null}
                    fileNumber={i.fileNumber}
                    whId={(i as any).whId || ""}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}–
          {Math.min(startIndex + rowsPerPage, data.length)} of {data.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}