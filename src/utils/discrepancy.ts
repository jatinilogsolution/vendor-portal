import { PurchaseOrderItem, InvoiceItem } from '@prisma/client'
import { Discrepancy } from '../types'

export function detectDiscrepancies(
  poItems: PurchaseOrderItem[],
  invoiceItems: InvoiceItem[]
): Discrepancy[] {
  const discrepancies: Discrepancy[] = []

  // Check for quantity and price discrepancies
  poItems.forEach(poItem => {
    const matchingInvoiceItem = invoiceItems.find(
      invItem => invItem.description.toLowerCase() === poItem.description.toLowerCase()
    )

    if (matchingInvoiceItem) {
      // Quantity discrepancy
      if (matchingInvoiceItem.quantity > poItem.quantity) {
        discrepancies.push({
          type: 'quantity',
          poItem,
          invoiceItem: matchingInvoiceItem,
          message: `Invoice quantity (${matchingInvoiceItem.quantity}) exceeds PO quantity (${poItem.quantity})`,
          severity: 'error'
        })
      }

      // Price discrepancy
      if (Math.abs(matchingInvoiceItem.unitPrice - poItem.unitPrice) > 0.01) {
        discrepancies.push({
          type: 'price',
          poItem,
          invoiceItem: matchingInvoiceItem,
          message: `Price mismatch: PO $${poItem.unitPrice} vs Invoice $${matchingInvoiceItem.unitPrice}`,
          severity: 'warning'
        })
      }

      // Amount discrepancy
      const expectedTotal = matchingInvoiceItem.quantity * poItem.unitPrice
      if (Math.abs(matchingInvoiceItem.total - expectedTotal) > 0.01) {
        discrepancies.push({
          type: 'amount',
          poItem,
          invoiceItem: matchingInvoiceItem,
          message: `Amount mismatch: Expected $${expectedTotal.toFixed(2)} vs Invoice $${matchingInvoiceItem.total}`,
          severity: 'error'
        })
      }
    }
  })

  // Check for items in invoice but not in PO
  invoiceItems.forEach(invoiceItem => {
    const matchingPoItem = poItems.find(
      poItem => poItem.description.toLowerCase() === invoiceItem.description.toLowerCase()
    )

    if (!matchingPoItem) {
      discrepancies.push({
        type: 'description',
        invoiceItem,
        message: `Item "${invoiceItem.description}" not found in original PO`,
        severity: 'warning'
      })
    }
  })

  return discrepancies
}