import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LRSItem {
    OutLRNo: string;
    OutLRDate: string;
    city: string;
    OutTPT: string;
}

interface LRSStore {
    data: LRSItem[] | [];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    setData: (data: LRSItem[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setLastFetched: (timestamp: number) => void;
}

export const useLRSStore = create<LRSStore>()(
    persist(
        (set) => ({
            data: [],
            loading: false,
            error: null,
            lastFetched: null,
            setData: (data) => set({ data }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            setLastFetched: (timestamp) => set({ lastFetched: timestamp }),
        }),
        {
            name: "lrs-storage", // key in localStorage
        }
    )
);
