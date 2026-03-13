import { PropsWithChildren } from "react";
import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";

export default async function VendorPortalVendorLayout({
  children,
}: PropsWithChildren) {
  await requireVendorPortalSession([UserRoleEnum.VENDOR]);
  return <>{children}</>;
}
