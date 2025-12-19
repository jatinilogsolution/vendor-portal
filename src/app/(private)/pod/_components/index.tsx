"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { PodTable } from "./pod-table"
import { PodStats } from "./pod-stats"
import { getAllPodsForAllVendors, EnrichedLRRequest } from "../_actions/get"

const Index = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableRef = useRef<{ setStatusFilter: (value: string) => void; setInvoiceFilter: (value: string) => void } | null>(null)

  // Initialize state with fallback to current month
  const [allData, setAllData] = useState<EnrichedLRRequest[]>([]) // All LRs for stats and search
  const [displayData, setDisplayData] = useState<EnrichedLRRequest[]>([]) // Date-filtered LRs for display
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get initial dates from searchParams or use defaults
  const initialFromDate = searchParams.get("fromDate") || (() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0]
  })()
  const initialToDate = searchParams.get("toDate") || (() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })()

  const [fromDate, setFromDate] = useState(initialFromDate)
  const [toDate, setToDate] = useState(initialToDate)

  // Fetch ALL data once on mount (for stats and global search)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch all PODs without date filter
        const result = await getAllPodsForAllVendors({})
        if (!result) {
          throw new Error("No data returned from API")
        }
        setAllData(result)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, []) // Only run once on mount

  // Filter data for display based on date range
  useEffect(() => {
    const filtered = allData.filter((item) => {
      if (!item.outDate) return false
      const out = new Date(item.outDate)
      const from = new Date(fromDate)
      const to = new Date(toDate)
      // Ensure dates are valid and within range
      return !isNaN(out.getTime()) && out >= from && out <= to
    })
    setDisplayData(filtered)
  }, [allData, fromDate, toDate])

  // Sync URL with date filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("fromDate", fromDate)
    params.set("toDate", toDate)
    router.replace(`?${params.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, router])

  // Handle filter click from stats
  const handleFilterClick = (type: 'status' | 'invoice', value: string) => {
    if (tableRef.current) {
      if (type === 'status') {
        tableRef.current.setStatusFilter(value)
      } else if (type === 'invoice') {
        tableRef.current.setInvoiceFilter(value)
      }
    }
  }

  return (
    <div className=" ">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Proofs From Transporter</h1>
          <p className="text-sm text-muted-foreground">
            Search globally across all LRs. Stats show all-time counts. Table displays selected date range.
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex gap-4  sm:mt-0">
          <div>
            <label className="block text-sm font-medium text-muted-foreground ">From</label>
            <Input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">To</label>
            <Input
              type="date"
              value={toDate}
              min={fromDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 text-red-500 text-sm">{error}</div>
      )}

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics - Using ALL data */}
          <PodStats data={allData} onFilterClick={handleFilterClick} />

          {/* POD Table - Display date-filtered, but search through all */}
          <PodTable
            data={displayData}
            allData={allData}
            ref={tableRef}
          />
        </>
      )}
    </div>
  )
}

export default Index
