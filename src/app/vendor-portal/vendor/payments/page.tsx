import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
} from "@/components/vendor-portal/page-shell";
import { getVendorPaymentsData } from "../_actions/vendor-payments";
import VendorPaymentsPage from "./_components/vendor-payments-page";

export default async function VendorPortalVendorPaymentsPage() {
  await requireVendorPortalSession([UserRoleEnum.VENDOR]);
  const data = await getVendorPaymentsData();
  const invoices = JSON.parse(JSON.stringify(data.invoices));

  return (
    <VendorPortalPageShell
      title="My Payments"
      description="Track payment status for approved invoices."
    >
      <VendorPaymentsPage invoices={invoices} />
    </VendorPortalPageShell>
  );
}
