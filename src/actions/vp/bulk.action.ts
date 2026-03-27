// src/actions/vp/bulk.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isBoss } from "@/lib/vendor-portal/roles"
import { VpActionResult } from "@/types/vendor-portal"
import { emailPoApproved } from "@/lib/vp-email"

export async function bulkApprovePos(
  ids: string[],
): Promise<VpActionResult<{ approved: number; failed: string[] }>> {
  const session = await getCustomSession()
  if (!isBoss(session.user.role))
    return { success: false, error: "Only management can approve purchase orders" }

  const failed: string[] = []
  let approved = 0

  for (const id of ids) {
    try {
      const po = await prisma.vpPurchaseOrder.findUnique({
        where: { id }, select: { status: true },
      })
      if (!po || po.status !== "SUBMITTED") { failed.push(id); continue }

      await prisma.vpPurchaseOrder.update({
        where: { id },
        data:  { status: "APPROVED", approvedAt: new Date(), approvedById: session.user.id },
      })
      approved++
      emailPoApproved(id).catch(() => {}) // fire and forget
    } catch {
      failed.push(id)
    }
  }

  return { success: true, data: { approved, failed } }
}

export async function bulkApproveInvoices(
  ids: string[],
): Promise<VpActionResult<{ approved: number; failed: string[] }>> {
  const session = await getCustomSession()
  if (!isBoss(session.user.role))
    return { success: false, error: "Only management can approve invoices" }

  const failed: string[] = []
  let approved = 0

  for (const id of ids) {
    try {
      const inv = await prisma.vpInvoice.findUnique({
        where: { id }, select: { status: true },
      })
      if (!inv || inv.status !== "UNDER_REVIEW") { failed.push(id); continue }

      await prisma.vpInvoice.update({
        where: { id },
        data:  { status: "APPROVED", approvedAt: new Date() },
      })
      approved++
    } catch {
      failed.push(id)
    }
  }

  return { success: true, data: { approved, failed } }
}