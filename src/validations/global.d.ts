export interface WarehouseAddressProps {
  id: number;
  warehouseId: string;
  customerAccount: string;
  warehouseMainId: string;
  warehouseName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  pinCode: string | null;
  country: string | null;
  locationId: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  stateCode: string | null;
  isActive: boolean;
  gstinNumber: string | null;
  gstinAddress: string | null;
  totalArea: number | null;
  budgetArea2425: number | null;
  gstinNumberAlt: string | null;
  ilogGstin: string | null;
  latitude: number | null;
  longitude: number | null;
}
