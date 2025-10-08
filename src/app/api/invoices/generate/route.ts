import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { vendorId, fileNumbers } = await req.json();

    if (!vendorId || !fileNumbers?.length) {
      return NextResponse.json({ error: "Vendor ID and fileNumbers are required" }, { status: 400 });
    }

    // Fetch all LRs for selected fileNumbers
    const allLRs = await prisma.lRRequest.findMany({
      where: { tvendorId: vendorId, fileNumber: { in: fileNumbers } },
    });

    // Validate all have PODs
    const missingPODs = allLRs.filter((lr) => !lr.podlink);
    if (missingPODs.length > 0) {
      const missingFiles = [...new Set(missingPODs.map((lr) => lr.fileNumber))];
      return NextResponse.json({
        error: `Missing PODs for file(s): ${missingFiles.join(", ")}`,
      }, { status: 400 });
    }

    // Group LRs by fileNumber
    const grouped = allLRs.reduce((acc: Record<string, typeof allLRs>, lr) => {
      acc[lr.fileNumber] = acc[lr.fileNumber] || [];
      acc[lr.fileNumber].push(lr);
      return acc;
    }, {});

    // Create invoice for each fileNumber
    const invoices = [];
    for (const [fileNo, lrs] of Object.entries(grouped)) {
      const invoice = await prisma.invoice.create({
        data: {
          vendorId,
          invoiceNumber: `INV-${Date.now()}-${fileNo}`,
          invoiceDate: new Date(),
          status: "DRAFT",
          items: {
            create: lrs.map((lr) => ({
              description: `Freight for LR ${lr.LRNumber} (${lr.origin} → ${lr.destination})`,
              quantity: 1,
              unitPrice: lr.priceSettled || 0,
              total: lr.priceSettled || 0,
            })),
          },
          LRRequest: {
            connect: lrs.map((lr) => ({ id: lr.id })),
          },
        },
      });
      invoices.push(invoice);
    }

    return NextResponse.json({ success: true, invoices });
  } catch (err) {
    console.error("Invoice generation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
