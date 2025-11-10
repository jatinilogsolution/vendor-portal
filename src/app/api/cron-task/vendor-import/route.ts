// app/api/cron-task/route.ts
import { LRIMPORT, vendorImport } from '@/actions/vendor/import-awlwms';
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const data = await vendorImport()

    return NextResponse.json(
      { message: `${data} Vendor import executed successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during cron task:', error);

    // Type-safe error message
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { message: 'Error executing cron task', error: errorMessage },
      { status: 500 }
    );
  }
}
