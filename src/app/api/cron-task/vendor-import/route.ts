// app/api/cron-task/vendor-import/route.ts
import { vendorImport } from "@/actions/vendor/import-awlwms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await vendorImport();

    if (result.success) {
      return NextResponse.json(
        { message: result.message, count: result.count },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: result.message, error: result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error during vendor import cron:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        message: "Internal Server Error during vendor import",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
