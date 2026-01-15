import { prisma } from "@/lib/prisma";




async function main() {
    console.log("Starting diagnostic cleanup and data migration...");

    // 0. Cleanup invalid foreign keys in LRRequest (Fixes db push conflict)
    console.log("Checking for invalid annexureId in LRRequest...");
    const lrs = await prisma.lRRequest.findMany({
        where: { annexureId: { not: null } },
        select: { id: true, LRNumber: true, annexureId: true }
    });

    const validAnnexureIds = new Set((await prisma.annexure.findMany({ select: { id: true } })).map(a => a.id));
    const invalidLrs = lrs.filter(lr => !lr.annexureId || !validAnnexureIds.has(lr.annexureId));

    if (invalidLrs.length > 0) {
        console.log(`Found ${invalidLrs.length} invalid annexure links. Cleaning up...`);
        const idsToFix = invalidLrs.map(lr => lr.id);
        await prisma.lRRequest.updateMany({
            where: { id: { in: idsToFix } },
            data: { annexureId: null }
        });
        console.log("Invalid links cleaned.");
    }

    // 1. Link Invoices to Annexures (Note: This might fail if column doesn't exist yet, so we wrap in try-catch)
    let invoices: any[] = [];
    try {
        invoices = await prisma.invoice.findMany({
            where: { annexureId: null },
            include: { LRRequest: { select: { annexureId: true } } }
        });
    } catch (e) {
        console.log("Invoice.annexureId column not found, skipping invoice linking for now.");
    }

    if (invoices.length > 0) {
        console.log(`Found ${invoices.length} unlinked invoices.`);
    }
    let invoiceCount = 0;
    for (const invoice of invoices) {
        const annexureId = invoice.LRRequest.find((lr: any) => lr.annexureId)?.annexureId;
        if (annexureId) {
            await prisma.invoice.update({
                where: { id: invoice.id },
                data: { annexureId }
            });
            invoiceCount++;
        }
    }
    console.log(`Linked ${invoiceCount} invoices to annexures.`);

    // 2. Link Annexures to Vendors
    const annexures = await prisma.annexure.findMany({
        where: { vendorId: null },
        include: { LRRequest: { select: { tvendorId: true } } }
    });

    console.log(`Found ${annexures.length} unlinked annexures.`);
    let annexureCount = 0;
    for (const annexure of annexures) {
        const vendorId = annexure.LRRequest.find(lr => lr.tvendorId)?.tvendorId;
        if (vendorId) {
            await prisma.annexure.update({
                where: { id: annexure.id },
                data: { vendorId }
            });
            annexureCount++;
        }
    }
    console.log(`Linked ${annexureCount} annexures to vendors.`);

    // 3. Update legacy "SENT" status to "PENDING_TADMIN_REVIEW"
    // Using string literal since we might not have the enum easily accessible in this script context
    const legacyInvoices = await prisma.invoice.count({
        where: { status: "SENT" as any }
    });

    if (legacyInvoices > 0) {
        await prisma.invoice.updateMany({
            where: { status: "SENT" as any },
            data: { status: "PENDING_TADMIN_REVIEW" as any }
        });
        console.log(`Updated ${legacyInvoices} legacy "SENT" invoices to "PENDING_TADMIN_REVIEW".`);
    }

    console.log("Migration complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
