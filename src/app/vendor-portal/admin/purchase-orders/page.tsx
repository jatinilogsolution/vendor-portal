import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import {
  createVpPurchaseOrder,
  getVpPurchaseOrderData,
  submitVpPurchaseOrder,
} from "../_actions/purchase-orders";
import { sendPoToVendor } from "../_actions/vendor-delivery";
import PurchaseOrderPage from "./_components/purchase-order-page";

export default async function VendorPortalAdminPurchaseOrdersPage() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);

  const data = await getVpPurchaseOrderData();
  const purchaseOrders = JSON.parse(JSON.stringify(data.purchaseOrders));

  return (
    <VendorPortalPageShell
      title="Purchase Orders"
      description="Create and manage purchase orders for vendors."
    >
      <PurchaseOrderPage
        vendors={data.vendors}
        categories={data.categories}
        items={data.items}
        purchaseOrders={purchaseOrders}
        onCreate={createVpPurchaseOrder}
        onSubmit={submitVpPurchaseOrder}
        onSendToVendor={sendPoToVendor}
      />
    </VendorPortalPageShell>
  );
}
