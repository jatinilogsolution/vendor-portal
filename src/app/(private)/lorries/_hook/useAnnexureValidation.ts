// app/lorries/annexure/hooks/useAnnexureValidation.ts

import { useState } from "react"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import { validateAnnexure } from "../_action/annexure"

export interface ValidationResult {
  grouped: Record<string, any>
  validationRows: any[]
}

export function useAnnexureValidation() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ValidationResult | null>(null)
  const [visible, setVisible] = useState(false)

  const normalize = (row: Record<string, any>) => {
    const out: Record<string, any> = {}
    for (const key of Object.keys(row)) out[key.trim()] = row[key]

    out["LR Number"] = String(out["LR Number"] ?? out["LRNumber"] ?? "").trim()
    out["Vendor Freight Cost"] = Number(out["Vendor Freight Cost"] ?? out["Freight"] ?? 0)
    out["Extra Cost"] = Number(out["Extra Cost"] ?? out["Extra"] ?? 0)
    out["Remark"] = String(out["Remark"] ?? out["Remarks"] ?? "")
    out["fileNumber_sheet"] = String(out["File Number"] ?? out["fileNumber"] ?? "") || null

    return out
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    await handleValidate(f)
  }

  const handleValidate = async (f: File) => {
    setLoading(true)
    setVisible(false)

    try {
      const ab = await f.arrayBuffer()
      const wb = XLSX.read(ab, { type: "array" })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const raw = XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[]
      const rows = raw.map(normalize)

      if (!rows.some((r) => r["LR Number"])) {
        toast.error("No LR numbers found in the sheet")
        return
      }

      const res = await validateAnnexure(rows)
      setData(res)
      setVisible(true)
      toast.success("Validation completed successfully")
    } catch (err: any) {
      console.error("Validation error:", err)
      toast.error(err.message || "Failed to parse or validate file")
    } finally {
      setLoading(false)
    }
  }

  return {
    file,
    loading,
    data,
    visible,
    setVisible,
    handleFileChange,
    handleValidate,
  }
}
