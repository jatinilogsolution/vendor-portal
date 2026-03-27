// src/components/vendor-portal/ui/vp-export-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconTableExport } from "@tabler/icons-react"

interface VpExportButtonProps<T> {
  data:      T[]
  filename:  string
  columns:   { header: string; accessor: (row: T) => string | number | null | undefined }[]
  disabled?: boolean
}

export function VpExportButton<T>({
  data, filename, columns, disabled,
}: VpExportButtonProps<T>) {
  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    setLoading(true)
    try {
      const headers = columns.map((c) => `"${c.header}"`).join(",")
      const rows    = data.map((row) =>
        columns.map((c) => {
          const val = c.accessor(row)
          if (val == null) return ""
          const str = String(val)
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str
        }).join(","),
      )

      const csv     = [headers, ...rows].join("\n")
      const blob    = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url     = URL.createObjectURL(blob)
      const link    = document.createElement("a")
      link.href     = url
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline" size="sm"
      onClick={handleExport}
      disabled={disabled || loading || data.length === 0}
    >
      <IconTableExport size={14} className="mr-1.5" />
      Export CSV
    </Button>
  )
}