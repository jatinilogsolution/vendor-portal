

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaMssql(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma };