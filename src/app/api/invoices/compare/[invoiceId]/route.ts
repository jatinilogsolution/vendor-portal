import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRevennuByLrs } from "@/actions/fins/revenue";
 
export async function GET(req: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
    try {
        const { invoiceId } =await params;

        // 1) GET INVOICE FROM PRISMA
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                LRRequest: true,
                vendor: true,
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // 2) COLLECT LR NUMBERS
        const lrNumbers = invoice.LRRequest.map((lr) => lr.LRNumber);

        if (lrNumbers.length === 0) {
            return NextResponse.json({
                ...invoice,
                finsCosting: [],
            });
        }


        const revenuRecord = await getRevennuByLrs({
            LRs: lrNumbers
        })
        const lrWithFins = invoice.LRRequest.map((lr) => ({
            ...lr,
            finsCosting: revenuRecord?.filter((f) => f.LR_No === lr.LRNumber) ?? [],
        }));

        // 5) FINAL RESPONSE
        return NextResponse.json({
            ...invoice,
            LRRequest: lrWithFins,
        });

    } catch (err) {
        console.log("ERROR →", err);
        return NextResponse.json({ error: "Server Error", details: String(err) }, { status: 500 });
    }
}
