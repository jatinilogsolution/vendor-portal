"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { PodTable } from "./_components/pod-table"
import { getAllPodsForAllVendors, EnrichedLRRequest } from "./_actions/get"

const Index = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state with fallback to current month
  const [data, setData] = useState<EnrichedLRRequest[]>([])
  const [filteredData, setFilteredData] = useState<EnrichedLRRequest[]>([])
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

  // Fetch data when fromDate or toDate changes
  useEffect(() => {
    if (!fromDate || !toDate) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getAllPodsForAllVendors({ fromDate, toDate })
        if (!result) {
          throw new Error("No data returned from API")
        }
        setData(result)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fromDate, toDate])

  // Filter data when data, fromDate, or toDate changes
  useEffect(() => {
    const filtered = data.filter((item) => {
      if (!item.outDate) return false
      const out = new Date(item.outDate)
      const from = new Date(fromDate)
      const to = new Date(toDate)
      // Ensure dates are valid and within range
      return !isNaN(out.getTime()) && out >= from && out <= to
    })
    setFilteredData(filtered)
  }, [data, fromDate, toDate])

  // Sync URL with date filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("fromDate", fromDate)
    params.set("toDate", toDate)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [fromDate, toDate, router, searchParams])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Proofs From Transporter</h1>
          <p className="text-sm text-muted-foreground">
            Search and filter all POD records by date and customer.
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex gap-4 mt-4 sm:mt-0">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <Input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
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
        <PodTable data={filteredData} />
      )}
    </div>
  )
}

export default Index