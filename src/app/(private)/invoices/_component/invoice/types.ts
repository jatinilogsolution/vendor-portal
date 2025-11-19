export type FinsCosting = {
  charge_code: string;
  allocated_cost: number;
  revenue: number;
  revgl_code: string;
  costgl_code: string;
  LR_No: string;
};

export type LRRequest = {
  id: string;
  LRNumber: string;
  annexureId: string;
  createdAt: string;
  updatedAt: string;
  outDate: string;
  origin: string;
  destination: string;
  CustomerName: string;
  vehicleNo: string;
  vehicleType: string;
  priceOffered: number;
  priceSettled: number;
  extraCost: number | null;
  lrPrice: number;
  modifiedPrice: number | null;
  podlink: string;
  remark: string;
  status: string;
  tvendorId: string;
  groupId: string;
  isInvoiced: boolean;
  finsCosting?: FinsCosting[];
  fileNumber: string;
};

export type Vendor = {
  id: string;
  name: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceURI: string;
  billTo: string;
  billToGstin: string;
  billToId: string;
  grandTotal: number;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  totalExtra: number;
  hasDiscrepancy: boolean;
  discrepancyNotes?: string | null;
  poId?: string | null;
  refernceNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  vendor: Vendor;
  LRRequest: LRRequest[];
};

export type FileGroup = {
  fileNumber: string;
  lrs: LRRequest[];
  lrCount: number;
  awlOffered: number;
  vendorSettled: number;
  lrPriceTotal: number;
  extraCost: number;
  fileRevenue: number;
jobCost: number;
};
