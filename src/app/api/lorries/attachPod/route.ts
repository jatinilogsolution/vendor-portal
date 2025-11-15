// src/app/api/lorries/attachPod/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { lrNumber, url } = await req.json()
    if (!lrNumber || !url) return NextResponse.json({ error: "lrNumber and url are required" }, { status: 400 })
    const updated = await prisma.lRRequest.updateMany({ where: { LRNumber: lrNumber }, data: { podlink: url } })
    return NextResponse.json({ success: true, updatedCount: updated.count })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: "Internal" }, { status: 500 })
  }
}
