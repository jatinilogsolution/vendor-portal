import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
} from "@/components/vendor-portal/page-shell";
import { getBossPaymentsData, initiatePayment, updatePaymentStatus } from "../_actions/payments";
import BossPaymentsPage from "./_components/boss-payments-page";

export default async function VendorPortalBossPaymentsPage() {
  await requireVendorPortalSession([UserRoleEnum.BOSS]);
  const data = await getBossPaymentsData();
  const invoices = JSON.parse(JSON.stringify(data.invoices));

  return (
    <VendorPortalPageShell
      title="Payments"
      description="Initiate and confirm payments for approved invoices."
    >
      <BossPaymentsPage
        invoices={invoices}
        onInitiatePayment={initiatePayment}
        onUpdatePaymentStatus={updatePaymentStatus}
      />
    </VendorPortalPageShell>
  );
}
