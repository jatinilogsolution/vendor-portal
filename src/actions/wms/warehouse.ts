import { getAWLWMSDBPOOL } from "@/services/db";





export interface Warehouse {
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
    isActive: string;
    gstinNumber: string | null;
    gstinAddress: string | null;
    totalArea: number | null;
    budgetArea2425: number | null;
    gstinNumberAlt: string | null;
    ilogGstin: string | null;
    latitude: number | null;
    longitude: number | null;
}

export const BillToAddress = async (): Promise<Warehouse[]> => {
    try {
        const pool = await getAWLWMSDBPOOL();
        const request = pool.request();

        const query = `
      SELECT 
        ID AS id,
        WHid AS warehouseId,
        cust_account AS customerAccount,
        WHmainid AS warehouseMainId,
        WHname AS warehouseName,
        WHadd AS addressLine1,
        WHadd2 AS addressLine2,
        WHcity AS city,
        WHstate AS state,
        WHpin AS pinCode,
        whcountry AS country,
        WHlocid AS locationId,
        fromdate AS fromDate,
        Todate AS toDate,
        state_code AS stateCode,
        active AS isActive,
        GSTIN_No AS gstinNumber,
        GSTIN_add AS gstinAddress,
        totalArea AS totalArea,
        BudgetArea2425 AS budgetArea2425,
        GSTIN_No1 AS gstinNumberAlt,
        ILOGGSTIN AS ilogGstin,
        warehouse_lat AS latitude,
        warehouse_long AS longitude
      FROM tbl_whaddress
      WHERE LTRIM(RTRIM(active)) = 'Y';
    `;

        const response = await request.query<Warehouse>(query);
        const warehouses = response.recordset;

        console.log(`✅ Retrieved ${warehouses.length} active warehouses.`);
        return warehouses;
    } catch (e) {
        console.error("❌ Error fetching active warehouses:", e);
        throw e;
    }
};


export const BillToAddressById = async (id: string): Promise<Warehouse[]> => {
    // 1️⃣ Validate input
    if (!id || typeof id !== "string" || !id.trim()) {
        throw new Error("Invalid warehouse ID provided.");
    }

    const trimmedId = id.trim();

    try {
        // 2️⃣ Get database pool
        const pool = await getAWLWMSDBPOOL();
        const request = pool.request();

        // 3️⃣ Use parameterized query
        request.input("id", trimmedId);
        const query = `
          SELECT 
            ID AS id,
            WHid AS warehouseId,
            cust_account AS customerAccount,
            WHmainid AS warehouseMainId,
            WHname AS warehouseName,
            WHadd AS addressLine1,
            WHadd2 AS addressLine2,
            WHcity AS city,
            WHstate AS state,
            WHpin AS pinCode,
            whcountry AS country,
            WHlocid AS locationId,
            fromdate AS fromDate,
            Todate AS toDate,
            state_code AS stateCode,
            active AS isActive,
            GSTIN_No AS gstinNumber,
            GSTIN_add AS gstinAddress,
            totalArea AS totalArea,
            BudgetArea2425 AS budgetArea2425,
            GSTIN_No1 AS gstinNumberAlt,
            ILOGGSTIN AS ilogGstin,
            warehouse_lat AS latitude,
            warehouse_long AS longitude
          FROM tbl_whaddress
          WHERE active = 'Y' AND ID = @id;
        `;

        // 4️⃣ Execute query
        const response = await request.query<Warehouse>(query);
        const warehouses = response.recordset;

        // 5️⃣ Validate response
        if (!warehouses || warehouses.length === 0) {
            console.warn(`No active warehouses found with ID: ${trimmedId}`);
            return [];
        }

        console.log(`✅ Retrieved ${warehouses.length} active warehouse(s) with ID: ${trimmedId}`);
        return warehouses;
    } catch (e) {
        console.error(`❌ Error fetching warehouse with ID ${trimmedId}:`, e);
        throw new Error(`Failed to fetch warehouse with ID ${trimmedId}`);
    }
};
