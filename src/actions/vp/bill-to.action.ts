// src/actions/vp/bill-to.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { BillToAddress, BillToAddressById, Warehouse } from "../wms/warehouse"

export type BillToOption = {
  id: string
  name: string
  address: string
  gstin: string
  stateCode: string | null
}

// ── Shared formatter ───────────────────────────────────────────

function formatAddress(w: Warehouse): string {
  return [
    w.addressLine1,
    w.addressLine2,
    w.city,
    w.state,
    w.pinCode,
    w.country,
  ]
    .map((f) => f?.trim() ?? "")
    .filter(Boolean)
    .join(", ")
}

// ── For the dropdown — all active warehouses ──────────────────

export async function getAllBillToAddresses(): Promise<BillToOption[]> {
  try {
    const warehouses = await BillToAddress()
    return warehouses.map((w) => ({
      id: String(w.id),           // numeric ID → string for form
      name: w.warehouseName ?? w.city ?? String(w.id),
      address: formatAddress(w),
      gstin: w.gstinNumber?.trim() ?? "",
      stateCode: w.stateCode ?? null,
    }))
  } catch (e) {
    console.error("[getAllBillToAddresses]", e)
    return []
  }
}

// ── Apply selected address to a VpInvoice ─────────────────────

export async function updateVpInvoiceBillTo(
  invoiceId: string,
  billToId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!billToId?.trim())
      return { success: false, error: "Invalid address ID" }

    const warehouses = await BillToAddressById(billToId.trim())
    if (!warehouses?.[0])
      return { success: false, error: "Address not found" }

    const w = warehouses[0]
    const formattedAddress = formatAddress(w)

    await prisma.vpInvoice.update({
      where: { id: invoiceId },
      data: {
        billToId: String(w.id),
        billTo: formattedAddress,
        billToGstin: w.gstinNumber?.trim() ?? "",
      },
    })

    return { success: true }
  } catch (e) {
    console.error("[updateVpInvoiceBillTo]", e)
    return { success: false, error: "Failed to update bill-to address" }
  }
}

// ── Auto-fill bill-to from a PO's delivery address ────────────
// When vendor picks a PO, pre-select the matching warehouse if possible

export async function getBillToForPo(poId: string): Promise<{
  billToId?: string
  billTo?: string
  billToGstin?: string
} | null> {
  try {
    const po = await prisma.vpPurchaseOrder.findUnique({
      where: { id: poId },
      select: { deliveryAddress: true },
    })
    if (!po?.deliveryAddress) return null

    // Return the raw delivery address as the bill-to string
    // (warehouse ID not stored on PO so we can't auto-pick the dropdown)
    return { billTo: po.deliveryAddress }
  } catch {
    return null
  }
}

// ── Get single warehouse for display/PDF ──────────────────────

export async function getBillToById(billToId: string): Promise<{
  name: string
  address: string
  gstin: string
  stateCode: string | null
} | null> {
  try {
    const warehouses = await BillToAddressById(billToId.trim())
    if (!warehouses?.[0]) return null

    const w = warehouses[0]
    return {
      name: w.warehouseName ?? w.city ?? billToId,
      address: formatAddress(w),
      gstin: w.gstinNumber?.trim() ?? "",
      stateCode: w.stateCode ?? null,
    }
  } catch {
    return null
  }
}