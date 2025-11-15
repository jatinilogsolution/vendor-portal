"use client"

import { create } from "zustand"

interface Annexure {
  id: string
  name?: string
  groups?: any[]
  [key: string]: any
}

interface CacheEntry {
  data: Annexure
  timestamp: number
}

interface AnnexureState {
  details: Annexure | null         // current annexure in use
  cache: Record<string, CacheEntry>

  loadAnnexure: (id: string) => Promise<Annexure>
  clearDetails: () => void
}

export const useAnnexureStore = create<AnnexureState>((set, get) => ({
  details: null,
  cache: {},

  // -------------------------
  // Main loader with 5-min TTL cache
  // -------------------------
  loadAnnexure: async (id: string) => {
    const { cache } = get()
    const cacheEntry = cache[id]

    // 1️⃣ Check cache (TTL = 5 mins)
    if (cacheEntry && Date.now() - cacheEntry.timestamp < 5 * 60 * 1000) {
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

  clearDetails: () => set({ details: null }),
}))
