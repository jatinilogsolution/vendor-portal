import { config } from "dotenv";
config();
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

async function main() {
    const adapter = new PrismaMssql(process.env.DATABASE_URL!);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("--- Database Diagnostics ---");
        
        const invoiceCounts = await prisma.invoice.groupBy({
            by: ['status'],
            _count: { _all: true }
        });
        console.log("\nInvoice Statuses:", JSON.stringify(invoiceCounts, null, 2));

        const annexureCounts = await prisma.annexure.groupBy({
            by: ['status'],
            _count: { _all: true }
        });
        console.log("\nAnnexure Statuses:", JSON.stringify(annexureCounts, null, 2));

        const lrUnlinkedInvoices = await prisma.lRRequest.count({
            where: { invoiceId: null, NOT: { annexureId: null } }
        });
        console.log("\nLRs with Annexure but NO Invoice:", lrUnlinkedInvoices);

        const lrUnlinkedAnnexures = await prisma.lRRequest.count({
            where: { NOT: { invoiceId: null }, annexureId: null }
        });
        console.log("LRs with Invoice but NO Annexure:", lrUnlinkedAnnexures);

        const orphanInvoices = await prisma.invoice.count({
            where: { annexureId: null }
        });
        console.log("Invoices with NO Annexure link:", orphanInvoices);

    } catch (error) {
        console.error("Error during diagnostics:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
