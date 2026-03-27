// src/actions/vp/bank-details.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { VpActionResult } from "@/types/vendor-portal"
import { bankDetailsSchema, BankDetailsValues } from "@/validations/vp/bank-details"

export type VpBankDetailsRow = {
  id:                string
  accountHolderName: string
  accountNumber:     string
  ifscCode:          string
  bankName:          string
  branch:            string | null
  accountType:       string
  verifiedAt:        Date | null
}

export async function getVpVendorBankDetails(
  vpVendorId: string,
): Promise<VpActionResult<VpBankDetailsRow | null>> {
  try {
    const d = await prisma.vpVendorBankDetails.findUnique({
      where: { vpVendorId },
    })
    return { success: true, data: d }
  } catch (e) {
    return { success: false, error: "Failed to fetch bank details" }
  }
}

export async function upsertVpVendorBankDetails(
  vpVendorId: string,
  raw: BankDetailsValues,
): Promise<VpActionResult<null>> {
  const session = await getCustomSession()

  // Vendor can update their own; Admin can update any
  const isAdmin = session.user.role === "ADMIN"
  if (!isAdmin) {
    // verify vendor owns this vpVendorId
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }, select: { vendorId: true },
    })
    const vpv = user?.vendorId
      ? await prisma.vpVendor.findFirst({
          where: { existingVendorId: user.vendorId, id: vpVendorId },
        })
      : null
    if (!vpv) return { success: false, error: "Not authorised to update these bank details" }
  }

  const parsed = bankDetailsSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  const d = parsed.data

  try {
    await prisma.vpVendorBankDetails.upsert({
      where:  { vpVendorId },
      create: { vpVendorId, ...d },
      update: d,
    })
    return { success: true, data: null }
  } catch (e) {
    return { success: false, error: "Failed to save bank details" }
  }
}

export async function verifyVpVendorBankDetails(
  vpVendorId: string,
): Promise<VpActionResult<null>> {
  const session = await getCustomSession()
  if (!["ADMIN", "BOSS"].includes(session.user.role))
    return { success: false, error: "Insufficient permissions" }

  await prisma.vpVendorBankDetails.update({
    where: { vpVendorId },
    data:  { verifiedAt: new Date(), verifiedById: session.user.id },
  })
  return { success: true, data: null }
}