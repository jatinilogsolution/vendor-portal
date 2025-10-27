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


 // Define the Address type
interface Address {
  id: string;
  line1: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal?: string | null;
  country?: string | null;
  vendorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Function to format address
export function formatAddress(address: Address): string {
  if (!address) return "";

  const { line1, line2, city, state, postal, country } = address;

  // Collect non-empty parts and trim them
  const parts = [line1, line2, city, state, postal, country]
    .filter((part): part is string => !!part && part.trim() !== "")
    .map((part) => part.trim());

  // Join with commas
  return parts.join(", ");
}
