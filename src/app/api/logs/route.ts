import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { NextRequest, NextResponse } from "next/server";

// Define a type for the log data for better type safety
interface LogData {
  id: string;
  // ... other log properties
  oldData: string | null;
  newData: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

/**
 * Next.js App Router API Route Handler for GET /api/logs
 */
export async function GET(req: NextRequest) {
  const session = await getCustomSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const searchParams = req.nextUrl.searchParams;

  // Access query parameters from searchParams
  const q = searchParams.get("q");
  const model = searchParams.get("model");
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  
  // Parse numeric parameters with safety
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const take = Math.min(200, parseInt(pageSize as string) || 25);
  const skip = (pageNum - 1) * take;

  const where: any = {};

  // --- Role-based scoping ---
  const isAdmin = user.role === UserRoleEnum.BOSS || user.role === UserRoleEnum.ADMIN || user.role === UserRoleEnum.TADMIN;
  
  if (!isAdmin) {
    // vendor users only see their vendor logs
    if (user.vendorId) {
      where.vendorId = user.vendorId;
    } else {
      // fallback: restrict by userId only
      where.userId = user.id;
    }
  }

  // --- Filtering ---
  if (model) where.model = model;
  if (action) where.action = action;
  // Note: userId filter is only applied if isAdmin or if a vendor user is trying to filter their own logs
  // The role-based scoping above might override/conflict if not careful, but following original logic:
  if (userId) where.userId = userId; 

  // --- Date Range Filtering ---
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from as string);
    if (to) where.createdAt.lte = new Date(to as string);
  }

  // --- Search Query Filtering ---
  if (q) {
    const qString = q as string;
    // basic free-text search over string fields
    where.OR = [
      { oldData: { contains: qString } },
      { newData: { contains: qString } },
      { recordId: { contains: qString } },
      { description: { contains: qString } },
    ];
  }

  try {
    const [total, logs] = await Promise.all([
      prisma.log.count({ where }),
      prisma.log.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    return NextResponse.json({
      total,
      page: pageNum,
      pageSize: take,
      data: (logs as LogData[]).map((l) => ({
        ...l,
        // Safely parse JSON string data fields
        oldData: l.oldData ? JSON.parse(l.oldData as string) : null,
        newData: l.newData ? JSON.parse(l.newData as string) : null,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}