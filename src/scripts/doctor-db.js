

import { prisma } from "@/lib/prisma";

async function main() {
    console.log("Checking for invalid foreign keys in LRRequest...");

    // Find LRs with annexureId that doesn't exist in Annexure table
    const lrs = await prisma.lRRequest.findMany({
        where: {
            annexureId: { not: null }
        },
        select: {
            id: true,
            LRNumber: true,
            annexureId: true
        }
    });

    const annexureIds = new Set((await prisma.annexure.findMany({ select: { id: true } })).map(a => a.id));

    const invalidLrs = lrs.filter(lr => !annexureIds.has(lr.annexureId));

    if (invalidLrs.length > 0) {
        console.log(`Found ${invalidLrs.length} invalid annexure links in LRRequest.`);
        for (const lr of invalidLrs) {
            console.log(`LR ${lr.LRNumber} (ID: ${lr.id}) points to non-existent annexure ${lr.annexureId}`);
        }

        // NULL out these invalid links
        const idsToFix = invalidLrs.map(lr => lr.id);
        await prisma.lRRequest.updateMany({
            where: { id: { in: idsToFix } },
            data: { annexureId: null }
        });
        console.log("Fixed invalid links in LRRequest.");
    } else {
        console.log("No invalid annexure links found in LRRequest.");
    }

    // Also check Invoice -> Annexure (though this column might not exist yet)
    try {
        const invoicesWithAnnexure = await prisma.invoice.findMany({
            where: { annexureId: { not: null } },
            select: { id: true, annexureId: true }
        });
        console.log(`Found ${invoicesWithAnnexure.length} invoices with annexure links. (Checking if table has column)`);
    } catch (e) {
        console.log("Invoice.annexureId column does not exist yet (as expected).");
    }

}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
