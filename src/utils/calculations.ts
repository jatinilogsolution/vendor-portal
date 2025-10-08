export function calculateItemTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100
}

export function calculateSubtotal(items: Array<{ quantity: number; unitPrice: number }>): number {
  return Math.round(items.reduce((sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice), 0) * 100) / 100
}

export function calculateTaxAmount(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * (taxRate / 100) * 100) / 100
}

export function calculateGrandTotal(subtotal: number, taxAmount: number): number {
  return Math.round((subtotal + taxAmount) * 100) / 100
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}


 
 