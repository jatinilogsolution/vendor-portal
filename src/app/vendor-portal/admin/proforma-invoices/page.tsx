import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import {
  createVpProformaInvoice,
  getVpProformaInvoiceData,
  submitVpProformaInvoice,
} from "../_actions/proforma-invoices";
import { sendPiToVendor } from "../_actions/vendor-delivery";
import { convertPiToPo } from "../_actions/convert-pi-to-po";
import ProformaInvoicePage from "./_components/proforma-invoice-page";

export default async function VendorPortalAdminProformaInvoicesPage() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);

  const data = await getVpProformaInvoiceData();
  const proformaInvoices = JSON.parse(JSON.stringify(data.proformaInvoices));

  return (
    <VendorPortalPageShell
      title="Proforma Invoices"
      description="Create and submit proforma invoices for approval."
    >
      <ProformaInvoicePage
        vendors={data.vendors}
        categories={data.categories}
        items={data.items}
        proformaInvoices={proformaInvoices}
        onCreate={createVpProformaInvoice}
        onSubmit={submitVpProformaInvoice}
        onSendToVendor={sendPiToVendor}
        onConvertToPo={convertPiToPo}
      />
    </VendorPortalPageShell>
  );
}
