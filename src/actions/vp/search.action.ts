// src/actions/vp/search.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"

export type VpSearchResult = {
  type:    "PO" | "PI" | "INVOICE" | "VENDOR" | "PROCUREMENT"
  id:      string
  title:   string
  subtitle:string
  status:  string
  href:    string
}

export async function vpGlobalSearch(
  q: string,
): Promise<VpSearchResult[]> {
  if (!q || q.length < 2) return []

  const session = await getCustomSession()
  const role    = session.user.role
  const results: VpSearchResult[] = []

  const s = { contains: q }

  if (["ADMIN", "BOSS"].includes(role)) {
    const [pos, pis, invs, vendors, prs] = await Promise.all([
      prisma.vpPurchaseOrder.findMany({
        where:  { OR: [{ poNumber: s }] },
        take:   5,
        select: { id: true, poNumber: true, status: true,
          vendor: { select: { existingVendor: { select: { name: true } } } } },
      }),
      prisma.vpProformaInvoice.findMany({
        where:  { OR: [{ piNumber: s }] },
        take:   5,
        select: { id: true, piNumber: true, status: true,
          vendor: { select: { existingVendor: { select: { name: true } } } } },
      }),
      prisma.vpInvoice.findMany({
        where:  { invoiceNumber: s },
        take:   5,
        select: { id: true, invoiceNumber: true, status: true,
          vendor: { select: { existingVendor: { select: { name: true } } } } },
      }),
      prisma.vpVendor.findMany({
        where:  { existingVendor: { name: s } },
        take:   5,
        select: { id: true, existingVendor: { select: { name: true } }, portalStatus: true },
      }),
      prisma.vpProcurement.findMany({
        where:  { OR: [{ prNumber: s }, { title: { contains: q } }] },
        take:   5,
        select: { id: true, prNumber: true, title: true, status: true },
      }),
    ])

    pos.forEach((r) => results.push({
      type:    "PO",
      id:      r.id,
      title:   r.poNumber,
      subtitle: r.vendor.existingVendor.name,
      status:  r.status,
      href:    `/vendor-portal/admin/purchase-orders/${r.id}`,
    }))
    pis.forEach((r) => results.push({
      type:    "PI",
      id:      r.id,
      title:   r.piNumber,
      subtitle: r.vendor.existingVendor.name,
      status:  r.status,
      href:    `/vendor-portal/admin/proforma-invoices/${r.id}`,
    }))
    invs.forEach((r) => results.push({
      type:    "INVOICE",
      id:      r.id,
      title:   r.invoiceNumber ?? "—",
      subtitle: r.vendor.existingVendor.name,
      status:  r.status,
      href:    `/vendor-portal/admin/invoices/${r.id}`,
    }))
    vendors.forEach((r) => results.push({
      type:    "VENDOR",
      id:      r.id,
      title:   r.existingVendor.name,
      subtitle: `Vendor`,
      status:  r.portalStatus,
      href:    `/vendor-portal/admin/vendors/${r.id}`,
    }))
    prs.forEach((r) => results.push({
      type:    "PROCUREMENT",
      id:      r.id,
      title:   r.prNumber,
      subtitle: r.title,
      status:  r.status,
      href:    `/vendor-portal/admin/procurement/${r.id}`,
    }))
  }

  return results.slice(0, 15)
}