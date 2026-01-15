// save-edit
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncInvoiceFromAnnexure } from "../../../../../(private)/lorries/_action/annexure";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { groups } = body; // [{ groupId, remark, extraCost }]

    if (!Array.isArray(groups)) return NextResponse.json({ error: "groups required" }, { status: 400 });

    // update each group and propagate extraCost/remark to LRs in that group
    for (const g of groups) {
      const { groupId, remark, extraCost } = g;
      // update group
      await prisma.annexureFileGroup.update({
        where: { id: groupId },
        data: {
          remark: remark ?? undefined,
          extraCost: typeof extraCost === "number" ? extraCost : undefined,
        },
      });

      // update LRs in group: set remark, set extraCost on all LRs if extraCost > 0
      await prisma.lRRequest.updateMany({
        where: { groupId },
        data: {
          remark: remark ?? undefined,
          extraCost: typeof extraCost === "number" && extraCost > 0 ? extraCost : undefined,
        },
      });

      // recalc totalPrice: sum lrPrice + extraCost * count
      const ag = await prisma.lRRequest.aggregate({
        _sum: { lrPrice: true },
        _count: { id: true },
        where: { groupId },
      });
      const sum = (ag._sum.lrPrice || 0)
      const cnt = ag._count.id || 0
      const totalPrice = sum + (typeof extraCost === "number" && extraCost > 0 ? extraCost * cnt : 0)

      await prisma.annexureFileGroup.update({
        where: { id: groupId },
        data: { totalPrice },
      });
    }

    // 🔗 SYNC LINKED INVOICE
    const { id: annexureId } = await params;
    await syncInvoiceFromAnnexure(annexureId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal" }, { status: 500 });
  }
}
 