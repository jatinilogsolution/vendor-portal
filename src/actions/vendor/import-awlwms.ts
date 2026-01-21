"use server";
import { prisma } from "@/lib/prisma";
import { getAWLWMSDBPOOL } from "@/services/db";

export type ImportResult = {
  success: boolean;
  message: string;
  count?: number;
  details?: any;
  error?: string;
};

export async function vendorImport(): Promise<ImportResult> {
  try {
    const pool = await getAWLWMSDBPOOL();
    const request = pool.request();
    const today = new Date();

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    const todayStr = today.toISOString().split("T")[0];
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split("T")[0];

    const query = `
      SELECT DISTINCT 
        Tid, 
        Tname, 
        Tadd, 
        Tcity, 
        Tstate, 
        Tpin, 
        Tcontactperson, 
        Tcontactno, 
        Temail, 
        Tdoe  
      FROM tbl_transporter 
      WHERE Tactive = '1'  AND Tdoe >= '${fiveDaysAgoStr}' AND Tdoe <= '${todayStr}'
    `;

    const response = await request.query(query);
    const vendors = response.recordset;

    console.log(`Found ${vendors.length} vendors to import.`);

    for (const v of vendors) {
      const vendorId = v.Tid.toString();

      await prisma.vendor.upsert({
        where: { id: vendorId },
        update: {
          name: v.Tname,
          contactEmail: v.Temail ?? null,
          contactPhone: v.Tcontactno ?? null,
          isActive: true,
          Address: {
            upsert: {
              where: { vendorId: vendorId },
              update: {
                line1: v.Tadd || "N/A",
                city: v.Tcity || "Unknown",
                state: v.Tstate || null,
                postal: v.Tpin?.toString() || null,
                country: "India",
              },
              create: {
                line1: v.Tadd || "N/A",
                city: v.Tcity || "Unknown",
                state: v.Tstate || null,
                postal: v.Tpin?.toString() || null,
                country: "India",
              },
            },
          },
        },
        create: {
          id: vendorId,
          name: v.Tname,
          contactEmail: v.Temail ?? null,
          contactPhone: v.Tcontactno ?? null,
          isActive: true,
          Address: {
            create: {
              line1: v.Tadd || "N/A",
              city: v.Tcity || "Unknown",
              state: v.Tstate || null,
              postal: v.Tpin?.toString() || null,
              country: "India",
            },
          },
        },
      });
    }

    return {
      success: true,
      message: `${vendors.length} vendors imported successfully`,
      count: vendors.length,
    };
  } catch (e) {
    console.error("❌ Error in seeding vendors:", e);
    return {
      success: false,
      message: "Failed to import vendors",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function LRIMPORT(): Promise<ImportResult> {
  try {
    const pool = await getAWLWMSDBPOOL();
    const request = pool.request();
    const today = new Date();

    const secondLastDay = new Date();
    secondLastDay.setDate(today.getDate() - 2);

    const year = secondLastDay.getFullYear();
    const month = String(secondLastDay.getMonth() + 1).padStart(2, "0");
    const day = String(secondLastDay.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const query = `
      SELECT DISTINCT 
        OutLRNo, City, OutTPT, WH, OutLRDate, 
        OutVehType, OutVehNo, PartyName, FileNo
      FROM NEWAWLDB.dbo.tbl_MDN WITH (NOLOCK)
      WHERE CustID NOT IN ('sberlc01')
        AND OutLRDate >= '${formattedDate}'
        AND OutTransportBy = 'AWL'
        AND ISNULL(OutGPNo, '') <> ''
    `;

    const response = await request.query(query);
    const records = response.recordset;

    let skipped = 0;
    let processed = 0;

    for (const r of records) {
      try {
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
          },
        });
        processed++;
      } catch (err) {
        console.error(`❌ Failed processing LR record: ${r.OutLRNo}`, err);
        skipped++;
      }
    }

    return {
      success: true,
      message: `${processed} Lorry Receipts imported/updated successfully`,
      count: processed,
      details: { total: records.length, skipped },
    };
  } catch (e) {
    console.error("❌ Error seeding Lorry Receipts:", e);
    return {
      success: false,
      message: "Failed to import Lorry Receipts",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function PODIMPORT(): Promise<ImportResult> {
  try {
    let countUpdated = 0;
    let countNotFound = 0;
    let countError = 0;

    const pool = await getAWLWMSDBPOOL();
    const request = pool.request();
    const today = new Date();

    const secondLastDay = new Date();
    secondLastDay.setDate(today.getDate() - 3);

    const year = secondLastDay.getFullYear();
    const month = String(secondLastDay.getMonth() + 1).padStart(2, "0");
    const day = String(secondLastDay.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const query = `
      SELECT DISTINCT 
        tranId AS OUTLRNO,
        file_url,
        custid
      FROM NEWAWLDB.dbo.gDrive_Data WITH (NOLOCK)
      WHERE tranId <> ''
        AND CONVERT(DATE, createTime) > '${formattedDate}'
        AND subFolder = 'POD'
        AND docType = 'POD'
    `;

    const response = await request.query(query);
    const records = response.recordset;

    console.log(`Found ${records.length} POD records to process.`);

    for (const r of records) {
      try {
        const updated = await prisma.lRRequest.updateMany({
          where: { LRNumber: r.OUTLRNO },
          data: { podlink: r.file_url },
        });

        if (updated.count > 0) {
          countUpdated++;
        } else {
          countNotFound++;
        }
      } catch (err) {
        console.error(`❌ Error updating POD for LR: ${r.OUTLRNO}`, err);
        countError++;
      }
    }

    return {
      success: true,
      message: `${countUpdated} PODs linked successfully`,
      count: countUpdated,
      details: {
        total: records.length,
        notFound: countNotFound,
        errors: countError,
      },
    };
  } catch (e) {
    console.error("❌ Error in PODIMPORT:", e);
    return {
      success: false,
      message: "Failed to import POD links",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
