import {
  Vendor,
  PurchaseOrder,
  PurchaseOrderItem,
  Invoice,
  InvoiceItem,
} from "@/generated/prisma/client";

export type VendorWithDetails = Vendor & {
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
};

export type PurchaseOrderWithDetails = PurchaseOrder & {
  vendor: Vendor;
  items: PurchaseOrderItem[];
  invoices: Invoice[];
};

export type VendorWithCompany = Vendor & {
  company: any;
};
export type InvoiceWithDetails = Invoice & {
  vendor: VendorWithCompany;
  purchaseOrder?: PurchaseOrderWithDetails;
  items: InvoiceItem[];
};

export type DiscrepancyType = "quantity" | "price" | "amount" | "description";

export interface Discrepancy {
  type: DiscrepancyType;
  poItem?: PurchaseOrderItem;
  invoiceItem?: InvoiceItem;
  message: string;
  severity: "warning" | "error";
}

export type POStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "COMPLETED"
  | "CANCELLED";
export type InvoiceStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "PAID"
  | "CANCELLED"
  | "OVERDUE";
