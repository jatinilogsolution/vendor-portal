import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { VendorPortalPageShell } from "@/components/vendor-portal/page-shell";
import {
  getBossApprovalQueues,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  approveProformaInvoice,
  rejectProformaInvoice,
  approveVendorInvoice,
  rejectVendorInvoice,
  requestVendorInvoiceRevision,
} from "../_actions/approvals";
import ApprovalQueuePage from "./_components/approval-queue-page";

export default async function VendorPortalBossApprovalsPage() {
  await requireVendorPortalSession([UserRoleEnum.BOSS]);
  const data = await getBossApprovalQueues();
  const purchaseOrders = JSON.parse(JSON.stringify(data.purchaseOrders));
  const proformaInvoices = JSON.parse(JSON.stringify(data.proformaInvoices));
  const invoices = JSON.parse(JSON.stringify(data.invoices));

  return (
    <VendorPortalPageShell
      title="Approvals"
      description="Approve or reject POs, PIs, and vendor invoices."
    >
      <ApprovalQueuePage
        purchaseOrders={purchaseOrders}
        proformaInvoices={proformaInvoices}
        invoices={invoices}
        onApprovePo={approvePurchaseOrder}
        onRejectPo={rejectPurchaseOrder}
        onApprovePi={approveProformaInvoice}
        onRejectPi={rejectProformaInvoice}
        onApproveInvoice={approveVendorInvoice}
        onRejectInvoice={rejectVendorInvoice}
        onRequestRevision={requestVendorInvoiceRevision}
      />
    </VendorPortalPageShell>
  );
}
