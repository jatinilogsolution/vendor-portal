"use server"

import { getAWLWMSDBPOOL } from "@/services/db"
export const getLRS = async ({ vendorId }: { vendorId: string }) => {
    try {
        const pool = await getAWLWMSDBPOOL();
        const request = pool.request();

        request.input("vendorId", vendorId);



        const query = `select distinct OutLRNo,OutLRDate,city, OutTPT from NEWAWLDB.dbo.tbl_MDN with(nolock) where CustID not in ('sberlc01') and  OutLRDate>='2025-04-01' and OutLRNo not in (select distinct tranId from NEWAWLDB.dbo.gDrive_Data  with(nolock)  where subFolder='pod'  ) and OutTransportBy='AWL' and isnull(OutGPNo,'')<>''  and  OutVehType not in ('COURIER') AND OutTPT = @vendorId`
        const response = await request.query(query);

        return { data: response.recordset };
    } catch (error) {
        console.error("Error fetching LRS:", error);
        return { error: true, message: (error as Error).message };
    }
}







