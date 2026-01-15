import { config } from "dotenv";
config();
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

async function main() {
    const adapter = new PrismaMssql(process.env.DATABASE_URL!);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("--- Schema Table List ---");
        const tables: any[] = await prisma.$queryRaw`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`;
        console.log("Tables in database:", tables.map(t => t.TABLE_NAME).join(", "));

        const columns: any[] = await prisma.$queryRaw`SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME IN ('Annexure', 'annexures', 'Invoice', 'invoices')`;
        console.log("\nColumn info for relevance:", JSON.stringify(columns, null, 2));

    } catch (error) {
        console.error("Error listing tables:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
