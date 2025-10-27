"use server"

import { getAWLWMSDBPOOL } from "@/services/db"




export const getCostByFileNumber = async (fileNumber: string) => {


    try {


        const pool = await getAWLWMSDBPOOL()

        const request = pool.request();
        request.input("fileNumber", fileNumber);

        const resposne = request.query("SELECT distinct M.FileNo, M.OutLRNo, M.City, M.OutTPT, M.WH, M.OutLRDate, M.OutVehType, M.OutVehNo, M.PartyName, D.veh_cost FROM NEWAWLDB.dbo.tbl_MDN AS M WITH (NOLOCK) LEFT JOIN ( SELECT CustInv, WH, CustID, MAX(veh_cost) AS veh_cost  FROM NEWAWLDB.dbo.tbl_DN WITH (NOLOCK) GROUP BY CustInv, WH, CustID ) AS D ON D.CustInv = M.CustInv AND D.WH = M.WH AND D.CustID = M.CustID WHERE M.CustID <> 'sberlc01' AND M.OutLRDate >= '2025-07-01' and m.OutTransportBy='AWL' AND M.FileNo<>'' AND M.FileNo = @fileNumber")


        console.log("Cost Data", resposne)
    } catch (e) {
        console.log("Error in getCostByFileNumber", e)

        return {
            success: false,
            message: "Failed to get cost"
        }
    }
}