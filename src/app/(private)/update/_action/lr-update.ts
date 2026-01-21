"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAWLWMSDBPOOL } from "@/services/db";

export async function getAWLLRDetails(lrNumber: string) {
  if (!lrNumber) return { error: "LR Number is required" };

  try {
    const pool = await getAWLWMSDBPOOL();
    const query = `
      SELECT DISTINCT 
        OutLRNo, City, OutTPT, WH, OutLRDate, 
        OutVehType, OutVehNo, PartyName, FileNo
      FROM NEWAWLDB.dbo.tbl_MDN WITH (NOLOCK)
      WHERE OutLRNo = '${lrNumber}'
    `;

    const response = await pool.request().query(query);
    const record = response.recordset[0];

    if (!record) {
      return { error: `No LR found with number ${lrNumber} in WMS` };
    }

    // Fetch POD link
    const podQuery = `
      SELECT TOP 1 file_url
      FROM NEWAWLDB.dbo.gDrive_Data WITH (NOLOCK)
      WHERE tranId = '${lrNumber}' AND subFolder = 'POD' AND docType = 'POD'
    `;
    const podResponse = await pool.request().query(podQuery);
    const podRecord = podResponse.recordset[0];

    // Fetch Vendor details
    let vendorDetails = null;
    if (record.OutTPT) {
      const vendorQuery = `
        SELECT Tid, Tname, Tcontactperson, Tcontactno, Temail
        FROM tbl_transporter WITH (NOLOCK)
        WHERE Tid = '${record.OutTPT}'
      `;
      const vendorResponse = await pool.request().query(vendorQuery);
      vendorDetails = vendorResponse.recordset[0] || null;
    }

    return {
      success: true,
      data: {
        ...record,
        podLink: podRecord?.file_url,
        vendor: vendorDetails,
      },
    };
  } catch (err: any) {
    console.error("Error fetching LR details:", err);
    return { error: err.message || "Failed to fetch LR details" };
  }
}

export async function syncLRFromWMS(lrNumber?: string, fileNumber?: string) {
  if (!lrNumber && !fileNumber) {
    return { error: "LR Number or File Number is required" };
  }

  try {
    const pool = await getAWLWMSDBPOOL();
    let query = `
      SELECT DISTINCT 
        OutLRNo, City, OutTPT, WH, OutLRDate, 
        OutVehType, OutVehNo, PartyName, FileNo
      FROM NEWAWLDB.dbo.tbl_MDN WITH (NOLOCK)
      WHERE 1=1
    `;

    if (lrNumber) {
      query += ` AND OutLRNo = '${lrNumber}'`;
    } else if (fileNumber) {
      query += ` AND FileNo = '${fileNumber}'`;
    }

    const response = await pool.request().query(query);
    const records = response.recordset;

    if (records.length === 0) {
      return { error: "No records found to sync" };
    }

    let syncedCount = 0;
    for (const r of records) {
      // Check for POD for each LR
      const podQuery = `
        SELECT TOP 1 file_url
        FROM NEWAWLDB.dbo.gDrive_Data WITH (NOLOCK)
        WHERE tranId = '${r.OutLRNo}' AND subFolder = 'POD' AND docType = 'POD'
      `;
      const podRes = await pool.request().query(podQuery);
      const podUrl = podRes.recordset[0]?.file_url;

      await prisma.lRRequest.upsert({
        where: { LRNumber: r.OutLRNo },
        update: {
          outDate: new Date(r.OutLRDate),
          destination: r.City || "Unknown",
          tvendorId: r.OutTPT || "N/A",
          origin: r.WH || "N/A",
          vehicleType: r.OutVehType || "Unknown",
          vehicleNo: r.OutVehNo || "Unknown",
          CustomerName: r.PartyName,
          fileNumber: r.FileNo,
          podlink: podUrl || undefined,
        },
        create: {
          LRNumber: r.OutLRNo,
          outDate: new Date(r.OutLRDate),
          destination: r.City || "Unknown",
          tvendorId: r.OutTPT,
          origin: r.WH || "N/A",
          vehicleType: r.OutVehType || "Unknown",
          vehicleNo: r.OutVehNo || "Unknown",
          CustomerName: r.PartyName,
          fileNumber: r.FileNo,
          podlink: podUrl || undefined,
        },
      });
      syncedCount++;
    }

    revalidatePath("/lrs");
    revalidatePath("/lorries");
    revalidatePath("/pod");
    return {
      success: true,
      message: `Successfully synced ${syncedCount} records with POD links`,
    };
  } catch (err: any) {
    console.error("Error syncing LR:", err);
    return { error: err.message || "Failed to sync LR" };
  }
}
