import { prisma } from "@/lib/prisma";
import { getCustomSession } from "@/actions/auth.action";

export async function getUsers(
  roleParam: string,
  search?: string,
  showBanned: boolean = false,
  vendorId?: string,
) {
  const { user: currentUser } = await getCustomSession();
  if (!currentUser) return [];

  const role = currentUser.role;
  let allowedRoles: string[] = [];
  const where: any = {
    banned: showBanned,
  };

  if (vendorId) {
    where.vendorId = vendorId;
  }

  switch (role) {
    case "BOSS":
      allowedRoles = ["ADMIN", "TADMIN", "VENDOR", "TVENDOR", "BOSS"];
      where.role = { in: allowedRoles };
      break;
    case "ADMIN":
      allowedRoles = ["ADMIN", "VENDOR"];
      where.role = { in: allowedRoles };
      break;
    case "TADMIN":
      allowedRoles = ["TADMIN", "TVENDOR"];
      where.role = { in: allowedRoles };
      break;
    case "TVENDOR":
      // TVENDORS can see users of their own vendor
      if (currentUser.vendorId) {
        where.vendorId = currentUser.vendorId;
      } else {
        return [];
      }
      break;
    default:
      return [];
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { Vendor: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    include: { Vendor: true },
    orderBy: { createdAt: "desc" },
  });

  return users;
}
export async function getVendors() {
  return await prisma.vendor.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}
