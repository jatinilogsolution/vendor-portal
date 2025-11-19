// remove-lr
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id} = await params
    const body = await req.json();
    const { lrNumber, confirmFileRemoval } = body;
    if (!lrNumber) return NextResponse.json({ error: "lrNumber required" }, { status: 400 });

    // find LR
    const lr = await prisma.lRRequest.findUnique({ where: { LRNumber: lrNumber } });
    if (!lr) return NextResponse.json({ error: "LR not found" }, { status: 404 });

    const fileNo = lr.fileNumber ?? null;

    // if fileNo present, count LRs with same fileNumber linked to this annexure
    if (fileNo) {
      const affected = await prisma.lRRequest.count({
        where: { fileNumber: fileNo, annexureId: id },
      });

      if (!confirmFileRemoval && affected > 1) {
        // require confirmation: return affectedCount and fileNumber
        return NextResponse.json({ requiresConfirmation: true, fileNumber: fileNo, affectedCount: affected }, { status: 200 });
      }

      // proceed: unlink all LRs for this fileNumber (if confirmed) or only this LR if affected===1 or no confirm
      const whereClause = confirmFileRemoval ? { fileNumber: fileNo, annexureId: id } : { LRNumber: lrNumber, annexureId: id };
      const updated = await prisma.lRRequest.updateMany({
        where: whereClause,
        data: { annexureId: null, groupId: null },
      });

      return NextResponse.json({ success: true, removedCount: updated.count });
    } else {
      // no fileNumber: just unlink single LR
      const updated = await prisma.lRRequest.updateMany({
        where: { LRNumber: lrNumber, annexureId: id },
        data: { annexureId: null, groupId: null },
      });
      return NextResponse.json({ success: true, removedCount: updated.count });
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal" }, { status: 500 });
  }
}
 