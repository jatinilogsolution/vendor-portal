import { config } from "dotenv";
config();
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { InvoiceStatus } from "../src/utils/constant";

const DRY_RUN = process.env.DRY_RUN !== "false"; // Default to true unless explicitly false

async function main() {
    console.log(`🚀 Starting robust migration script... [DRY_RUN=${DRY_RUN}]`);

    const adapter = new PrismaMssql(process.env.DATABASE_URL!);
    const prisma = new PrismaClient({ adapter });

    try {
        // --- PHASE 1: STATUS CORRECTION ---
        console.log("\n🔍 Phase 1: Correcting 'SENT' statuses...");
        const sentInvoices = await prisma.invoice.findMany({
            where: { status: "SENT" as any }
        });

        console.log(`Found ${sentInvoices.length} invoices with status 'SENT'.`);
        for (const inv of sentInvoices) {
            console.log(`[ACTION] Update Invoice ${inv.refernceNumber}: SENT -> PENDING_BOSS_REVIEW`);
            if (!DRY_RUN) {
                await prisma.invoice.update({
                    where: { id: inv.id },
                    data: { status: InvoiceStatus.PENDING_BOSS_REVIEW }
                });
            }
        }

        // --- PHASE 2: HARMONIZE LR-ANNEXURE LINKS VIA INVOICE ---
        console.log("\n🔍 Phase 2: Harmonizing LR-Annexure links via Invoices...");
        const invoicesWithAnnexure = await prisma.invoice.findMany({
            where: { NOT: { annexureId: null } },
            select: { id: true, annexureId: true }
        });

        for (const inv of invoicesWithAnnexure) {
            const lrsMissingAnnexure = await prisma.lRRequest.findMany({
                where: { invoiceId: inv.id, annexureId: null }
            });

            if (lrsMissingAnnexure.length > 0) {
                console.log(`[ACTION] Link ${lrsMissingAnnexure.length} LRs from Invoice ${inv.id} to Annexure ${inv.annexureId}`);
                if (!DRY_RUN) {
                    await prisma.lRRequest.updateMany({
                        where: { id: { in: lrsMissingAnnexure.map(lr => lr.id) } },
                        data: { annexureId: inv.annexureId }
                    });
                }
            }
        }

        // --- PHASE 3: LINK INVOICES TO ANNEXURES VIA LRS ---
        console.log("\n🔍 Phase 3: Linking Invoices to Annexures via LRs...");
        const unlinkedInvoices = await prisma.invoice.findMany({
            where: { annexureId: null },
            include: { LRRequest: { select: { annexureId: true } } }
        });

        for (const inv of unlinkedInvoices) {
            // Find most frequent annexureId among linked LRs
            const annexureIds = inv.LRRequest.map(lr => lr.annexureId).filter(id => id !== null);
            if (annexureIds.length > 0) {
                const bestAnnexureId = annexureIds[0]; // Simplistic check: pick the first non-null
                console.log(`[ACTION] Link Invoice ${inv.refernceNumber} to Annexure ${bestAnnexureId} (via LRs)`);
                if (!DRY_RUN) {
                    await prisma.invoice.update({
                        where: { id: inv.id },
                        data: { annexureId: bestAnnexureId }
                    });
                }
            } else {
                console.log(`[SKIP] Invoice ${inv.refernceNumber} has no LRs with annexure links.`);
            }
        }

        // --- PHASE 4: VENDOR CONSISTENCY ---
        console.log("\n🔍 Phase 4: Ensuring Vendor consistency for Annexures...");
        const annexuresMissingVendor = await prisma.annexure.findMany({
            where: { vendorId: null },
            include: { LRRequest: { select: { tvendorId: true }, take: 1 } }
        });

        for (const ann of annexuresMissingVendor) {
            const vendorId = ann.LRRequest[0]?.tvendorId;
            if (vendorId) {
                console.log(`[ACTION] Set Vendor ${vendorId} for Annexure ${ann.name}`);
                if (!DRY_RUN) {
                    await prisma.annexure.update({
                        where: { id: ann.id },
                        data: { vendorId }
                    });
                }
            }
        }

        console.log("\n🏁 Migration check complete!");
        if (DRY_RUN) {
            console.log("💡 This was a DRY RUN. No changes were made to the database.");
            console.log("💡 To apply changes, run: DRY_RUN=false npx tsx scripts/migrate-linking.ts");
        }

    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
