import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import { getVendorDocumentsData, uploadVendorDocument } from "../_actions/vendor-docs";
import VendorDocumentsPage from "./_components/vendor-documents-page";

export default async function VendorPortalVendorDocumentsPage() {
  await requireVendorPortalSession([UserRoleEnum.VENDOR]);
  const data = await getVendorDocumentsData();

  return (
    <VendorPortalPageShell
      title="Documents"
      description="IT vendors upload supporting documents with invoices."
    >
      <VendorDocumentsPage
        vendor={data.vendor}
        invoices={data.invoices}
        onUpload={uploadVendorDocument}
      />
    </VendorPortalPageShell>
  );
}
