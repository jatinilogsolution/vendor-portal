import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const { user } = session;

  // 2️⃣ Parse query params
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage") || "10")));
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
  const statuses = searchParams.getAll("status");

  const allowedSortFields = ["name", "isActive", "createdAt", "id"];
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  // 3️⃣ Determine roles to fetch
  const rolesToFetch: string[] =
    user.role === "BOSS" ? ["TVENDOR", "VENDOR"] :
      user.role === "TADMIN" ? ["TVENDOR"] :
        user.role === "ADMIN" ? ["VENDOR"] : [];

  // If no roles are determined, prevent fetching any vendors
  if (rolesToFetch.length === 0) {
    return NextResponse.json({
      items: [],
      page: 1, perPage, total: 0, totalPages: 1, q,
    });
  }

  // 4️⃣ Build search/filter clause
  const whereClause: any = {
    users: { some: { role: { in: rolesToFetch } } },
  };

  if (q) {
    // FIX: Enhanced search to cover more address fields
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { panNumber: { contains: q, mode: "insensitive" } },
      {
        addresses: {
          some: { // Use 'addresses' as defined in schema.prisma model
            OR: [
              { city: { contains: q, mode: "insensitive" } },
              { state: { contains: q, mode: "insensitive" } },
              { line1: { contains: q, mode: "insensitive" } },
            ]
          }
        }
      },
    ];
  }

  if (statuses.length > 0) {
    const isActiveValues = statuses.map((s) => s === "active");
    whereClause.isActive = { in: isActiveValues };
  }

  // 5️⃣ Count total vendors
  const total = await prisma.vendor.count({ where: whereClause });
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, totalPages);

  // FIX: Create the orderBy clause based on the allowed field
  const orderByClause: any = {};
  orderByClause[finalSortBy] = sortOrder;

  // 6️⃣ Fetch paginated vendors
  const vendors = await prisma.vendor.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true, // Included for default sort

      Address: {
        select: {
          line1: true,
          line2: true,
          city: true,
          state: true,
          postal: true,
          country: true,
        },
      },
    },
    skip: (currentPage - 1) * perPage,
    take: perPage,
    orderBy: orderByClause, // Use the fixed orderBy clause
  });

  // 7️⃣ Fetch lorry receipt counts
  const vendorIds = vendors.map((v) => v.id);
  const lrCountsRaw = await prisma.lorryReceipt.groupBy({
    by: ["transporter"], // Assuming 'transporter' field stores the Vendor ID
    where: { transporter: { in: vendorIds } },
    _count: { id: true },
  });

  const lrCountsMap = lrCountsRaw.reduce((acc, lr) => {
    acc[lr.transporter] = lr._count.id;
    return acc;
  }, {} as Record<string, number>);

  // 8️⃣ Format vendors
  const formattedVendors = vendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    status: vendor.isActive ? "active" : "inactive",
    // Use the correct relation name 'addresses' from the select
    addresses: vendor.Address.map(
      (a) => `${a.line1}${a.line2 ? ", " + a.line2 : ""}, ${a.city}${a.state ? ", " + a.state : ""}${a.postal ? " - " + a.postal : ""}, ${a.country}`
    ),
    lorryReceiptCount: lrCountsMap[vendor.id] || 0,
  }));

  // 9️⃣ Return JSON
  return NextResponse.json({
    items: formattedVendors,
    page: currentPage,
    perPage,
    total,
    totalPages,
    q,
  });
}