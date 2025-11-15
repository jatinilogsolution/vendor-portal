 
"use client"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Search } from "lucide-react"
import UploadAnnexureExtractor from "./upload-annexure-extractor"

interface AnnexureHeaderProps {
  search: string
  setSearch: (val: string) => void
  resultsCount: number
}

export default function AnnexureHeader({ search, setSearch, resultsCount }: AnnexureHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
      {/* --- Search Section --- */}
      <div className="w-full max-w-md space-y-2">
        {/* Label for SEO & Accessibility */}
        <label
          htmlFor="annexureSearch"
          className="block text-sm font-medium "
        >
          Search Annexure
        </label>

        <div className="relative">
          <InputGroup className="border rounded-lg overflow-hidden   focus-within:border-blue-400 transition-all duration-200">
            <InputGroupInput
              id="annexureSearch"
              placeholder="Search by name, LR number or date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="focus-visible:ring-0 focus-visible:outline-none text-sm"
            />
            <InputGroupAddon className="pr-3 ">
              <Search className="h-4 w-4" />
            </InputGroupAddon>
          </InputGroup>

          {/* Animated results count */}
          {search && (
            <div

              className="absolute right-2 top-2 text-xs "
            >
              {resultsCount} {resultsCount === 1 ? "result" : "results"}
            </div>
          )}
        </div>
      </div>

      {/* --- File Upload Section --- */}
      <div >
        <UploadAnnexureExtractor />
      </div>
    </div>
  )
}

