

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingRow = Record<string, any>;

function normalizeRow(r: IncomingRow) {
  const norm: any = {};
  for (const k of Object.keys(r)) norm[String(k).trim()] = r[k];
  norm["LR Number"] = String(norm["LR Number"] ?? norm["LRNumber"] ?? norm["LR"] ?? "").trim();
  norm["Vendor Freight Cost"] = Number(norm["Vendor Freight Cost"] ?? norm["Freight"] ?? norm["FreightCost"] ?? 0);
  norm["Extra Cost"] = Number(norm["Extra Cost"] ?? norm["Extra"] ?? norm["extraCost"] ?? 0);
  norm["Remark"] = String(norm["Remark"] ?? norm["Remarks"] ?? "").trim();
  norm["fileNumber_sheet"] = String(norm["File Number"] ?? norm["fileNumber"] ?? "").trim() || null;
  return norm;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body.annexureData) ? body.annexureData : [];

    if (!rows.length)
      return NextResponse.json({ error: "No data provided" }, { status: 400 });

    const normalized = rows.map(normalizeRow);
    const uploadedLrs = Array.from(
      new Set(normalized.map((r: any) => r["LR Number"]).filter(Boolean))
    );

    // STEP 1: Fetch all LRRequests matching uploaded LRs
    const uploadedLrRecords = await prisma.lRRequest.findMany({
      where: { LRNumber: { in: uploadedLrs as string[] } },
      select: {
        id: true,
        LRNumber: true,
        fileNumber: true,
        annexureId: true,
        podlink: true,
        lrPrice: true,
        extraCost: true,
        remark: true,
        vehicleNo: true,
        vehicleType: true,
        outDate: true,
        CustomerName: true,
        isInvoiced: true,
        origin: true,
        tvendor: { select: { name: true, id: true } },
      },
    });

    const fileNumbersFromUpload = Array.from(
      new Set(
        uploadedLrRecords
          .map((d) => d.fileNumber)
          .filter(Boolean)
      )
    );

    // STEP 2: Fetch ALL LRs from those file numbers (including ones not uploaded)
    const allLrsForFiles = fileNumbersFromUpload.length
      ? await prisma.lRRequest.findMany({
        where: { fileNumber: { in: fileNumbersFromUpload } },
        select: {
          id: true,
          LRNumber: true,
          fileNumber: true,
          annexureId: true,
          podlink: true,
          lrPrice: true,
          extraCost: true,
          remark: true,
          vehicleNo: true,
          vehicleType: true,
          outDate: true,
          CustomerName: true,
          origin: true,
          isInvoiced: true,
          tvendor: { select: { name: true, id: true } },
        },
      })
      : uploadedLrRecords;

    const allDbByLr = new Map(allLrsForFiles.map((d) => [d.LRNumber, d]));

    // STEP 3: Fetch docs for both fileNumbers and LRNumbers
    const allLinkedIds = [
      ...fileNumbersFromUpload,
      ...Array.from(allDbByLr.keys()),
    ].filter(Boolean) as string[];

    const docs = await prisma.document.findMany({
      where: { linkedId: { in: allLinkedIds } },
      select: { id: true, linkedId: true, url: true, label: true },
    });
    const docsByLinkedId = new Map(docs.map((d) => [d.linkedId, d]));

    // STEP 4: Build validationRows including both uploaded & missing ones
    const seen = new Set<string>();
    const validationRows: any[] = [];

    // include all uploaded LRs
    for (const r of normalized) {
      const lrNum = r["LR Number"];
      seen.add(lrNum);
      const db = allDbByLr.get(lrNum);
      const fileNumber = db?.fileNumber ?? r.fileNumber_sheet ?? null;

      const row: any = {
        lrNumber: lrNum,
        fileNumber,
        freightCost: Number(r["Vendor Freight Cost"] || 0),
        extraCost: Number(r["Extra Cost"] || 0),
        remark: r["Remark"] || "",
        lrId: db?.id ?? null,
        annexureId: db?.annexureId ?? null,
        vehicleNo: db?.vehicleNo ?? null,
        vehicleType: db?.vehicleType ?? null,
        outDate: db?.outDate ? db.outDate.toISOString() : null,
        podLink: db?.podlink ?? null,
        issues: [] as string[],
        extraCostAttachment: false,
        status: "NOT_FOUND" as "FOUND" | "ALREADY_LINKED" | "NOT_FOUND" | "ALREADY_INVOICED",
        customerName: db?.CustomerName ?? null,
        vendorName: db?.tvendor?.name ?? null,
        vendorId: db?.tvendor?.id ?? null,
        origin: db?.origin ?? null,
        isInvoiced: db?.isInvoiced ?? null,

      };

      if (!db) {
        row.issues.push("LR not found in system");
      } else if (db.annexureId) {
        row.status = "ALREADY_LINKED";
        row.issues.push("Already linked to another annexure");
      } else if (db.isInvoiced) {
        row.status = "ALREADY_INVOICED";
        row.issues.push("Already invoiced");
      } else {
        row.status = "FOUND";
        if (!db.podlink) row.issues.push("POD missing");
      }

      if (row.extraCost > 0) {
        const docForFile = fileNumber ? docsByLinkedId.get(fileNumber) : null;
        const docForLr = docsByLinkedId.get(lrNum) ?? null;
        if (!docForFile && !docForLr) row.issues.push("Extra cost proof missing");
        else row.extraCostAttachment = true;
      }

      validationRows.push(row);
    }

    // Include DB-only LRs (not uploaded)
    for (const db of allLrsForFiles) {
      if (seen.has(db.LRNumber)) continue;
      validationRows.push({
        lrNumber: db.LRNumber,
        fileNumber: db.fileNumber,
        freightCost: db.lrPrice ?? 0,
        extraCost: db.extraCost ?? 0,
        remark: db.remark ?? "",
        lrId: db.id,
        annexureId: db.annexureId,
        vehicleNo: db.vehicleNo,
        vehicleType: db.vehicleType,
        outDate: db.outDate ? db.outDate.toISOString() : null,
        podLink: db.podlink,
        issues: ["LR from this file not included in upload"],
        extraCostAttachment: !!docsByLinkedId.get(db.LRNumber),
        invoiceId: db.isInvoiced,
        status: db.annexureId ? "ALREADY_LINKED" : db.isInvoiced ? 'ALREADY_INVOICED' : 'FOUND',
        customerName: db.CustomerName,
        vendorName: db.tvendor?.name,
        vendorId: db.tvendor?.id,
        origin: db.origin,
      });
    }

    // Group by fileNumber
    const grouped: Record<string, any[]> = {};
    for (const r of validationRows) {
      const key = r.fileNumber ?? "UNASSIGNED";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(r);
    }

    const summary = {
      totalRows: validationRows.length,
      found: validationRows.filter((r: any) => r.status === "FOUND").length,
      linked: validationRows.filter((r: any) => r.status === "ALREADY_LINKED").length,
      invoiced: validationRows.filter((r: any) => r.status === "ALREADY_INVOICED").length, 
      notFound: validationRows.filter((r: any) => r.status === "NOT_FOUND").length,
      files: Object.keys(grouped).length,
    };

    return NextResponse.json({ validationRows, grouped, summary });
  } catch (err: any) {
    console.error("validate error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
