import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import { getVendorPurchaseOrders, acknowledgePurchaseOrder } from "../_actions/vendor-po";
import VendorPurchaseOrdersPage from "./_components/vendor-purchase-orders-page";

export default async function VendorPortalVendorPurchaseOrdersPage() {
  await requireVendorPortalSession([UserRoleEnum.VENDOR]);
  const raw = await getVendorPurchaseOrders();
  const purchaseOrders = JSON.parse(JSON.stringify(raw));

  return (
    <VendorPortalPageShell
      title="My Purchase Orders"
      description="Review and acknowledge approved POs."
    >
      <VendorPurchaseOrdersPage
        purchaseOrders={purchaseOrders}
        onAcknowledge={acknowledgePurchaseOrder}
      />
    </VendorPortalPageShell>
  );
}
