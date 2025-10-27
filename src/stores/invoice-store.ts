// "use client"

// import { create } from "zustand"

// interface LRItem {
//   fileNumber: string
//   priceSettled?: number
//   extraCost?: number
// }

// interface InvoiceState {
//   lrItems: LRItem[]
//   taxRate: number
//   subTotal: number
//   totalExtra: number
//   taxAmount: number
//   grandTotal: number

//   setLRItems: (items: LRItem[]) => void
//   setTaxRate: (rate: number) => void
//   recalcTotals: () => void
//   reset: () => void
// }

// export const useInvoiceStore = create<InvoiceState>((set, get) => ({
//   lrItems: [],
//   taxRate: 0,
//   subTotal: 0,
//   totalExtra: 0,
//   taxAmount: 0,
//   grandTotal: 0,

//   setLRItems: (items) => {
//     set({ lrItems: items }, false, "setLRItems")
//     get().recalcTotals()
//   },

//   setTaxRate: (rate) => {
//     set({ taxRate: rate }, false, "setTaxRate")
//     get().recalcTotals()
//   },

//   recalcTotals: () => {
//     const seenFiles = new Set<string>()
//     let subTotal = 0
//     let totalExtra = 0

//     get().lrItems.forEach((item) => {
//       if (!seenFiles.has(item.fileNumber)) {
//         subTotal += item.priceSettled || 0
//         totalExtra += item.extraCost || 0
//         seenFiles.add(item.fileNumber)
//       }
//     })

//     const taxAmount = ((get().taxRate || 0) / 100) * (subTotal + totalExtra)
//     const grandTotal = subTotal + totalExtra + taxAmount

//     set({ subTotal, totalExtra, taxAmount, grandTotal })
//   },

//   reset: () => set({ lrItems: [], taxRate: 0, subTotal: 0, totalExtra: 0, taxAmount: 0, grandTotal: 0 }),
// }))
