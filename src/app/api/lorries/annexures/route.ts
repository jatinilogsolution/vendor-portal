import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get("vendorId");

    const status = searchParams.get("status");

    // Build where clause
    const whereClause: any = {};

    // If vendorId is provided, only show annexures from that vendor
    if (vendorId) {
      whereClause.vendorId = vendorId;
    }

    // Status filtering
    if (status && status !== "ALL") {
      if (status === "REJECTED") {
        whereClause.OR = [
          { status: "HAS_REJECTIONS" },
          { status: "REJECTED_BY_BOSS" }
        ];
      } else {
        whereClause.status = status;
      }
    }

    // Fetch annexures and counts separately for better performance
    const [annexures, statusCounts] = await Promise.all([
      prisma.annexure.findMany({
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
      }),
      prisma.annexure.groupBy({
        by: ['status'],
        where: vendorId ? { vendorId } : {},
        _count: {
          id: true
        }
      })
    ]);

    // Transform status counts to a simple object
    const stats: Record<string, number> = {};
    statusCounts.forEach(c => {
      stats[c.status] = c._count.id;
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

    return NextResponse.json({
      annexures: annexuresWithDetails,
      stats
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch annexures" }, { status: 500 });
  }
}

