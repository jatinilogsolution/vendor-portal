import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import { getAdminInvoiceData, createInvoiceForVendor } from "../_actions/invoices";
import AdminInvoicesPage from "./_components/admin-invoices-page";

export default async function VendorPortalAdminInvoicesPage() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);

  const data = await getAdminInvoiceData();
  const vendors = JSON.parse(JSON.stringify(data.vendors));
  const invoices = JSON.parse(JSON.stringify(data.invoices));

  return (
    <VendorPortalPageShell
      title="Vendor Invoices"
      description="Create invoices on behalf of vendors or review submissions."
    >
      <AdminInvoicesPage
        vendors={vendors}
        invoices={invoices}
        onCreateInvoice={createInvoiceForVendor}
      />
    </VendorPortalPageShell>
  );
}
