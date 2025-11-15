 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, fromDate, toDate, validatedLrs, extractedData } = body;

    if (!name || !fromDate || !toDate)
      return NextResponse.json({ error: "Missing name/dates" }, { status: 400 });

    if (!Array.isArray(validatedLrs) || validatedLrs.length === 0)
      return NextResponse.json({ error: "No LRs to save" }, { status: 400 });

    // create Annexure
    const annexure = await prisma.annexure.create({
      data: {
        name,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      },
    });

    // map extractedData for optional freight, extra, remark values
    const extractedByLr = new Map(
      (extractedData || []).map((r: any) => [
        (r["lrNumber"] || "").toString().trim(),
        r,
      ])
    );

    // Group by fileNumber directly from LRRequest in DB
    const fileGroups = new Map<
      string,
      {
        lrIds: string[];
        lrNumbers: string[];
        totalFreight: number;
        extra: number;
        remark?: string;
      }
    >();

    // Step 1: group LRs by fileNumber and collect extra costs
    for (const lrNum of validatedLrs) {
      const lr = await prisma.lRRequest.findUnique({
        where: { LRNumber: lrNum },
      });
      if (!lr) continue;

      const row = extractedByLr.get(lrNum) as Record<string, any> || {};
      const freight = Number(row["lrCost"] ?? lr.lrPrice ?? 0) || 0;
      const extra = Number(row["extraCost"] ?? 0) || 0;
      const remark = row["Remark"] ?? lr.remark ?? undefined;

      // always take fileNumber from LRRequest
      const fileNo = lr.fileNumber ?? "UNASSIGNED";

      if (!fileGroups.has(fileNo)) {
        fileGroups.set(fileNo, {
          lrIds: [],
          lrNumbers: [],
          totalFreight: 0,
          extra: 0,
          remark,
        });
      }

      const g = fileGroups.get(fileNo)!;
      g.lrIds.push(lr.id);
      g.lrNumbers.push(lr.LRNumber);
      g.totalFreight += freight;

      // apply extra to all LRs if any extra exists
      if (extra > 0) g.extra = extra;

      if (remark && !g.remark) g.remark = remark;
    }

    // Step 2: create annexureFileGroup and update all LRs in the group
    let updatedCount = 0;
    for (const [fileNumber, g] of fileGroups.entries()) {
      const totalPriceWithExtra = g.totalFreight + g.extra * g.lrIds.length;

      const fileGroup = await prisma.annexureFileGroup.create({
        data: {
          annexureId: annexure.id,
          fileNumber,
          totalPrice: totalPriceWithExtra,
          extraCost: g.extra,
          remark: g.remark,
        },
      });

      // update each LR with annexureId, groupId, lrPrice, extraCost, remark
      for (let i = 0; i < g.lrIds.length; i++) {
        const lrId = g.lrIds[i];
        const lrNum = g.lrNumbers[i];
        const row = extractedByLr.get(lrNum) as Record<string, any> || {};
        const newLrPrice = Number(row["lrCost"] ?? 0) || undefined;

        await prisma.lRRequest.update({
          where: { id: lrId },
          data: {
            annexureId: annexure.id,
            groupId: fileGroup.id,
            lrPrice: newLrPrice ?? undefined,
            // assign the same extra to all LRs in this file group
            extraCost: g.extra > 0 ? g.extra : undefined,
            remark: g.remark ?? undefined,
          },
        });

        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      annexure,
      updatedCount,
    });
  } catch (err: any) {
    console.error("saveAnnexure error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
