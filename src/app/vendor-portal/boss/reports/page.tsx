import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
  VendorPortalPlaceholder,
} from "@/components/vendor-portal/page-shell";

export default async function VendorPortalBossReportsPage() {
  await requireVendorPortalSession([UserRoleEnum.BOSS]);

  return (
    <VendorPortalPageShell
      title="Reports"
      description="Generate reports across vendors, invoices, and payments."
    >
      <VendorPortalPlaceholder
        title="Reporting"
        description="Provide exportable reports for finance and audit."
        items={[
          "Payment status report by date range.",
          "Vendor invoice aging report.",
          "PO/PI approval turnaround metrics.",
        ]}
      />
    </VendorPortalPageShell>
  );
}
