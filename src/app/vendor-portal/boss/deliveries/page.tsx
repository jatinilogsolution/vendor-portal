import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
  VendorPortalPlaceholder,
} from "@/components/vendor-portal/page-shell";

export default async function VendorPortalBossDeliveriesPage() {
  await requireVendorPortalSession([UserRoleEnum.BOSS]);

  return (
    <VendorPortalPageShell
      title="Deliveries"
      description="Track and approve delivery records linked to POs."
    >
      <VendorPortalPlaceholder
        title="Delivery approvals"
        description="Create delivery records and mark partial or full deliveries."
        items={[
          "Record received quantities and condition notes.",
          "Approve delivery to close POs after payment.",
          "Maintain delivery history in vp_delivery_records.",
        ]}
      />
    </VendorPortalPageShell>
  );
}
