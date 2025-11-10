// // // // app/api/annexures/saveAnnexure/route.ts
// // // import { NextResponse } from "next/server";
// // // import { prisma } from "@/lib/prisma";

// // // export async function POST(req: Request) {
// // //   try {
// // //     const body = await req.json();
// // //     const { lrNumbers, name, fromDate, toDate } = body;

// // //     if (!lrNumbers || lrNumbers.length === 0)
// // //       return NextResponse.json({ error: "No LR numbers provided" }, { status: 400 });

// // //     // Step 1. Create Annexure
// // //     const annexure = await prisma.annexure.create({
// // //       data: {
// // //         name,
// // //         fromDate: new Date(fromDate),
// // //         toDate: new Date(toDate),
// // //       },
// // //     });

// // //     // Step 2. Update LRRequests with this annexureId
// // //     const updated = await prisma.lRRequest.updateMany({
// // //       where: {
// // //         LRNumber: { in: lrNumbers },
// // //       },
// // //       data: {
// // //         annexureId: annexure.id,
// // //       },
// // //     });

// // //     return NextResponse.json({
// // //       success: true,
// // //       annexure,
// // //       updatedCount: updated.count,
// // //     });
// // //   } catch (error) {
// // //     console.error(error);
// // //     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
// // //   }
// // // }



// // // app/api/lorries/annexures/saveAnnexure/route.ts
// // import { NextResponse } from "next/server"
// // import { prisma } from "@/lib/prisma"

// // export async function POST(req: Request) {
// //   try {
// //     const body = await req.json()
// //     const { lrNumbers, name, fromDate, toDate, extractedData } = body

// //     if (!lrNumbers?.length) {
// //       return NextResponse.json({ error: "No LR numbers provided" }, { status: 400 })
// //     }

// //     // 🔹 Find duplicates (LRs already linked to annexures)
// //     const alreadyLinked = await prisma.lRRequest.findMany({
// //       where: { LRNumber: { in: lrNumbers }, annexureId: { not: null } },
// //       select: { LRNumber: true, annexureId: true, fileNumber: true },
// //     })

// //     // 🔹 Get full LR info
// //     const matchedLRs = await prisma.lRRequest.findMany({
// //       where: { LRNumber: { in: lrNumbers } },
// //       include: { Annexure: true },
// //     })

// //     // 🔹 Prepare group by fileNumber (for frontend grouping)
// //     const grouped: Record<string, any[]> = {}
// //     for (const lr of matchedLRs) {
// //       if (!grouped[lr.fileNumber]) grouped[lr.fileNumber] = []
// //       grouped[lr.fileNumber].push(lr)
// //     }

// //     // 🔹 Identify extra cost cases with no document
// //     const missingDocs = []
// //     for (const [fileNumber, group] of Object.entries(grouped)) {
// //       const hasExtra = group.some((g) => g.extraCost && g.extraCost > 0)
// //       const document = await prisma.document.findUnique({ where: { linkedId: fileNumber } })
// //       if (hasExtra && !document) {
// //         missingDocs.push({ fileNumber, count: group.length })
// //       }
// //     }

// //     // 🔹 Create Annexure if valid
// //     const annexure = await prisma.annexure.create({
// //       data: { name, fromDate: new Date(fromDate), toDate: new Date(toDate) },
// //     })

// //     // Update LR data (same logic)
// //     const fileExtraApplied = new Set<string>()
// //     for (const lr of matchedLRs) {
// //       const excelRow = extractedData?.find((r: any) => r["LR Number"] === lr.LRNumber)
// //       if (!excelRow) continue

// //       const freightCost = parseFloat(excelRow["Vendor Freight Cost"]) || 0
// //       const extraCost = parseFloat(excelRow["Extra Cost"]) || 0
// //       const remark = excelRow["Remark"] || null

// //       let applyExtra = 0
// //       if (extraCost > 0 && !fileExtraApplied.has(lr.fileNumber)) {
// //         applyExtra = extraCost
// //         fileExtraApplied.add(lr.fileNumber)
// //       }

// //       await prisma.lRRequest.update({
// //         where: { id: lr.id },
// //         data: {
// //           annexureId: annexure.id,
// //           lrPrice: freightCost,
// //           extraCost: applyExtra,
// //           remark,
// //         },
// //       })
// //     }

// //     return NextResponse.json({
// //       success: true,
// //       annexure,
// //       stats: {
// //         total: matchedLRs.length,
// //         alreadyLinked: alreadyLinked.length,
// //         missingDocs: missingDocs.length,
// //       },
// //       alreadyLinked,
// //       missingDocs,
// //       grouped,
// //     })
// //   } catch (error) {
// //     console.error("Save Annexure Error:", error)
// //     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
// //   }
// // }


// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { name, fromDate, toDate, validatedLrs, extractedData } = body

//     if (!Array.isArray(validatedLrs) || validatedLrs.length === 0) {
//       return NextResponse.json({ error: 'No validated LRs provided' }, { status: 400 })
//     }

//     // Create annexure
//     const annexure = await prisma.annexure.create({
//       data: { name, fromDate: new Date(fromDate), toDate: new Date(toDate) },
//     })

//     // Map extractedData by LR Number for easy lookup
//     const extractedByLr = new Map((extractedData || []).map((r: any) => [(r['LR Number'] || '').toString().trim(), r]))

//     // Keep track of fileNumbers to apply extra cost only once per fileNumber
//     const appliedExtraPerFile = new Set<string>()

//     let updatedCount = 0

//     for (const lrNum of validatedLrs) {
//       const lr = await prisma.lRRequest.findUnique({ where: { LRNumber: lrNum } })
//       if (!lr) continue

//       // skip if already linked by DB
//       if (lr.annexureId) continue

//       const row = extractedByLr.get(lrNum) as Record<string, any> || {};
//       const freight = parseFloat((row["Vendor Freight Cost"] || 0).toString()) || 0;
//       const extra = parseFloat((row["Extra Cost"] || 0).toString()) || 0;
//       const remark = row["Remark"] || null;

//       // apply extra only once per fileNumber
//       let extraToApply = 0
//       if (extra > 0 && lr.fileNumber && !appliedExtraPerFile.has(lr.fileNumber)) {
//         extraToApply = extra
//         appliedExtraPerFile.add(lr.fileNumber)
//       }

//       await prisma.lRRequest.update({
//         where: { id: lr.id },
//         data: {
//           annexureId: annexure.id,
//           lrPrice: freight || undefined,
//           extraCost: extraToApply || undefined,
//           remark: remark || undefined,
//         },
//       })

//       updatedCount++
//     }

//     return NextResponse.json({ success: true, annexure, updatedCount })
//   } catch (err) {
//     console.error(err)
//     return NextResponse.json({ error: 'Internal' }, { status: 500 })
//   }
// }
// app/api/lorries/annexures/saveAnnexure/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Body: {
 *   name, fromDate, toDate,
 *   validatedLrs: string[] (lrNumbers to commit),
 *   extractedData: [{ 'LR Number', 'Vendor Freight Cost', 'Extra Cost', remark, fileNumber }]
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, fromDate, toDate, validatedLrs, extractedData } = body;

    if (!name || !fromDate || !toDate) {
      return NextResponse.json({ error: "Missing annexure name or dates" }, { status: 400 });
    }
    if (!Array.isArray(validatedLrs) || validatedLrs.length === 0) {
      return NextResponse.json({ error: "No validated LRs provided" }, { status: 400 });
    }

    // Create annexure record
    const annexure = await prisma.annexure.create({
      data: {
        name,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      },
    });

    // map extracted data by LR number
    const extractedByLr = new Map((extractedData || []).map((r: any) => [String(r["LR Number"] || "").trim(), r]));

    // apply extra cost only once per fileNumber
    const appliedExtraPerFile = new Set<string>();

    let updatedCount = 0;
    const skipped: string[] = [];
    const errors: string[] = [];

    for (const lrNum of validatedLrs) {
      const lr = await prisma.lRRequest.findUnique({ where: { LRNumber: lrNum } });
      if (!lr) {
        skipped.push(lrNum);
        continue;
      }
      // skip if already linked
      if (lr.annexureId) {
        skipped.push(lrNum);
        continue;
      }

      // const row = extractedByLr.get(lrNum) || {};
      // const freight = Number(row["Vendor Freight Cost"] ?? 0) || undefined;
      // const extra = Number(row["Extra Cost"] ?? 0) || 0;
      // const remark = row["Remark"] ?? undefined;


      const row = extractedByLr.get(lrNum) as Record<string, any> || {};
      const freight = parseFloat((row["Vendor Freight Cost"] || 0).toString()) || 0;
      const extra = parseFloat((row["Extra Cost"] || 0).toString()) || 0;
      const remark = row["Remark"] || null;

      // only apply extra once per fileNumber
      let extraToApply = undefined;
      if (extra > 0 && lr.fileNumber && !appliedExtraPerFile.has(lr.fileNumber)) {
        extraToApply = extra;
        appliedExtraPerFile.add(lr.fileNumber);
      }

      try {
        await prisma.lRRequest.update({
          where: { id: lr.id },
          data: {
            annexureId: annexure.id,
            lrPrice: freight,
            extraCost: extraToApply,
            remark,
          },
        });
        updatedCount++;
      } catch (e: any) {
        console.error("update lr error", lrNum, e);
        errors.push(`${lrNum}: ${e.message ?? "update error"}`);
      }
    }

    return NextResponse.json({
      success: true,
      annexure,
      updatedCount,
      skipped,
      errors,
    });
  } catch (err: any) {
    console.error("saveAnnexure error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
