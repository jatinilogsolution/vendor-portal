// app/api/lorry/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const vendor = url.searchParams.get("vendor") || undefined
  const rawPage = Number(url.searchParams.get("page") || "1")
  const rawLimit = Number(url.searchParams.get("limit") || "10")
  const query = (url.searchParams.get("query") || "").trim()

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1
  const limitBase = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 10
  const limit = Math.min(50, Math.max(1, limitBase))

  const where: any = {}
  if (vendor) {
    where.transporter = vendor
  }
  if (query) {
    where.OR = [
      { lrNo: { contains: query, mode: "insensitive" } },
      { warehouse: { contains: query, mode: "insensitive" } },
      { city: { contains: query, mode: "insensitive" } },
    ]
  }

  const [lorryReceipts, totalItems] = await Promise.all([
    prisma.lorryReceipt.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { lrDate: "desc" },
    }),
    prisma.lorryReceipt.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  return NextResponse.json({ lorryReceipts, totalItems, page, limit, totalPages }, { status: 200 })
}
