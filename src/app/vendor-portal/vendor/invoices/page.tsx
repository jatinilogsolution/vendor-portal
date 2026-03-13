import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
} from "@/components/vendor-portal/page-shell";
import { getVendorInvoiceData, createVendorInvoice } from "../_actions/vendor-invoices";
import VendorInvoicesPage from "./_components/vendor-invoices-page";

export default async function VendorPortalVendorInvoicesPage() {
  await requireVendorPortalSession([UserRoleEnum.VENDOR]);
  const data = await getVendorInvoiceData();
  const purchaseOrders = JSON.parse(JSON.stringify(data.purchaseOrders));
  const proformaInvoices = JSON.parse(JSON.stringify(data.proformaInvoices));
  const invoices = JSON.parse(JSON.stringify(data.invoices));

  return (
    <VendorPortalPageShell
      title="My Invoices"
      description="Upload PDF invoices or create digital invoices."
    >
      <VendorInvoicesPage
        purchaseOrders={purchaseOrders}
        proformaInvoices={proformaInvoices}
        invoices={invoices}
        onCreateInvoice={createVendorInvoice}
      />
    </VendorPortalPageShell>
  );
}
