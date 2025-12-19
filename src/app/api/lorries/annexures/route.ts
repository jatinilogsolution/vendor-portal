import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get("vendorId");

    // Build where clause
    const whereClause: any = {};

    // If vendorId is provided, only show annexures containing LRs from that vendor
    if (vendorId) {
      whereClause.LRRequest = {
        some: {
          tvendorId: vendorId
        }
      };
    }

    const annexures = await prisma.annexure.findMany({
      where: whereClause,
      orderBy: { fromDate: "desc" },
      include: {
        _count: { select: { LRRequest: true } },
        groups: { select: { fileNumber: true, totalPrice: true, extraCost: true } },
        // Get invoice and vendor info from the first LR
        LRRequest: {
          take: 1,
          select: {
            isInvoiced: true,
            tvendor: {
              select: {
                id: true,
                name: true,
              }
            },
            Invoice: {
              select: {
                id: true,
                refernceNumber: true,
                invoiceNumber: true,
                status: true,
              }
            }
          }
        }
      },
    });

    // Transform response to include isInvoiced flag, invoice details, and vendor info
    const annexuresWithDetails = annexures.map(annexure => {
      const firstLR = annexure.LRRequest[0];
      const invoiceDetails = firstLR?.Invoice || null;
      const vendorInfo = firstLR?.tvendor || null;
      const isInvoiced = firstLR?.isInvoiced || !!invoiceDetails;

      // Remove LRRequest from response (it was only used to get info)
      const { LRRequest, ...rest } = annexure;

      return {
        ...rest,
        isInvoiced,
        invoiceDetails,
        vendor: vendorInfo,
      };
    });

    return NextResponse.json(annexuresWithDetails);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch annexures" }, { status: 500 });
  }
}

