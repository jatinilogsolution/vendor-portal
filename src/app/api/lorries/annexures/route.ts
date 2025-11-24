import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const annexures = await prisma.annexure.findMany({
      orderBy: { fromDate: "desc" },
      include: {
        _count: { select: { LRRequest: true } },
        groups: { select: { fileNumber: true, totalPrice: true, extraCost: true } },
      },
    });
    return NextResponse.json(annexures);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch annexures" }, { status: 500 });
  }
}
