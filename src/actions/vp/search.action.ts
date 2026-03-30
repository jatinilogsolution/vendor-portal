// src/actions/vp/search.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"

export type VpSearchResult = {
  type:
    | "PO"
    | "PI"
    | "INVOICE"
    | "VENDOR"
    | "PROCUREMENT"
    | "DELIVERY"
    | "ITEM"
    | "CATEGORY"
    | "USER"
  id:      string
  title:   string
  subtitle:string
  status:  string | null
  href:    string
}

export async function vpGlobalSearch(
  q: string,
): Promise<VpSearchResult[]> {
  if (!q || q.length < 2) return []

  const session = await getCustomSession()
  const role    = session.user.role
  const results: VpSearchResult[] = []

  const query = q.trim()
  const s = { contains: query }
  const listHref = (pathname: string, value: string) =>
    `${pathname}?q=${encodeURIComponent(value)}`

  if (["ADMIN", "BOSS"].includes(role)) {
    const [pos, pis, invs, vendors, prs, deliveries, items, categories, users] = await Promise.all([
      prisma.vpPurchaseOrder.findMany({
        where:  {
          OR: [
            { id: s },
            { poNumber: s },
            { vendor: { existingVendor: { name: s } } },
          ],
        },
        take:   5,
        select: { id: true, poNumber: true, status: true,
          vendor: { select: { existingVendor: { select: { name: true } } } } },
      }),
      prisma.vpProformaInvoice.findMany({
        where:  {
          OR: [
            { id: s },
            { piNumber: s },
            { vendor: { existingVendor: { name: s } } },
          ],
        },
        take:   5,
        select: { id: true, piNumber: true, status: true,
          vendor: { select: { existingVendor: { select: { name: true } } } } },
      }),
      prisma.vpInvoice.findMany({
        where:  {
          OR: [
            { id: s },
            { invoiceNumber: s },
            { vendor: { existingVendor: { name: s } } },
          ],
        },
        take:   5,
        select: { id: true, invoiceNumber: true, status: true,
          vendor: { select: { existingVendor: { select: { name: true } } } } },
      }),
      prisma.vpVendor.findMany({
        where:  {
          OR: [
            { id: s },
            { existingVendor: { name: s } },
          ],
        },
        take:   5,
        select: { id: true, existingVendor: { select: { name: true } }, portalStatus: true },
      }),
      prisma.vpProcurement.findMany({
        where:  {
          OR: [
            { id: s },
            { prNumber: s },
            { title: s },
          ],
        },
        take:   5,
        select: { id: true, prNumber: true, title: true, status: true },
      }),
      prisma.vpDeliveryRecord.findMany({
        where: {
          OR: [
            { id: s },
            { status: s },
            { purchaseOrder: { poNumber: s } },
            { purchaseOrder: { vendor: { existingVendor: { name: s } } } },
          ],
        },
        take: 5,
        select: {
          id: true,
          status: true,
          purchaseOrder: {
            select: {
              poNumber: true,
              vendor: { select: { existingVendor: { select: { name: true } } } },
            },
          },
        },
      }),
      prisma.vpItem.findMany({
        where: {
          OR: [
            { id: s },
            { code: s },
            { name: s },
            { hsnCode: s },
            { description: s },
            { category: { name: s } },
          ],
        },
        take: 5,
        select: {
          id: true,
          code: true,
          name: true,
          uom: true,
          category: { select: { name: true } },
        },
      }),
      prisma.vpCategory.findMany({
        where: {
          OR: [
            { id: s },
            { name: s },
            { code: s },
            { parent: { name: s } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          code: true,
          status: true,
          parent: { select: { name: true } },
        },
      }),
      prisma.user.findMany({
        where: {
          role: { in: ["ADMIN", "BOSS", "VENDOR"] },
          OR: [
            { id: s },
            { name: s },
            { email: s },
            { role: s },
            { Vendor: { name: s } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          Vendor: { select: { name: true } },
        },
      }),
    ])

    pos.forEach((r) => results.push({
      type:    "PO",
      id:      r.id,
      title:   r.poNumber,
      subtitle: `${r.vendor.existingVendor.name} · ID: ${r.id}`,
      status:  r.status,
      href:    `/vendor-portal/admin/purchase-orders/${r.id}`,
    }))
    pis.forEach((r) => results.push({
      type:    "PI",
      id:      r.id,
      title:   r.piNumber,
      subtitle: `${r.vendor.existingVendor.name} · ID: ${r.id}`,
      status:  r.status,
      href:    `/vendor-portal/admin/proforma-invoices/${r.id}`,
    }))
    invs.forEach((r) => results.push({
      type:    "INVOICE",
      id:      r.id,
      title:   r.invoiceNumber ?? "—",
      subtitle: `${r.vendor.existingVendor.name} · ID: ${r.id}`,
      status:  r.status,
      href:    `/vendor-portal/admin/invoices/${r.id}`,
    }))
    vendors.forEach((r) => results.push({
      type:    "VENDOR",
      id:      r.id,
      title:   r.existingVendor.name,
      subtitle: `Vendor · ID: ${r.id}`,
      status:  r.portalStatus,
      href:    `/vendor-portal/admin/vendors/${r.id}`,
    }))
    prs.forEach((r) => results.push({
      type:    "PROCUREMENT",
      id:      r.id,
      title:   r.prNumber,
      subtitle: `${r.title} · ID: ${r.id}`,
      status:  r.status,
      href:    `/vendor-portal/admin/procurement/${r.id}`,
    }))
    deliveries.forEach((r) => results.push({
      type: "DELIVERY",
      id: r.id,
      title: `Delivery · ${r.purchaseOrder.poNumber}`,
      subtitle: `${r.purchaseOrder.vendor.existingVendor.name} · ID: ${r.id}`,
      status: r.status,
      href: `/vendor-portal/admin/deliveries/${r.id}`,
    }))
    items.forEach((r) => results.push({
      type: "ITEM",
      id: r.id,
      title: `${r.code} · ${r.name}`,
      subtitle: `${r.category?.name ?? r.uom} · ID: ${r.id}`,
      status: null,
      href: listHref("/vendor-portal/admin/items", r.id),
    }))
    categories.forEach((r) => results.push({
      type: "CATEGORY",
      id: r.id,
      title: r.name,
      subtitle: `${r.code ?? r.parent?.name ?? "Category"} · ID: ${r.id}`,
      status: r.status,
      href: listHref("/vendor-portal/admin/categories", r.id),
    }))
    users.forEach((r) => results.push({
      type: "USER",
      id: r.id,
      title: r.name,
      subtitle: `${r.email} · ${r.Vendor?.name ?? r.role} · ID: ${r.id}`,
      status: r.banned ? "INACTIVE" : "ACTIVE",
      href: listHref("/vendor-portal/admin/users", r.id),
    }))
  }

  return results.slice(0, 20)
}
