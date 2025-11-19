

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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { UploadPod } from "../upload-pod"

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
            <DialogTrigger asChild>
              <Button size="sm" disabled={savingDraft}>
                <Save className="w-3.5 h-3.5 mr-1" /> Draft
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Save Annexure Draft</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
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
                <FileText className="w-4 h-4" />
                {g.fileNumber} <Badge variant={"secondary"}>{g.vehicleNo} - {g.vehicleType}</Badge> <Badge variant={"outline"}>{g.rows.length} LRs</Badge>
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
                              g.rows.forEach((r) => (e.target.checked ? s.add(r.lrNumber) : s.delete(r.lrNumber)))
                              setSelected(s)
                            }}
                            className="w-3.5 h-3.5 rounded border-input accent-primary"
                          />
                        </th>
                        <th className="p-2 text-left font-medium">LR #</th>
                        <th className="p-2 text-left font-medium">Vehicle</th>
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
                              onChange={() => toggleSelect(r.lrNumber)}
                              className="w-3.5 h-3.5 rounded border-input accent-primary"
                            />
                          </td>
                          <td className="p-2 font-mono font-medium">{r.lrNumber}</td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3 text-muted-foreground" />
                              <span className="truncate max-w-24">{r.vehicleNo || "—"}</span>
                            </div>
                          </td>
                          <td className="p-2 font-medium">₹{r.freightCost.toLocaleString()}</td>
                          {/* <td className="p-2">
                            {editingCell?.groupIdx === groupIdx && editingCell?.rowIdx === rowIdx && editingCell?.field === "extra" ? (
                              <div className="flex items-center gap-1">
                                <Input

                                  type="number"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                  className="h-7 w-16"
                                  autoFocus
                                />
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={saveEdit}>
                                  <CheckCircle2 className="w-3 h-3 text-success" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEdit}>
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEdit(groupIdx, rowIdx, "extra", String(r.extraCost))}
                                className="font-medium hover:underline"
                              >
                                {r.extraCost > 0 ? `₹${r.extraCost}` : "—"}
                              </button>
                            )}
                          </td> */}
                          <td className="p-2">{r.outDate ? new Date(r.outDate).toLocaleDateString() : "—"}</td>
                          <td className="p-2">
                            <UploadPod LrNumber={r.lrNumber} customer={r.customerName!} whId={r.origin} vendor={r.vendorName!} initialFileUrl={r.podLink ?? null} fileNumber={g.fileNumber} />

                          </td>

                          <td className="p-2">
                            {r.status === "FOUND" ? (
                              <span className="flex items-center gap-1 text-green-500 text-xs">
                                <CheckCircle2 className="w-3 h-3" /> Found
                              </span>
                            ) : r.status === "ALREADY_LINKED" ? (
                              <span className="flex items-center gap-1 text-destructive text-xs">
                                <AlertCircle className="w-3 h-3" /> Already Annexured
                              </span>
                            ) : r.status === "ALREADY_INVOICED" ? (
                              <span className="flex items-center gap-1 text-primary text-xs">
                                <CircleCheckBig className="w-3 h-3" /> Already Invoiced
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
