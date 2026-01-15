import { createTestLogs, clearTestLogs } from "@/actions/test-logs.action";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await createTestLogs();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const result = await clearTestLogs();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
