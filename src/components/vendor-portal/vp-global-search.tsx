// src/components/vendor-portal/vp-global-search.tsx
"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { IconSearch, IconX } from "@tabler/icons-react"
import { Input }  from "@/components/ui/input"
import { Badge }  from "@/components/ui/badge"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { vpGlobalSearch, VpSearchResult } from "@/actions/vp/search.action"
import { cn } from "@/lib/utils"

const TYPE_COLOR: Record<string, string> = {
  PO:          "bg-blue-100 text-blue-700",
  PI:          "bg-violet-100 text-violet-700",
  INVOICE:     "bg-emerald-100 text-emerald-700",
  VENDOR:      "bg-amber-100 text-amber-700",
  PROCUREMENT: "bg-slate-100 text-slate-700",
}

export function VpGlobalSearch() {
  const router  = useRouter()
  const [query,   setQuery]   = useState("")
  const [results, setResults] = useState<VpSearchResult[]>([])
  const [open,    setOpen]    = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.length >= 2) {
        startTransition(async () => {
          const res = await vpGlobalSearch(query)
          setResults(res)
          setOpen(true)
        })
      } else {
        setResults([])
        setOpen(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (result: VpSearchResult) => {
    setQuery("")
    setOpen(false)
    router.push(result.href)
  }

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div className="relative">
        <IconSearch
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search PO, PI, invoice, vendor…"
          className="h-8 pl-8 pr-8 text-xs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {query && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => { setQuery(""); setResults([]); setOpen(false) }}
          >
            <IconX size={13} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
          {results.map((r) => (
            <button
              key={`${r.type}-${r.id}`}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors"
              onClick={() => handleSelect(r)}
            >
              <Badge className={cn("shrink-0 text-[10px] px-1.5", TYPE_COLOR[r.type])}>
                {r.type}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{r.title}</p>
                <p className="truncate text-[10px] text-muted-foreground">{r.subtitle}</p>
              </div>
              <VpStatusBadge status={r.status} />
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !isPending && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-background px-3 py-4 text-center shadow-lg">
          <p className="text-xs text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  )
}