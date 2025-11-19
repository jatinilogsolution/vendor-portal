
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BillToAddressByNameId } from "@/actions/wms/warehouse";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1️⃣ Fetch annexure with nested LRs
    const annexure = await prisma.annexure.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            LRs: {
              select: {
                id: true,
                LRNumber: true,
                CustomerName: true,
                vehicleNo: true,
                vehicleType: true,
                origin: true,
                destination: true,
                outDate: true,
                lrPrice: true,
                extraCost: true,
                podlink: true,
                tvendor: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!annexure)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2️⃣ Build cache to avoid duplicate warehouse lookups
    const warehouseCache: Record<string, string> = {};

    // 3️⃣ Enhance *each LR* with resolved warehouse origin name
    const enhancedGroups = await Promise.all(
      annexure.groups.map(async (group) => {
        const enhancedLRs = await Promise.all(
          group.LRs.map(async (lr) => {
            const originId = lr.origin;

            if (originId && !warehouseCache[originId]) {
              try {
                const { warehouseName } = await BillToAddressByNameId(originId);
                warehouseCache[originId] = warehouseName || originId;
              } catch (err) {
                console.warn(
                  `Failed to fetch warehouse name for ID: ${originId}`,
                  err
                );
                warehouseCache[originId] = originId;
              }
            }

            return {
              ...lr,
              origin: warehouseCache[originId!] ?? originId,
            };
          })
        );

        return {
          ...group,
          LRs: enhancedLRs,
        };
      })
    );

    // 4️⃣ Return enhanced annexure
    return NextResponse.json({
      ...annexure,
      groups: enhancedGroups,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
