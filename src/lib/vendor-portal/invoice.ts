export const VP_INVOICE_CUSTOM_ITEM_VALUE = "__OTHER__"

type InvoiceCatalogItemLike = {
  name: string
  description?: string | null
}

export function getVpInvoiceCatalogItemDescription(
  item: InvoiceCatalogItemLike,
) {
  return item.description?.trim() || item.name.trim()
}

export function normalizeVpInvoiceItemText(value?: string | null) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ")
}
