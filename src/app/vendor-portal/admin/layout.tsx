import { PropsWithChildren } from "react";
import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";

export default async function VendorPortalAdminLayout({
  children,
}: PropsWithChildren) {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);
  return <>{children}</>;
}
