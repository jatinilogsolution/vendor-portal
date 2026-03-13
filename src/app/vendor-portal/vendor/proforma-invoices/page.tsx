import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import {
  getVendorProformaInvoices,
  acceptProformaInvoice,
  declineProformaInvoice,
} from "../_actions/vendor-pi";
import VendorProformaInvoicesPage from "./_components/vendor-proforma-invoices-page";

export default async function VendorPortalVendorProformaInvoicesPage() {
  await requireVendorPortalSession([UserRoleEnum.VENDOR]);
  const raw = await getVendorProformaInvoices();
  const proformaInvoices = JSON.parse(JSON.stringify(raw));

  return (
    <VendorPortalPageShell
      title="My Proforma Invoices"
      description="Accept or decline proforma invoices."
    >
      <VendorProformaInvoicesPage
        proformaInvoices={proformaInvoices}
        onAccept={acceptProformaInvoice}
        onDecline={declineProformaInvoice}
      />
    </VendorPortalPageShell>
  );
}
