"use client"

import React, { createContext, useContext } from "react"
import { create } from "zustand"
import { devtools } from "zustand/middleware"


interface LRItem {
    fileNumber: string
    priceSettled?: number
    extraCost?: number
}

interface InvoiceState {
    lrItems: LRItem[]
    taxRate: number
    subTotal: number
    totalExtra: number
    taxAmount: number
    grandTotal: number

    setLRItems: (items: LRItem[]) => void
    setTaxRate: (rate: number) => void
    recalcTotals: () => void
    reset: () => void
}

// ✅ Zustand factory
const createInvoiceStore = () =>
    create<InvoiceState>()(
        devtools((set, get) => ({
            lrItems: [],
            taxRate: 0,
            subTotal: 0,
            totalExtra: 0,
            taxAmount: 0,
            grandTotal: 0,

            setLRItems: (items) => {
                set({ lrItems: items })
                get().recalcTotals()
            },
            setTaxRate: (rate) => {
                set({ taxRate: rate })
                get().recalcTotals()
            },
            recalcTotals: () => {
                const seenFiles = new Set<string>()
                let subTotal = 0
                let totalExtra = 0
                get().lrItems.forEach((item) => {
                    if (!seenFiles.has(item.fileNumber)) {
                        subTotal += item.priceSettled || 0
                        totalExtra += item.extraCost || 0
                        seenFiles.add(item.fileNumber)
                    }
                })
                const taxAmount = ((get().taxRate || 0) / 100) * (subTotal + totalExtra)
                const grandTotal = subTotal + totalExtra + taxAmount
                set({ subTotal, totalExtra, taxAmount, grandTotal })
            },
            reset: () =>
                set({
                    lrItems: [],
                    taxRate: 0,
                    subTotal: 0,
                    totalExtra: 0,
                    taxAmount: 0,
                    grandTotal: 0,
                }),
        }))
    )

// ✅ Create React context
const InvoiceStoreContext = createContext<ReturnType<typeof createInvoiceStore> | null>(null)

// ✅ Provider component
export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const store = React.useRef(createInvoiceStore()).current
    return <InvoiceStoreContext.Provider value={store}>{children}</InvoiceStoreContext.Provider>
}

// ✅ Custom hook to consume
export const useInvoiceStore = () => {
    const store = useContext(InvoiceStoreContext)
    if (!store) throw new Error("useInvoiceStore must be used within an InvoiceProvider")
    return store()
}
