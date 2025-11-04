export interface LRRequest {
  id: string;
  vehicleType: string;
  vehicleNo: string;
  CustomerName: string;
  LRNumber: string;
  origin: string;
  destination: string;
  outDate: string;
  priceOffered: number | null;
  priceSettled: number;
  extraCost: number;
  fileNumber: string;
  remark: string | null;
  podlink: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactEmail: string | null;
  contactPhone: string;
  gstNumber: string;
  panNumber: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  refernceNumber: string;
  invoiceDate: string;
  vendorId: string;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalExtra: number;
  grandTotal: number;
  billTo: string;
  billToGstin: string;
  invoiceURI: string;
  LRRequest: LRRequest[];
  vendor: Vendor;
}
