import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
  VendorPortalPlaceholder,
} from "@/components/vendor-portal/page-shell";

export default async function VendorPortalProfilePage() {
  await requireVendorPortalSession();

  return (
    <VendorPortalPageShell
      title="Profile"
      description="Manage your account settings and contact details."
    >
      <VendorPortalPlaceholder
        title="Account settings"
        description="Wire this to user profile update and password change flows."
        items={["Update name and contact info.", "Change password.", "View role and access scope."]}
      />
    </VendorPortalPageShell>
  );
}
