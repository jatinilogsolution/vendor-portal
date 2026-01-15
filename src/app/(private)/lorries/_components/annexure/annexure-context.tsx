"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import { validateAnnexure } from "../../_action/annexure"

export interface ValidationResult {
  grouped: Record<string, any>
  validationRows: any[]
}

interface AnnexureValidationContextType {
  file: File | null
  loading: boolean
  validationData: ValidationResult | null
  expanded: boolean
  setExpanded: (value: boolean) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleValidate: (file: File) => Promise<void>
}

const AnnexureValidationContext = createContext<AnnexureValidationContextType | undefined>(undefined)

export function useAnnexureValidationContext() {
  const ctx = useContext(AnnexureValidationContext)
  if (!ctx) throw new Error("useAnnexureValidationContext must be used within AnnexureValidationProvider")
  return ctx
}

export function AnnexureValidationProvider({ children, vendorId, userRole }: { children: ReactNode, vendorId?: string, userRole?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [validationData, setValidationData] = useState<ValidationResult | null>(null)
  const [expanded, setExpanded] = useState(false)

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
    setExpanded(false)
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
      // Pass vendor context to validation action
      const res = await validateAnnexure(rows, vendorId, userRole)
      setValidationData(res)
      setExpanded(true)
      toast.success("✅ Done! Upload and validation successful.")
    } catch (err: any) {
      console.error("Validation error:", err)
      toast.error(err.message || "Failed to parse or validate file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnnexureValidationContext.Provider
      value={{
        file,
        loading,
        validationData,
        expanded,
        setExpanded,
        handleFileChange,
        handleValidate,
      }}
    >
      {children}
    </AnnexureValidationContext.Provider>
  )
}
