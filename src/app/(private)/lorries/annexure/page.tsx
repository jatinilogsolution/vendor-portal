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
