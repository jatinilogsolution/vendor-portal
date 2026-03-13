import { PropsWithChildren } from "react";
import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";

export default async function VendorPortalBossLayout({
  children,
}: PropsWithChildren) {
  await requireVendorPortalSession([UserRoleEnum.BOSS]);
  return <>{children}</>;
}
