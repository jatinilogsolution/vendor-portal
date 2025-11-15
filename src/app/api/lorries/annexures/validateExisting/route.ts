 


import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { lrNumbers } = await req.json()
    if (!Array.isArray(lrNumbers) || lrNumbers.length === 0)
      return NextResponse.json({ error: "Invalid LR list" }, { status: 400 })

    // 🔍 Find all LRRequests already linked to any Annexure
    const linkedLrs = await prisma.lRRequest.findMany({
      where: {
        LRNumber: { in: lrNumbers },
        annexureId: { not: null },
      },
      select: { LRNumber: true },
    })

    const linked = linkedLrs.map((l) => l.LRNumber)
    return NextResponse.json({ linked })
  } catch (err: any) {
    console.error("Error checking linked LRs:", err)
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
