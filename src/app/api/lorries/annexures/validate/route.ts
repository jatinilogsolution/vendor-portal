// app/api/lorries/annexures/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST body: { annexureData: Array<object> }
 * - Excel rows parsed on client and sent as annexureData
 * Response: { validationRows: [...], grouped: { fileNumber: [...] }, summary: {...} }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body.annexureData) ? body.annexureData : [];

    if (!rows.length) {
      return NextResponse.json({ error: "No annexure data received" }, { status: 400 });
    }

    // Normalize keys & values for each row
    const normalized = rows.map((r:any) => {
      const out: Record<string, any> = {};
      for (const k of Object.keys(r)) out[String(k).trim()] = r[k];
      // unify LR key variants
      out["LR Number"] = String(out["LR Number"] ?? out["LRNumber"] ?? out["LR"] ?? "").trim();
      out["Vendor Freight Cost"] = Number(out["Vendor Freight Cost"] ?? out["Freight"] ?? out["FreightCost"] ?? 0);
      out["Extra Cost"] = Number(out["Extra Cost"] ?? out["Extra"] ?? out["extraCost"] ?? 0);
      out["Remark"] = String(out["Remark"] ?? out["Remarks"] ?? out["remark"] ?? "").trim();
      // fileNumber may be present or not in sheet — we'll rely on DB fileNumber if not present
      out["fileNumber_sheet"] = String(out["File Number"] ?? out["fileNumber"] ?? out["FileNo"] ?? "").trim() || null;
      return out;
    });

    // Create list of LR numbers to search in DB (unique)
    const lrNumbers = Array.from(
      new Set(normalized.map((r: any) => r["LR Number"]).filter(Boolean))
    );

    // Query DB for LRs
    const dbLrs = await prisma.lRRequest.findMany({
      where: { LRNumber: { in: lrNumbers as string[] } },
      select: {
        id: true,
        LRNumber: true,
        fileNumber: true,
        podlink: true,
        lrPrice: true,
        extraCost: true,
        remark: true,
        invoiceId: true,
        annexureId: true,
      },
    });

    const dbByLr = new Map(dbLrs.map((d) => [d.LRNumber, d]));

    // Build fileNumber set (from DB) to check attachments by fileNumber
    const fileNumbersFromDb = Array.from(new Set(dbLrs.map((d) => d.fileNumber).filter(Boolean)));

    
    // Fetch documents for fileNumbers and for LRNumbers (some docs may be linked to LR)
    const docs = await prisma.document.findMany({
      where: {
        linkedId: { in: [...fileNumbersFromDb, ...lrNumbers].filter(Boolean) as string[] },
      },
      select: { id: true, linkedId: true, url: true, label: true, description: true },
    });
    const docsByLinkedId = new Map(docs.map((d) => [d.linkedId, d]));

    // Build validationRows
    const validationRows: any[] = normalized.map((r: any) => {
      const lrNum = r["LR Number"];
      const db = dbByLr.get(lrNum) || null;
      const fileNumber = db?.fileNumber ?? r.fileNumber_sheet ?? null;

      const row: any = {
        lrNumber: lrNum,
        fileNumber,
        freightCost: Number(r["Vendor Freight Cost"] || 0),
        extraCost: Number(r["Extra Cost"] || 0),
        remark: r["Remark"] || "",
        status: db ? "FOUND" : "NOT_FOUND",
        lrId: db?.id ?? null,
        podLink: db?.podlink ?? null,
        invoiceId: db?.invoiceId ?? null,
        annexureId: db?.annexureId ?? null,
        dbPresent: !!db,
        issues: [] as string[],
        extraCostAttachment: false,
      };

      // validations:
      if (!db) row.issues.push("LR not present in LRRequest table");
      // pod
      if (!db?.podlink) row.issues.push("POD missing");
      // record has extra cost but check doc presence (doc can be linked to fileNumber or LR)
      if (row.extraCost > 0) {
        const docForFile = fileNumber ? docsByLinkedId.get(fileNumber) : null;
        const docForLr = docsByLinkedId.get(lrNum) ?? null;
        if (!docForFile && !docForLr) {
          row.issues.push("Extra cost present but no proof attachment (file or LR)");
          row.extraCostAttachment = false;
        } else {
          row.extraCostAttachment = true;
        }
      }

      // If LR already linked to another annexure -> flag but still include (we won't auto-update)
      if (db?.annexureId) row.issues.push("LR already linked to an annexure");

      return row;
    });

    // Group by fileNumber (use UNASSIGNED for null)
    const grouped: Record<string, any[]> = {};
    for (const r of validationRows) {
      const key = r.fileNumber ?? "UNASSIGNED";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    }

    // Build summary
    const summary = {
      totalRows: validationRows.length,
      found: validationRows.filter((r) => r.status === "FOUND").length,
      notFound: validationRows.filter((r) => r.status === "NOT_FOUND").length,
      issues: validationRows.filter((r) => r.issues.length > 0).length,
      files: Object.keys(grouped).length,
    };

    return NextResponse.json({ validationRows, grouped, summary }, { status: 200 });
  } catch (err: any) {
    console.error("validate error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
