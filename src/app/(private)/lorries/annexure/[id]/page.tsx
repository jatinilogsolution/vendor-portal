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
  Edit,
  ExternalLink,
  AlertCircle,
  History,
  Trash2,
  CheckCircle,
  XCircle
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
import { setLrPrice, updateLRVerificationStatus } from "../../_action/lorry"
import { useSession } from "@/lib/auth-client"
import { UserRoleEnum, AnnexureStatus } from "@/utils/constant"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import ExtraCostManager from "@/components/modules/extra-cost-manager"
import { WorkflowStatusBadge } from "@/components/modules/workflow/workflow-status-badge"
import { FileGroupActions } from "@/components/modules/workflow/file-group-actions"
import { deleteAnnexure } from "../../_action/annexure-workflow.action"
import { canEditAnnexure } from "@/utils/workflow-validator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AnnexureWorkflowPanel } from "@/components/modules/workflow/annexure-workflow-panel"
import { WorkflowTimeline } from "@/components/modules/workflow/workflow-timeline"
import { FileGroupStatus } from "@/utils/constant"
import { bulkApproveFileGroups } from "../../_action/annexure-workflow.action"
import { Checkbox } from "@/components/ui/checkbox"
import { WorkflowComments } from "@/components/modules/workflow/workflow-comments"
import { ManualNotificationDialog } from "@/components/modules/workflow/manual-notification-dialog"
import { cn } from "@/lib/utils"

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
  status?: string
  remark?: string
}

interface Group {
  id: string
  fileNumber: string
  extraCost: number
  totalPrice: number
  LRs: LR[]
}

interface AnnexureData {
  id: string
  name: string
  groups: Group[]
  vendorId?: string
  status: string
  vendor?: {
    name: string
    id: string
  }
  isInvoiced?: boolean
  invoiceDetails?: {
    id: string
    refernceNumber: string
    invoiceNumber?: string
    status: string
    invoiceDate?: string
  } | null
  statusHistory?: any[]
  missingLRsPerFile?: any[]
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
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [isBulkApproving, setIsBulkApproving] = useState(false)

  // Authorization checks
  const role = session.data?.user?.role
  const userId = session.data?.user?.id

  const isAdmin = role !== undefined && role !== null &&
    [UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(role as UserRoleEnum)
  const isVendor = role === UserRoleEnum.TVENDOR

  // Check if user can edit this annexure
  const canEdit = useMemo(() => {
    if (!data || !role) return false
    return canEditAnnexure(role as string, { 
      status: data.status as AnnexureStatus, 
      isInvoiced: data.isInvoiced 
    }).canEdit
  }, [data, role])

  // Check if there are missing LRs
  const hasMissingLRs = useMemo(() => {
    return data?.missingLRsPerFile && data.missingLRsPerFile.length > 0
  }, [data])

  // Get list of file numbers with missing LRs
  const incompleteFileNumbers = useMemo(() => {
    if (!data?.missingLRsPerFile) return new Set<string>()
    return new Set(data.missingLRsPerFile.map(f => f.fileNumber))
  }, [data])

  const fetchData = async (forceRefresh = false) => {
    try {
      const data = await loadAnnexure(id, forceRefresh)
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
      group.LRs?.some(
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
      const groupFreight = group.LRs?.reduce((sum: any, lr: { lrPrice: any }) => sum + (lr.lrPrice || 0), 0) || 0
      return {
        totalFiles: acc.totalFiles + 1,
        totalLRs: acc.totalLRs + (group.LRs?.length || 0),
        totalFreight: acc.totalFreight + groupFreight,
        totalExtra: acc.totalExtra + (group.LRs?.[0]?.extraCost || 0),
        grandTotal: acc.grandTotal + (group.totalPrice || 0)
      }
    }, { totalFiles: 0, totalLRs: 0, totalFreight: 0, totalExtra: 0, grandTotal: 0 })
  }, [data])

  // Handle submit annexure
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!data) return

    setIsDeleting(true)
    try {
      const result = await deleteAnnexure(id as string, userId || "", role || "")
      if (result.success) {
        toast.success("Annexure deleted successfully")
        router.push("/lorries/annexure")
      } else {
        toast.error(result.error || "Failed to delete annexure")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

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
      setIsSubmitting(false);
    }
  }

  // Handle bulk approval
  const handleBulkApprove = async () => {
    if (selectedGroups.length === 0) return

    try {
      setIsBulkApproving(true)
      const res = await bulkApproveFileGroups(selectedGroups, userId!, role as string)

      if (res.success) {
        toast.success(`Successfully approved ${res.count} file groups`)
        setSelectedGroups([])
        fetchData()
      } else {
        toast.error(res.error || "Failed to bulk approve")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsBulkApproving(false)
    }
  }

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const selectAllReviewableGroups = () => {
    if (!data?.groups) return
    const reviewableIds = data.groups
      .filter((g: any) => g.status === FileGroupStatus.UNDER_REVIEW || g.status === FileGroupStatus.PENDING)
      .map((g: any) => g.id)

    if (selectedGroups.length === reviewableIds.length) {
      setSelectedGroups([])
    } else {
      setSelectedGroups(reviewableIds)
    }
  }

  // Check if all groups are approved (for TADMIN forward to boss)
  const allGroupsApproved = useMemo(() => {
    if (!data?.groups) return false;
    return data.groups.every((g: any) => g.status === FileGroupStatus.APPROVED);
  }, [data]);

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

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <BackToPage title="Back to annexure" location="/lorries/annexure" />
                <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
                {data.name?.startsWith("Auto-Generated") && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 capitalize">
                    <History className="w-3 h-3" />
                    Legacy Conversion
                  </Badge>
                )}
              </div>
              {data.vendor && (
                <div className="flex items-center gap-2 text-muted-foreground ml-2">
                  <Truck className="w-4 h-4 text-primary/60" />
                  <span className="text-sm font-medium">{data.vendor.name}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="text-xs">ID: {data.vendor.id}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <WorkflowStatusBadge status={data.status || "DRAFT"} type="annexure" className="mr-2" role={role as string} />
              {data.isInvoiced && data.invoiceDetails && (
                <Badge variant="outline" className="mr-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 transition-colors">
                  <Link href={`/invoices/${data.invoiceDetails.id}`} className="flex items-center gap-1">
                    <Receipt size={14} />
                    <span>Invoice: {data.invoiceDetails.refernceNumber}</span>
                  </Link>
                </Badge>
              )}
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
                    group.LRs?.forEach((lr: any) => {
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

              {isAdmin && (
                <ManualNotificationDialog
                  recipientEmail={data.groups?.[0]?.LRs?.[0]?.tvendor?.users?.[0]?.email || ""}
                  recipientId={data.groups?.[0]?.LRs?.[0]?.tvendor?.users?.[0]?.id}
                  entityName={data.name || "Annexure"}
                  path={`/lorries/annexure/${id}`}
                />
              )}

              {/* Edit Button - Only show if can edit */}
              {canEdit && (
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

              {/* Delete Button - Only show if can delete */}
              {(isVendor && canEdit && !data.isInvoiced) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      Delete Annexure
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the annexure
                        and unlink all associated LRs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Submit Button - Only show if not invoiced and can edit 
                  If invoiced, the WorkflowPanel handles "Resubmit" status transition 
              */}
              {canEdit && !data.isInvoiced && (
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
            <Alert className={cn(
              "border-l-4",
              data.invoiceDetails.status.includes("REJECTED") 
                ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                : "border-green-500 bg-green-50 dark:bg-green-900/20"
            )}>
              {data.invoiceDetails.status.includes("REJECTED") 
                ? <AlertTriangle className="h-4 w-4 text-red-600" /> 
                : <FileCheck className="h-4 w-4 text-green-600" />
              }
              <AlertTitle className={cn(
                data.invoiceDetails.status.includes("REJECTED") ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
              )}>
                {data.invoiceDetails.status.includes("REJECTED") ? "Invoice Rejected - Action Required" : "Invoice Generated"}
              </AlertTitle>
              <AlertDescription className={cn(
                data.invoiceDetails.status.includes("REJECTED") ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300"
              )}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
                  <div className="flex items-center gap-4">
                    <span><strong>Ref:</strong> {data.invoiceDetails.refernceNumber}</span>
                    {data.invoiceDetails.invoiceNumber && <span><strong>Invoice #:</strong> {data.invoiceDetails.invoiceNumber}</span>}
                    <span><strong>Status:</strong> {data.invoiceDetails.status}</span>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white hover:bg-opacity-90" asChild>
                    <Link href={`/invoices/${data.invoiceDetails.id}`} className="flex items-center gap-2">
                      <ExternalLink size={14} />
                      View Invoice
                    </Link>
                  </Button>
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

          {session.data?.user && (
            <AnnexureWorkflowPanel
              annexureId={id}
              annexureName={data.name || "Annexure"}
              currentStatus={data.status || "DRAFT"}
              userRole={session.data.user.role as string}
              userId={session.data.user.id}
              allGroupsApproved={allGroupsApproved}
              onUpdate={fetchData}
            />
          )}

          {/* Bulk Actions Bar */}
          {role === UserRoleEnum.TADMIN && selectedGroups.length > 0 && (
            <div className="sticky top-4 z-50 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-none">
                  {selectedGroups.length} selected
                </Badge>
                <span className="text-sm font-medium">Bulk Review Actions</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={handleBulkApprove}
                  disabled={isBulkApproving}
                >
                  {isBulkApproving ? <Spinner className="h-4 w-4 mr-2" /> : <FileCheck className="h-4 w-4 mr-2" />}
                  Approve Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => setSelectedGroups([])}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* <Separator  /> */}

        <div className="grid grid-cols-1  gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                const totalFreight = group.LRs?.reduce(
                  (sum: any, lr: { lrPrice: any }) => sum + (lr.lrPrice || 0),
                  0
                ) || 0

                // Get unique origins and destinations for the group
                const origins = Array.from(new Set(group.LRs?.map((lr: any) => lr.origin) || [])).filter(Boolean);
                const destinations = Array.from(new Set(group.LRs?.map((lr: any) => lr.destination) || [])).filter(Boolean);

                // Check if this file has missing LRs
                const isIncomplete = incompleteFileNumbers.has(group.fileNumber)

                return (
                  <Card key={group.id} className={`gap-0 py-0 overflow-hidden hover:shadow-lg transition-shadow ${isIncomplete ? 'border-red-300 bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                    {/* Group Header */}
                    <div className={`bg-linear-to-r from-primary/5 via-primary/10 to-background border-b p-4 ${isIncomplete ? 'bg-red-100/50 dark:bg-red-900/20' : ''}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {role === UserRoleEnum.TADMIN && (group.status === FileGroupStatus.UNDER_REVIEW || group.status === FileGroupStatus.PENDING) && (
                            <Checkbox
                              checked={selectedGroups.includes(group.id)}
                              onCheckedChange={() => toggleGroupSelection(group.id)}
                              className="mt-1"
                            />
                          )}
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={isIncomplete ? "destructive" : "secondary"} className="text-sm px-3 py-1">
                                <FileText className="w-3 h-3 mr-1" />
                                {group.fileNumber}
                                {isIncomplete && <Lock className="w-3 h-3 ml-1" />}
                              </Badge>
                              <Badge variant="outline" className="text-sm px-3 py-1">
                                <Truck className="w-3 h-3 mr-1" />
                                {isIncomplete ? "**" : group.LRs?.[0]?.vehicleNo}
                              </Badge>
                              <Badge variant="outline" className="text-sm px-3 py-1">
                                {isIncomplete ? "**" : (group.LRs?.[0]?.vehicleType || "N/A")}
                              </Badge>
                              <Badge variant="outline" className="text-sm px-3 py-1">
                                {group.LRs?.length || 0} LRs
                              </Badge>
                              {isIncomplete && (
                                <Badge variant="destructive" className="text-xs">
                                  Incomplete File
                                </Badge>
                              )}
                              <WorkflowStatusBadge status={group.status || "PENDING"} type="fileGroup" role={role as string} />
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-orange-500" />
                                <span>{String(origins.length > 1 ? `${origins[0]} +${origins.length - 1}` : (origins[0] || "Unknown"))}</span>
                              </div>
                              <ArrowLeft className="w-3 h-3 rotate-180 text-muted-foreground/30" />
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-500" />
                                <span>{String(destinations.length > 1 ? `${destinations[0]} +${destinations.length - 1}` : (destinations[0] || "Unknown"))}</span>
                              </div>
                            </div>

                            {group.status === FileGroupStatus.REJECTED && group.rejectionReason && (
                              <div className="text-xs text-destructive bg-destructive/5 p-2 rounded border border-destructive/10 flex items-start gap-2 mt-1">
                                <AlertCircle className="h-3 w-3 mt-0.5" />
                                <span><strong>Rejection Reason:</strong> {group.rejectionReason}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                          {session.data?.user && (
                            <FileGroupActions
                              groupId={group.id}
                              currentStatus={group.status || "PENDING"}
                              annexureStatus={data.status || "DRAFT"}
                              userRole={session.data.user.role as string}
                              userId={session.data.user.id}
                              onUpdate={() => fetchData(true)}
                            />
                          )}
                          <Separator orientation="vertical" className="h-5" />
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
                                <ExtraCostManager
                                  fileNumber={group.fileNumber}
                                  totalExtra={group.extraCost ? `₹${group.extraCost.toLocaleString()}` : ""}
                                  onSuccess={fetchData}
                                  readOnly={true}
                                />
                              )}
                            </span>
                          </div>
                          <Separator orientation="vertical" className="h-5" />
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-bold text-primary">
                              {isIncomplete ? "**" : `₹${(totalFreight + (group.extraCost || 0)).toLocaleString()}`}
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
                            <TableHead className="font-semibold text-center">POD</TableHead>
                            {role === UserRoleEnum.TADMIN && data.status === AnnexureStatus.PENDING_TADMIN_REVIEW && (
                              <TableHead className="w-[120px] text-center">Verification</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.LRs?.map((lr: LR) => (
                            <TableRow
                              key={lr.id}
                              className={cn(
                                "transition-colors",
                                lr.status === "WRONG" && "bg-red-50/50 hover:bg-red-50 dark:bg-red-900/10 dark:hover:bg-red-900/20",
                                isIncomplete ? 'blur-sm select-none pointer-events-none' : ''
                              )}
                            >
                              <TableCell className="font-mono font-medium">
                                {isIncomplete ? "******" : (
                                  <div className="flex flex-col">
                                    <span>{lr.LRNumber}</span>
                                    {lr.remark && (
                                      <span className="text-[10px] text-muted-foreground italic truncate max-w-[150px]" title={lr.remark}>
                                        {lr.remark}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {isIncomplete ? "******" : lr.CustomerName}
                              </TableCell>
                              <TableCell>{isIncomplete ? "**" : lr.origin}</TableCell>
                              <TableCell>{isIncomplete ? "**" : lr.destination}</TableCell>
                              <TableCell>
                                {isIncomplete ? "**" : (lr.outDate
                                  ? new Date(lr.outDate).toLocaleDateString("en-IN")
                                  : "-")}
                              </TableCell>

                              <TableCell className="text-right font-medium">
                                {isIncomplete ? (
                                  <span className="text-sm">**</span>
                                ) : (
                                  <span className="text-sm">₹{(lr.lrPrice || 0).toLocaleString()}</span>
                                )}
                              </TableCell>
                              {/* <TableCell className="text-right font-medium">
                                ₹{(lr.extraCost || 0).toLocaleString()}
                              </TableCell> */}
                              <TableCell className=" ">
                                {isIncomplete ? "**" : (
                                  lr.podlink ? (
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                                      <Link href={lr.podlink} target="_blank">
                                        <ExternalLink size={14} className="text-primary" />
                                      </Link>
                                    </Button>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">No POD</span>
                                  )
                                )}
                              </TableCell>
                              {role === UserRoleEnum.TADMIN && data.status === AnnexureStatus.PENDING_TADMIN_REVIEW && (
                                <TableCell>
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={cn(
                                        "h-7 w-7 rounded-full transition-colors",
                                        lr.status === "VERIFIED" ? "bg-green-100 text-green-700 hover:bg-green-200" : "text-muted-foreground hover:bg-green-50 hover:text-green-600"
                                      )}
                                      title="Approve"
                                      onClick={async () => {
                                        const res = await updateLRVerificationStatus({
                                          lrNumber: lr.LRNumber,
                                          status: "VERIFIED",
                                          userId: userId!,
                                        });
                                        if (res.success) {
                                          toast.success(`LR ${lr.LRNumber} verified`);
                                          fetchData();
                                        } else {
                                          toast.error(res.error || "Failed to verify LR");
                                        }
                                      }}
                                    >
                                      <CheckCircle size={14} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={cn(
                                        "h-7 w-7 rounded-full transition-colors",
                                        lr.status === "WRONG" ? "bg-red-100 text-red-700 hover:bg-red-200" : "text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                      )}
                                      title="Flag as Wrong"
                                      onClick={async () => {
                                        const reason = prompt(`Enter rejection reason for LR ${lr.LRNumber}:`);
                                        if (reason === null) return;
                                        const res = await updateLRVerificationStatus({
                                          lrNumber: lr.LRNumber,
                                          status: "WRONG",
                                          remark: reason,
                                          userId: userId!,
                                        });
                                        if (res.success) {
                                          toast.success(`LR ${lr.LRNumber} marked as wrong`);
                                          fetchData();
                                        } else {
                                          toast.error(res.error || "Failed to flag LR");
                                        }
                                      }}
                                    >
                                      <XCircle size={14} />
                                    </Button>
                                  </div>
                                </TableCell>
                              )}
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

          {/* Timeline Sidebar */}
          <div className="space-y-6">
            <WorkflowTimeline
              logs={data.statusHistory || []}
              type="annexure"
            />
          </div>
        </div>

        {session.data?.user && (
          <WorkflowComments
            annexureId={id}
            currentUser={{
              id: session.data.user.id,
              name: session.data.user.name || "User",
              role: session.data.user.role as string
            }}
          />
        )}
      </div>
    </div >
  )
}