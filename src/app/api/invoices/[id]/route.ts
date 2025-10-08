
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: id },
            include: { vendor: true, LRRequest: true },
        });

        if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

        return NextResponse.json(invoice);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error fetching invoice" }, { status: 500 });
    }
}
