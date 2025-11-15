"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File } from "lucide-react"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { useAnnexureValidationContext } from "./annexure-context"

export default function UploadAnnexureExtractor() {
  const { file, loading, handleFileChange, handleValidate } = useAnnexureValidationContext()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleBrowse = () => {
    if (!loading) fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-sm space-y-2">
      {/* Label */}
      <label
        htmlFor="annexureFile"
        className="block text-sm font-medium "
      >
        Upload Annexure File <span className="text-red-500">*</span>
      </label>

      {/* Upload container */}
      <div
        className={`flex items-center justify-between border rounded-md pl-3  transition-all duration-200
        ${loading ? "opacity-80 cursor-not-allowed" : "hover:border-primary/40 hover:shadow-sm"}
        `}
      >
        {/* Hidden input */}
        <input
          ref={fileInputRef}
          id="annexureFile"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />

        {/* File name display */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <File className="w-4 h-4   shrink-0" />
          <span
            className="truncate text-sm  "
            title={file?.name || "No file selected"}
          >
            {file?.name || "No file selected"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleBrowse}
            disabled={loading}
            className=" ml-2 transition-all duration-150"
          >
            Browse
          </Button>

          <Button
            type="button"
            size="icon-sm"
            onClick={() => file && handleValidate(file)}
            disabled={!file || loading}
            className="transition-all duration-150"
          >
            {loading ? (
              <Spinner className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground">
        Supported: <strong>.xlsx</strong>, <strong>.xls</strong>, <strong>.csv</strong> — Max 5MB
      </p>
    </div>
  )
}


