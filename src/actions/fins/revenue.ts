// "use server";

import { getAWLWMSDBPOOLFINS } from "@/services/db";

export const getRevennuByLrs = async ({
  LRs,
}: {
  LRs: string[];
}): Promise<
  {
    charge_code: string;
    allocated_cost: number;
    revenue: number;
    revgl_code: string;
    costgl_code: string;
    LR_No: string;
  }[]
> => {
  if (!LRs || LRs.length === 0) return [];

  try {
    const pool = await getAWLWMSDBPOOLFINS();
    const request = pool.request();

    // ❗ SQL Server cannot take array directly → build safe IN clause
    const lrParams = LRs.map((_, i) => `@lr${i}`).join(",");
    LRs.forEach((lr, idx) => request.input(`lr${idx}`, lr));

    const query = `
      SELECT DISTINCT 
        charge_code,
        allocated_cost,
        revenue,
        revgl_code,
        costgl_code,
        LR_No
      FROM Fins_TTPCOSTING WITH(NOLOCK)
      WHERE LR_No IN (${lrParams})
    `;

    const response = await request.query(query);
    return response.recordset ?? [];
  } catch (er) {
    console.error("Error while fetching FINs revenue:", er);
    return [];
  }
};
