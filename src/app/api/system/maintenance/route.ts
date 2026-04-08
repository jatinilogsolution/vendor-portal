import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  canManageMaintenance,
  disableMaintenance,
  enableMaintenance,
  isMaintenanceEnabled,
} from "@/lib/maintenance";
// import { auditLog } from "@/lib/audit-logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getAuthorizedSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }

  if (!canManageMaintenance(session.user.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }

  return { error: null };
}

export async function GET() {
  // const { error } = await getAuthorizedSession();
  // if (error) return error;

  return NextResponse.json({
    enabled: isMaintenanceEnabled(),
  });
}

export async function POST(req: Request) {
  // const { error, session } = await getAuthorizedSession();
  // if (error || !session) return error;

  let action: unknown;

  try {
    const body = await req.json();
    action = body?.action;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (action !== "enable" && action !== "disable") {
    return NextResponse.json(
      { error: 'Invalid action. Use "enable" or "disable".' },
      { status: 400 },
    );
  }

  const enabled = action === "enable";

  if (enabled) {
    enableMaintenance();
  } else {
    disableMaintenance();
  }

  // await auditLog({
  //   action: "UPDATE",
  //   model: "SystemMaintenance",
  //   userId: session.user.id,
  //   description: `${session.user.role} ${enabled ? "enabled" : "disabled"} maintenance mode`,
  //   newData: {
  //     enabled,
  //     route: "/api/system/maintenance",
  //   },
  // });

  return NextResponse.json({
    enabled,
    status: enabled ? "maintenance enabled" : "maintenance disabled",
  });
}
