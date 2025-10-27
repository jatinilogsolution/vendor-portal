"use server"

import { prisma } from "@/lib/prisma"
 
export async function updateLRStatus(
  fileNumber: string,
  status: "APPROVED" | "MISMATCHED",
  remark?: string
) {
  try {
    const updated = await prisma.lRRequest.updateMany({
      where: { fileNumber:fileNumber  },
      data: { status, remark },
    })
    return { data: updated }
  } catch (err) {
    console.error("Error updating LR status:", err)
    return { error: "Could not update status." }
  }
}