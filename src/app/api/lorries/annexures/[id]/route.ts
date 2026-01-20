
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BillToAddressByNameId } from "@/actions/wms/warehouse";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1️⃣ Fetch annexure with nested LRs and invoice info
    const annexure = await prisma.annexure.findUnique({
      where: { id },
      include: {
        vendor: {
          include: { users: true }
        },
        statusHistory: {
          include: {
            changedByUser: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
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
                fileNumber: true,
                isInvoiced: true,
                invoiceId: true,
                tvendor: {
                  select: {
                    id: true,
                    name: true,
                    users: true
                  },
                },
                Invoice: {
                  select: {
                    id: true,
                    refernceNumber: true,
                    invoiceNumber: true,
                    status: true,
                    invoiceDate: true,
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

    // 2️⃣ Check if any LRs are invoiced
    const allLRs = annexure.groups.flatMap(g => g.LRs);
    const isInvoiced = allLRs.some(lr => lr.isInvoiced || lr.invoiceId);
    const invoiceDetails = allLRs.find(lr => lr.Invoice)?.Invoice || null;

    // 3️⃣ Build cache to avoid duplicate warehouse lookups
    const warehouseCache: Record<string, string> = {};

    // 4️⃣ Check for missing LRs per fileNumber
    const fileNumbers = [...new Set(annexure.groups.map(g => g.fileNumber).filter(Boolean))];
    const missingLRsPerFile: { fileNumber: string; missing: string[]; total: number; inAnnexure: number }[] = [];

    for (const fileNumber of fileNumbers) {
      const allLRsInFile = await prisma.lRRequest.findMany({
        where: { fileNumber },
        select: { LRNumber: true, annexureId: true }
      });

      const lrsInThisAnnexure = allLRsInFile.filter(lr => lr.annexureId === id);
      const lrsNotInAnnexure = allLRsInFile.filter(lr => !lr.annexureId || lr.annexureId !== id);

      if (lrsNotInAnnexure.length > 0) {
        missingLRsPerFile.push({
          fileNumber,
          missing: lrsNotInAnnexure.map(lr => lr.LRNumber),
          total: allLRsInFile.length,
          inAnnexure: lrsInThisAnnexure.length
        });
      }
    }

    // 5️⃣ Enhance *each LR* with resolved warehouse origin name
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

    // 6️⃣ Return enhanced annexure with invoice status
    return NextResponse.json({
      ...annexure,
      groups: enhancedGroups,
      isInvoiced,
      invoiceDetails,
      missingLRsPerFile,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
