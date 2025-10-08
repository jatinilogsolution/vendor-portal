import { BillToAddressById, Warehouse } from "@/actions/wms/warehouse";
import { NextRequest, NextResponse } from "next/server";
 

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1️⃣ Validate the ID
    if (!id || typeof id !== "string" || !id.trim()) {
        return NextResponse.json(
            { message: "Invalid warehouse ID provided" },
            { status: 400 }
        );
    }

    const trimmedId = id.trim();

    try {
        // 2️⃣ Fetch warehouse data
        const warehouses: Warehouse[] = await BillToAddressById(trimmedId);

        // 3️⃣ Handle empty result
        if (!warehouses || warehouses.length === 0) {
            return NextResponse.json(
                { message: `No active warehouse found with ID: ${trimmedId}` },
                { status: 404 }
            );
        }

        // 4️⃣ Return successful response
        return NextResponse.json(warehouses, { status: 200 });
    } catch (error: any) {
        console.error(`Error fetching warehouse ${trimmedId}:`, error);
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
