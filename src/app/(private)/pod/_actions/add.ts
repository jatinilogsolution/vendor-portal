"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type LRStatus = "PENDING" | "VERIFIED" | "WRONG"

// Update all LRs for a file number (used in approval card)
export async function updateLRStatus(
  fileNumber: string,
  status: "APPROVED" | "MISMATCHED",
  remark?: string
) {
  try {
    // Map approval status to LR status
    const lrStatus: LRStatus = status === "APPROVED" ? "VERIFIED" : "WRONG"

    const updated = await prisma.lRRequest.updateMany({
      where: { fileNumber: fileNumber },
      data: {
        status: lrStatus,
        remark,
        updatedAt: new Date()
      },
    })

    revalidatePath(`/pod/${fileNumber}`)
    revalidatePath('/pod')

    return { data: updated }
  } catch (err) {
    console.error("Error updating LR status:", err)
    return { error: "Could not update status." }
  }
}

// Update individual LR status (for manual verification)
export async function updateIndividualLRStatus(
  lrNumber: string,
  status: LRStatus,
  remark?: string
) {
  try {
    const updated = await prisma.lRRequest.update({
      where: { LRNumber: lrNumber },
      data: {
        status,
        remark,
        updatedAt: new Date()
      },
    })

    // Revalidate both the detail page and list page
    if (updated.fileNumber) {
      revalidatePath(`/pod/${updated.fileNumber}`)
    }
    revalidatePath('/pod')

    return { data: updated }
  } catch (err) {
    console.error("Error updating individual LR status:", err)
    return { error: "Could not update LR status." }
  }
}