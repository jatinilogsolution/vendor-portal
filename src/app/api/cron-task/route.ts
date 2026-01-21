// app/api/cron-task/route.ts
import { LRIMPORT } from "@/actions/vendor/import-awlwms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await LRIMPORT();

    if (result.success) {
      return NextResponse.json(
        {
          message: result.message,
          count: result.count,
          details: result.details,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: result.message, error: result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error during cron task:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        message: "Internal Server Error during cron task",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
