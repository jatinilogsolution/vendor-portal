"use client"
import { useEffect, useMemo, useState } from "react"
import { getAnnexures, deleteAnnexure, Annexure } from "../_action/annexure"
import { toast } from "sonner"

interface UseAnnexuresReturn {
  annexures: Annexure[]
  filtered: Annexure[]
  loading: boolean
  search: string
  setSearch: (value: string) => void
  handleDelete: (id: string) => Promise<void>
  fetchAnnexures: () => Promise<void>
}

export function useAnnexures(vendorId?: string): UseAnnexuresReturn {
  const [annexures, setAnnexures] = useState<Annexure[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")

  const fetchAnnexures = async () => {
    setLoading(true)
    try {
      const data = await getAnnexures(vendorId)
      setAnnexures(data)
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
  }, [])

  return { annexures, filtered, loading, search, setSearch, handleDelete, fetchAnnexures }
}
