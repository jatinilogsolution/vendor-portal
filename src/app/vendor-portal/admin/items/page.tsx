import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import { getVpItemData, createVpItem, bulkImportVpItems } from "../_actions/items";
import ItemMasterPage from "./_components/item-master-page";

export default async function VendorPortalAdminItemsPage() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);

  const data = await getVpItemData();

  return (
    <VendorPortalPageShell
      title="Item Master"
      description="Maintain standard items and services for POs and PIs."
    >
      <ItemMasterPage
        items={data.items}
        categories={data.categories}
        onCreate={createVpItem}
        onImport={bulkImportVpItems}
      />
    </VendorPortalPageShell>
  );
}
