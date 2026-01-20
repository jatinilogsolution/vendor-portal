"use client"

import { Separator } from "@/components/ui/separator"
import { Table, TableHeader, TableHead, TableRow, TableBody } from "@/components/ui/table"
import AnnexureHeader from "../../_components/annexure/annexure-header"
import { useAnnexureValidationContext, AnnexureValidationProvider } from "../../_components/annexure/annexure-context"
import { useAnnexures } from "../../_hook/useAnnexures"
import AnnexureList from "../../_components/annexure/annexure-list"
import AnnexureValidationPanel from "../../_components/annexure/annexure-validation-panel"
import { WorkflowStatsDashboard, getAnnexureStats } from "@/components/modules/workflow/workflow-stats-dashboard"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface AnnexureListContentProps {
    vendorId?: string
    userRole?: string
}

function AnnexureListContentInternal({ vendorId, userRole }: AnnexureListContentProps) {
    const { filtered, loading, search, setSearch, status, setStatus, stats, handleDelete } = useAnnexures(vendorId)
    const { validationData } = useAnnexureValidationContext()

    // If no vendorId, user is admin and should see vendor column
    // But wait, if TVENDOR is logged in, vendorId is passed.
    // If ADMIN is logged in, vendorId is undefined.
    const isAdmin = !vendorId || userRole === "BOSS" || userRole === "TADMIN"

    return (
        <div className="px-4 w-full space-y-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <AnnexureHeader search={search} setSearch={setSearch} resultsCount={filtered.length} />
            </div>

            <WorkflowStatsDashboard
                stats={getAnnexureStats(stats, status, setStatus)}
                title="Annexure Workflow Overview"
            />

            <Separator className="my-2" />

            {/* Annexure Table */}
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Name</TableHead>
                            {isAdmin && <TableHead>Vendor</TableHead>}
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">LRs</TableHead>
                            <TableHead className="text-center">Total Transecton</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnnexureList filtered={filtered} loading={loading} handleDelete={handleDelete} isAdmin={isAdmin} />
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

export default function AnnexureListContent({ vendorId, userRole }: AnnexureListContentProps) {
    return (
        <AnnexureValidationProvider vendorId={vendorId} userRole={userRole}>
            <AnnexureListContentInternal vendorId={vendorId} userRole={userRole} />
        </AnnexureValidationProvider>
    )
}

