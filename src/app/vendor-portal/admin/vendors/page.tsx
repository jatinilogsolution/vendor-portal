import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import { getVendorPortalVendorData, createVpVendorProfile, updateVpVendorProfile } from "../_actions/vendors";
import VendorProfilesPage from "./_components/vendor-profiles-page";

export default async function VendorPortalAdminVendorsPage() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);

  const data = await getVendorPortalVendorData();

  return (
    <VendorPortalPageShell
      title="Vendors"
      description="Create portal profiles and manage vendor access."
    >
      <VendorProfilesPage
        vendors={data.vendors}
        vpVendors={data.vpVendors}
        categories={data.categories}
        onCreate={createVpVendorProfile}
        onUpdate={updateVpVendorProfile}
      />
    </VendorPortalPageShell>
  );
}
