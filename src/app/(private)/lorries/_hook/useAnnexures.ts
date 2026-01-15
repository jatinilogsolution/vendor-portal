"use client"
import { useEffect, useMemo, useState } from "react"
import { getAnnexures, deleteAnnexure, Annexure } from "../_action/annexure"
import { toast } from "sonner"

interface UseAnnexuresReturn {
  annexures: Annexure[]
  filtered: Annexure[]
  loading: boolean
  search: string
  status: string
  stats: Record<string, number>
  setSearch: (value: string) => void
  setStatus: (value: string) => void
  handleDelete: (id: string) => Promise<void>
  fetchAnnexures: () => Promise<void>
}

export function useAnnexures(vendorId?: string): UseAnnexuresReturn {
  const [annexures, setAnnexures] = useState<Annexure[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [status, setStatus] = useState<string>("ALL")
  const [stats, setStats] = useState<Record<string, number>>({})

  const fetchAnnexures = async () => {
    setLoading(true)
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/lorries/annexures`);
      if (vendorId) url.searchParams.set("vendorId", vendorId);
      if (status && status !== "ALL") url.searchParams.set("status", status);

      const res = await fetch(url.toString(), { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to fetch annexures")

      const result = await res.json()
      setAnnexures(result.annexures || [])
      setStats(result.stats || {})
    } catch {
      toast.error("Failed to load annexures")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const data = await deleteAnnexure(id)
      toast.success(`Annexure deleted. ${data.unlinkedCount ?? 0} LRs unlinked.`)
      fetchAnnexures()
    } catch (err: any) {
      toast.error(err.message || "Delete failed")
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return annexures.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        new Date(a.fromDate).toLocaleDateString().toLowerCase().includes(q) ||
        new Date(a.toDate).toLocaleDateString().toLowerCase().includes(q)
    )
  }, [annexures, search])

  useEffect(() => {
    fetchAnnexures()
  }, [status])

  return {
    annexures,
    filtered,
    loading,
    search,
    status,
    stats,
    setSearch,
    setStatus,
    handleDelete,
    fetchAnnexures
  }
}
