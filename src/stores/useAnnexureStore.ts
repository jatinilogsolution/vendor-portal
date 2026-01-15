"use client"

import { create } from "zustand"

interface Annexure {
  id: string
  name?: string
  groups?: any[]
  isInvoiced?: boolean
  invoiceDetails?: {
    id: string
    refernceNumber: string
    invoiceNumber?: string
    status: string
    invoiceDate?: string
  } | null
  missingLRsPerFile?: {
    fileNumber: string
    missing: string[]
    total: number
    inAnnexure: number
  }[]
  [key: string]: any
}

interface CacheEntry {
  data: Annexure
  timestamp: number
}

interface AnnexureState {
  details: Annexure | null         // current annexure in use
  cache: Record<string, CacheEntry>

  loadAnnexure: (id: string, forceRefresh?: boolean) => Promise<Annexure>
  invalidateCache: (id: string) => void
  clearDetails: () => void
}

export const useAnnexureStore = create<AnnexureState>((set, get) => ({
  details: null,
  cache: {},

  // -------------------------
  // Main loader with 5-min TTL cache
  // -------------------------
  loadAnnexure: async (id: string, forceRefresh?: boolean) => {
    const { cache } = get()
    const cacheEntry = cache[id]

    // 1️⃣ Check cache (TTL = 5 mins) - skip if forceRefresh
    if (!forceRefresh && cacheEntry && Date.now() - cacheEntry.timestamp < 5 * 60 * 1000) {
      set({ details: cacheEntry.data })
      return cacheEntry.data
    }

    // 2️⃣ Fetch from API
    const res = await fetch(`/api/lorries/annexures/${id}`)
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || "Failed to fetch annexure")

    // 3️⃣ Store in cache + details
    const payload: Annexure = json

    set((state) => ({
      details: payload,
      cache: {
        ...state.cache,
        [id]: { data: payload, timestamp: Date.now() }
      }
    }))

    return payload
  },

  invalidateCache: (id: string) => {
    set((state) => {
      const newCache = { ...state.cache }
      delete newCache[id]
      return { cache: newCache }
    })
  },

  clearDetails: () => set({ details: null }),
}))
