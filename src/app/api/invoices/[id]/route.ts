import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BillToAddressByNameId } from "@/actions/wms/warehouse";
import { getVendorData } from "@/app/(private)/invoices/_action/invoice-list";
import { cache } from "react";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";

export const GET = cache(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const session = await getCustomSession()

  let whereClause: any = {
    id: id,
  }

  const admin = session.user.role === UserRoleEnum.BOSS || UserRoleEnum.TADMIN

  if (!admin || session.user.role === UserRoleEnum.TVENDOR) {
    const vendor = await getVendorData();
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    whereClause = {
      ...whereClause,
      vendorId: vendor.id,
    };
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: whereClause,
      include: {
        vendor: {
          include: {
            Address: true,
          },
        },
        LRRequest: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const uniqueOrigins = Array.from(new Set(invoice.LRRequest.map(lr => lr.origin).filter(Boolean)));

    const originNameMap: Record<string, string> = {};
    await Promise.all(uniqueOrigins.map(async (origin) => {
      if (!origin) {
        return ""
      }
      try {

        const { warehouseName } = await BillToAddressByNameId(origin!);
        originNameMap[origin] = warehouseName || origin;
      } catch (err) {
        console.error(`Failed to fetch warehouse name for origin: ${origin}`, err);
        originNameMap[origin] = origin;
      }
    }));

    const enrichedLRs = invoice.LRRequest.map(lr => ({
      ...lr,
      origin: lr.origin ? originNameMap[lr.origin] : lr.origin,
    }));

    return NextResponse.json({ ...invoice, LRRequest: enrichedLRs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching invoice" }, { status: 500 });
  }
}
)