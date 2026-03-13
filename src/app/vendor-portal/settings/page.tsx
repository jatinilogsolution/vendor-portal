import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
  VendorPortalPlaceholder,
} from "@/components/vendor-portal/page-shell";

export default async function VendorPortalSettingsPage() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS]);

  return (
    <VendorPortalPageShell
      title="Settings"
      description="Configure vendor portal preferences."
    >
      <VendorPortalPlaceholder
        title="Portal settings"
        description="Add configuration for notifications, numbering, and approvals."
        items={[
          "Configure document numbering patterns.",
          "Set approval SLAs and reminders.",
          "Manage portal-wide notifications.",
        ]}
      />
    </VendorPortalPageShell>
  );
}
