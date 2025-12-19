import { generateInvoiceFromAnnexure } from "@/app/(private)/lorries/_action/annexure";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { annexureId } = await req.json();
    if (!annexureId) {
      return NextResponse.json({ error: "Annexure ID is required" }, { status: 400 });
    }

    const response = await generateInvoiceFromAnnexure(annexureId);



    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 400 });
    }

    return NextResponse.json({ invoice: response.invoice });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error while generating invoice" },
      { status: 500 }
    );
  }
}
