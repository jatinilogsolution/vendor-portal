

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import {
  FileText,
  Truck,
  ChevronDown,
  Download,
  Save,
  CheckCircle2,
  X,
  AlertCircle,
  CircleCheckBig,
  Building2,
  TriangleAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { UploadPod } from "../upload-pod"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "@/lib/auth-client"
import { UserRoleEnum } from "@/utils/constant"

type ValidationRow = {
  lrNumber: string
  fileNumber?: string | null
  freightCost: number
  extraCost: number
  remark?: string
  status: string
  lrId?: string | null
  podLink?: string | null
  extraCostAttachment?: boolean
  issues?: string[]
  vehicleNo?: string | null
  vehicleType?: string | null
  outDate?: string | null
  customerName?: string | null
  vendorName: string | null
  vendorId: string | null
  origin: string
  destination: string
}

type FileGroup = {
  fileNumber: string
  rows: ValidationRow[]
  remark?: string
  extraForFile?: number
  isExpanded: boolean
  vehicleNo?: string | null
  vehicleType?: string | null
  outDate?: string | null
}

export default function AnnexureValidationPanel({ validationResponse }: { validationResponse: any }) {
  const [groups, setGroups] = useState<FileGroup[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [savingDraft, setSavingDraft] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const session = useSession()
  // Vendor summary from API
  const vendorSummary = validationResponse?.vendorSummary || []
  const hasMultipleVendors = validationResponse?.hasMultipleVendors || false
  const primaryVendor = validationResponse?.primaryVendor || null

  useEffect(() => {
    if (!validationResponse) return
    const grouped = validationResponse.grouped ?? {}
    const g: FileGroup[] = []
    for (const key of Object.keys(grouped)) {
      const rows = grouped[key].map(
        (r: any) =>
          ({
            lrNumber: r.lrNumber,
            fileNumber: r.fileNumber ?? key,
            freightCost: r.freightCost ?? 0,
            extraCost: r.extraCost ?? 0,
            remark: r.remark ?? "",
            status: r.status,
            lrId: r.lrId,
            podLink: r.podLink,
            extraCostAttachment: r.extraCostAttachment ?? false,
            issues: r.issues ?? [],
            vehicleNo: r.vehicleNo,
            vehicleType: r.vehicleType,
            outDate: r.outDate,
            vendorName: r.vendorName,
            vendorId: r.vendorId,
            origin: r.origin,
            destination: r.destination,
          }) as ValidationRow,
      )
      const firstRow = rows[0] || {}

      g.push({
        fileNumber: key,
        rows,
        remark: "",
        extraForFile: undefined,
        isExpanded: true,
        vehicleNo: firstRow.vehicleNo ?? "",
        vehicleType: firstRow.vehicleType ?? "",
        outDate: firstRow.outDate ?? null,
      })
    }
    setGroups(g)
    const s = new Set<string>()
    validationResponse.validationRows?.forEach((r: any) => {
      // Don't auto-select wrong vendor LRs
      if (r.status === "FOUND" && !r.annexureId) s.add(r.lrNumber)
    })
    setSelected(s)
  }, [validationResponse])

  const toggleSelect = (lr: string) => {
    const s = new Set(selected)
    s.has(lr) ? s.delete(lr) : s.add(lr)
    setSelected(s)
  }

  const toggleGroup = (idx: number) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, isExpanded: !g.isExpanded } : g))
    )
  }

  const sumFreight = (rows: ValidationRow[]) =>
    rows.reduce((a, b) => a + Number(b.freightCost || 0), 0)

  const fileExtra = (g: FileGroup) =>
    typeof g.extraForFile === "number"
      ? g.extraForFile
      : g.rows.find((r) => r.extraCost > 0)?.extraCost ?? 0

  const fileTotal = (g: FileGroup) => sumFreight(g.rows) + (fileExtra(g) || 0)

  const handleSaveDraft = async () => {
    if (!draftName.trim() || !fromDate || !toDate)
      return toast.error("Please fill all fields")

    if (hasMultipleVendors) {
      // Check if selected LRs belong to multiple vendors
      const selectedRows = groups.flatMap(g => g.rows).filter(r => selected.has(r.lrNumber))
      const uniqueVendors = new Set(selectedRows.map(r => r.vendorId).filter(Boolean))
      if (uniqueVendors.size > 1) {
        return toast.error("Cannot create annexure with mixed vendors. Please select LRs from a single vendor.")
      }
    }

    setSavingDraft(true)
    try {
      const payload = {
        name: draftName.trim(),
        fromDate,
        toDate,
        validatedLrs: Array.from(selected),
        extractedData: groups.flatMap((g) =>
          g.rows.map((r) => ({
            lrNumber: r.lrNumber,
            lrCost: r.freightCost,
            extraCost: r.extraCost,
            remark: g.remark,
            fileNumber: g.fileNumber,
          })),
        ),
        commit: false,
      }

      const checkRes = await fetch("/api/lorries/annexures/validateExisting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lrNumbers: payload.validatedLrs }),
      })

      const checkData = await checkRes.json()
      if (!checkRes.ok) throw new Error(checkData.error || "Failed to check linked LRs")

      if (checkData.linked?.length) {
        toast.error(
          `LR(s) are already linked to an Annexure:\n${checkData.linked.join(", ")}`
        )
        setSavingDraft(false)
        return
      }

      const res = await fetch("/api/lorries/annexures/saveAnnexure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save draft")

      toast.success("✅ Draft saved successfully")
      setShowDialog(false)
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message || "Something went wrong while saving draft")
    } finally {
      setSavingDraft(false)
    }
  }

  const exportXlsx = () => {
    const rows = groups.flatMap((g) =>
      g.rows.map((r) => ({
        fileNumber: g.fileNumber,
        lrNumber: r.lrNumber,
        vehicleNo: r.vehicleNo,
        vehicleType: r.vehicleType,
        outDate: r.outDate,
        freightCost: r.freightCost,
        Origin: r.origin,
        Destination: r.destination,
        extraCost: r.extraCost,
        fileExtra: fileExtra(g),
        remark: g.remark,
        podLink: r.podLink,
        vendorName: r.vendorName,
        issues: (r.issues || []).join("; "),
      })),
    )
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "annexure")
    XLSX.writeFile(wb, `annexure_${Date.now()}.xlsx`)
  }

  return (
    <div className=" py-2 space-y-3">

      {/* Vendor Warning */}
      {hasMultipleVendors && (
        <Alert variant="destructive" className="mb-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Multiple Vendors Detected</AlertTitle>
          <AlertDescription>
            This file contains LRs from multiple vendors. An annexure must belong to a single vendor.
            <div className="mt-2 text-sm font-medium">
              Found Vendors: {vendorSummary.map((v: any) => `${v.name} (${v.count})`).join(", ")}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background border-b pb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-primary/10">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Annexure Validation</h2>
            <p className="text-xs text-muted-foreground">
              <strong className="text-primary">{selected.size}</strong> selected /{" "}
              {groups.reduce((a, g) => a + g.rows.length, 0)} LRs
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" onClick={exportXlsx}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export
          </Button>

          {/* ✅ Open Draft Dialog */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger disabled={savingDraft} asChild>
              <Button size="sm" disabled={savingDraft}>
                <Save className="w-3.5 h-3.5 mr-1" /> Draft
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Save Annexure Draft</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                {/* Vendor Info in Dialog */}
                {session.data?.user.role !== UserRoleEnum.TVENDOR && primaryVendor && (
                  <div className="p-2 bg-muted rounded border text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Vendor</p>
                      <p className="font-semibold">{primaryVendor.name}</p>
                    </div>
                  </div>
                )}

                <div className=" space-y-1">
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g. Annexure Oct-2025"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className=" space-y-1">
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className=" space-y-1">
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveDraft} disabled={savingDraft}>
                  {savingDraft ? <Spinner /> : "Save Draft"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>



      {/* File Groups */}
      <div className="space-y-2">
        {groups.map((g, groupIdx) => (
          <div key={g.fileNumber} className="border rounded-lg overflow-hidden bg-card">
            {/* File Header */}
            <div
              className="bg-linear-to-r from-primary/20 to-muted border-b cursor-pointer flex items-center justify-between p-2 hover:bg-primary/10 transition"
              onClick={() => toggleGroup(groupIdx)}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ChevronDown className={cn("w-4 h-4 transition-transform", g.isExpanded && "rotate-90")} />
                {session.data?.user.role !== UserRoleEnum.TVENDOR && <>
                  <FileText className="w-4 h-4" />
                  {g.fileNumber}
                </>}


                <Badge variant={g.rows[0].status === "WRONG_VENDOR" ? "destructive" : "secondary"}>

                  {/* {g.rows[0].status === "WRONG_VENDOR" ? "********" : g.vehicleNo}

                  - {g.rows[0].vehicleType} */}

                  {g.rows[0].status === "WRONG_VENDOR" ? "Wrong Vendor" : ""}

                </Badge> <Badge variant={"outline"}>{g.rows.length} LRs</Badge>
              </div>
              <div className="text-xs font-mono">
                <span className="text-muted-foreground">Freight:</span> ₹{sumFreight(g.rows).toLocaleString()} |
                <span className="text-muted-foreground ml-1">Extra:</span> ₹{(fileExtra(g) || 0).toLocaleString()} |
                <span className="font-bold ml-1">Total: ₹{fileTotal(g).toLocaleString()}</span>
              </div>
            </div>

            {g.isExpanded && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 sticky top-0 z-10">
                      <tr className="border-b">
                        <th className="p-2 text-left font-medium w-8">
                          <input
                            type="checkbox"
                            checked={g.rows.every((r) => selected.has(r.lrNumber))}
                            onChange={(e) => {
                              const s = new Set(selected)
                              g.rows.forEach((r) => {
                                // Only check valid rows
                                if (r.status === "FOUND" || r.status === "WRONG_VENDOR" && hasMultipleVendors) { // If admin, allow selecting wrong vendor (technically different vendor)
                                  // But actually, we want to allow selecting only if it's not a hard block
                                  if (r.status === "WRONG_VENDOR") return // Skip selecting blocked items
                                  e.target.checked ? s.add(r.lrNumber) : s.delete(r.lrNumber)
                                } else if (r.status === "FOUND") {
                                  e.target.checked ? s.add(r.lrNumber) : s.delete(r.lrNumber)
                                }
                              })
                              setSelected(s)
                            }}
                            className="w-3.5 h-3.5 rounded border-input accent-primary"
                          />
                        </th>
                        <th className="p-2 text-left font-medium">LR #</th>
                        <th className="p-2 text-left font-medium">Vehicle</th>
                        <th className="p-2 text-left font-medium w-24">Vendor</th>
                        <th className="p-2 text-left font-medium">Freight</th>
                        <th className="p-2 text-left font-medium">Out Date</th>
                        <th className="p-2 text-left font-medium">POD</th>
                        <th className="p-2 text-left font-medium">Status</th>
                        <th className="p-2 text-left font-medium">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rows.map((r, rowIdx) => (
                        <tr
                          key={r.lrNumber}
                          className={cn(
                            "border-b transition-colors",
                            selected.has(r.lrNumber) && "bg-primary/5",
                            r.issues?.length && "bg-linear-to-l from-destructive/20 via-muted/40 to-muted "
                          )}
                        >
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={selected.has(r.lrNumber)}
                              disabled={r.status === "WRONG_VENDOR" || r.status === "ALREADY_LINKED" || r.status === "ALREADY_INVOICED"}
                              onChange={() => toggleSelect(r.lrNumber)}
                              className="w-3.5 h-3.5 rounded border-input accent-primary disabled:opacity-50"
                            />
                          </td>
                          <td className="p-2 font-mono font-medium">
                            {r.status === "WRONG_VENDOR" ? "********" : r.lrNumber}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3 text-muted-foreground" />
                              <span className="truncate max-w-24">
                                {/* {r.vehicleNo || "—"} */}
                                {r.status === "WRONG_VENDOR" ? "********" : r.vehicleNo}

                              </span>
                            </div>
                          </td>
                          <td className="p-2">
                            <span className="truncate max-w-24 block" title={r.vendorName || "—"}>
                              {/* {r.vendorName || "—"} */}

                              {r.status === "WRONG_VENDOR" ? "********" : r.vendorName}
                            </span>
                          </td>
                          <td className="p-2 font-medium">₹{r.freightCost.toLocaleString()}</td>
                          <td className="p-2">{r.outDate ? new Date(r.outDate).toLocaleDateString() : "—"}</td>
                          <td className="p-2">
                            {r.status === "FOUND" ? (
                              <UploadPod LrNumber={r.lrNumber} customer={r.customerName!} whId={r.origin} vendor={r.vendorName!} initialFileUrl={r.podLink ?? null} fileNumber={g.fileNumber} />
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>

                          <td className="p-2">
                            {r.status === "FOUND" ? (
                              <span className="flex items-center gap-1 text-green-500 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Found
                              </span>
                            ) : r.status === "ALREADY_LINKED" ? (
                              <span className="flex items-center gap-1 text-destructive text-xs">
                                <AlertCircle className="w-3 h-3" /> Annexured
                              </span>
                            ) : r.status === "ALREADY_INVOICED" ? (
                              <span className="flex items-center gap-1 text-primary text-xs">
                                <CircleCheckBig className="w-3 h-3" /> Invoiced
                              </span>
                            ) : r.status === "WRONG_VENDOR" ? (
                              <span className="flex items-center gap-1 text-destructive text-xs font-semibold">
                                <X className="w-3 h-3" /> Wrong LR
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-destructive text-xs">
                                <X className="w-3 h-3" /> Not Found
                              </span>
                            )}
                          </td>

                          <td className="p-2">
                            {r.issues?.length ? (
                              <Button
                                size={"sm"}
                                variant={"link"}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast.error(r?.issues?.join(" • "))
                                }}
                                className="flex items-center gap-1 text-red-500  hover:underline"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {r.issues.length}
                              </Button>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

        ))}

      </div>
    </div>
  )
}
