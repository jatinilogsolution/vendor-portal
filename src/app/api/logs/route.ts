import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { UserRoleEnum } from "@/utils/constant";
import { NextRequest, NextResponse } from "next/server";

function parseJsonSafely(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * Next.js App Router API Route Handler for GET /api/logs
 */
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  if (user.role !== UserRoleEnum.BOSS) {
    return NextResponse.json({ error: "Only bosses can access audit logs" }, { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;

  const q = searchParams.get("q");
  const model = searchParams.get("model");
  const action = searchParams.get("action");
  const userId = searchParams.get("userId");
  const recordId = searchParams.get("recordId");
  const scope = searchParams.get("scope");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const take = Math.min(200, parseInt(pageSize as string) || 100);
  const skip = (pageNum - 1) * take;

  const where: any = {};
  const andClauses: any[] = [];
  if (model) where.model = model;
  if (action) where.action = action;
  if (userId) where.userId = userId;
  if (recordId) where.recordId = recordId;

  if (from || to) {
    where.createdAt = {};

    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      where.createdAt.gte = fromDate;
    }

    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  if (scope === "vendor") {
    andClauses.push({
      OR: [
        { model: { startsWith: "Vp" } },
        { description: { contains: "[Vendor Portal]" } },
      ],
    });
  }

  if (scope === "transport") {
    andClauses.push({
      AND: [
        { model: { not: { startsWith: "Vp" } } },
        {
          OR: [
            { description: null },
            { description: { not: { contains: "[Vendor Portal]" } } },
          ],
        },
      ],
    });
  }

  if (q) {
    const qString = q.trim();
    andClauses.push({
      OR: [
      { action: { contains: qString } },
      { model: { contains: qString } },
      { vendorId: { contains: qString } },
      { oldData: { contains: qString } },
      { newData: { contains: qString } },
      { recordId: { contains: qString } },
      { description: { contains: qString } },
      { user: { is: { id: { contains: qString } } } },
      { user: { is: { name: { contains: qString } } } },
      { user: { is: { email: { contains: qString } } } },
      ],
    });
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
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
      data: logs.map((l) => ({
        ...l,
        oldData: parseJsonSafely(l.oldData),
        newData: parseJsonSafely(l.newData),
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
