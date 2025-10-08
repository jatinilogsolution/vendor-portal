import { prisma } from "@/lib/prisma";
import { getAWLWMSDBPOOL } from "@/services/db";
import { WarehouseAddressProps } from "@/validations/global";


export async function mainDDDD() {
  try {
    // ✅ Fetch vendors from SQL Server
    const pool = await getAWLWMSDBPOOL();
    const request = pool.request();

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
        Temail  
      FROM tbl_transporter 
      WHERE Tactive='1'
    `;

    const response = await request.query(query);
    const vendors = response.recordset;

    console.log(`Found ${vendors.length} transport vendors`);

    for (const v of vendors) {
      // ✅ Create Vendor with Address in Prisma
      await prisma.vendor.upsert({
        where: { id: v.Tid.toString() }, // use Tid as stable unique id
        update: {
          name: v.Tname,
          contactEmail: v.temail,
          contactPhone: v.Tcontactno,
          isActive: true,
          Address: {
            upsert: {
              where: { id: v.Tid.toString() },
              update: {
                line1: v.Tadd || "N/A",
                city: v.Tcity || "Unknown",
                state: v.Tstate || null,
                postal: v.Tpin?.toString() || null,
                country: "India", // default
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
          id: v.Tid.toString(),
          name: v.Tname,
          contactEmail: v.temail,
          contactPhone: v.Tcontactno,
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

    console.log("✅ Vendor seed completed!");
  } catch (e) {
    console.error("❌ Error in seeding vendors: ", e);
  } finally {
    await prisma.$disconnect();
  }
}





export async function LRIMPORT() {
  try {
    const pool = await getAWLWMSDBPOOL();
    const request = pool.request();

    const query = `select distinct  OutLRNo, City  , OutTPT , WH ,OutLRDate,OutVehType ,OutVehNo,PartyName ,FileNo from NEWAWLDB.dbo.tbl_MDN with(nolock) where CustID not in ('sberlc01') and  OutLRDate>='2025-07-01' 
         and OutLRNo not in (select distinct tranId from NEWAWLDB.dbo.gDrive_Data  with(nolock)  where subFolder='pod'  ) and OutTransportBy='AWL' 
         and isnull(OutGPNo,'')<>''  and  OutVehType not in ('COURIER')`;

    const response = await request.query(query);
    const records = response.recordset;

    console.log(`Found ${records.length} lorry receipts, : `, JSON.stringify(records[0]));

    //   for (const r of records) {
    //   const existing = await prisma.lRRequest.findUnique({
    //     where: { LRNumber: r.OutLRNo },
    //   });

    //   if (existing) {
    //     await prisma.lRRequest.update({
    //       where: { LRNumber: r.OutLRNo },
    //       data: {
    //         outDate: new Date(r.OutLRDate),
    //         destination: r.City || "Unknown",
    //         tvendorId: r.OutTPT || "N/A",
    //         origin: r.WH || "N/A",
    //         vehicleType: r.OutVehType || "Unknown",
    //         vehicleNo: r.OutVehNo || "Unknown",
    //         CustomerName: r.PartyName,
    //         fileNumber: r.FileNo
    //       },
    //     });
    //   } else {
    //     await prisma.lRRequest.create({
    //       data: {
    //         LRNumber: r.OutLRNo,
    //         outDate: new Date(r.OutLRDate),
    //         destination: r.City || "Unknown",
    //         tvendorId: r.OutTPT,
    //         origin: r.WH || "N/A",
    //         vehicleType: r.OutVehType || "Unknown",
    //         vehicleNo: r.OutVehNo || "Unknown",
    //         CustomerName: r.PartyName,
    //         fileNumber: r.FileNo
    //       },
    //     });
    //   }
    // }

    for (const r of records) {
      try {
        const existing = await prisma.lRRequest.findUnique({
          where: { LRNumber: r.OutLRNo },
        });

        if (existing) {
          await prisma.lRRequest.update({
            where: { LRNumber: r.OutLRNo },
            data: {
              outDate: new Date(r.OutLRDate),
              destination: r.City || "Unknown",
              tvendorId: r.OutTPT || "N/A",
              origin: r.WH || "N/A",
              vehicleType: r.OutVehType || "Unknown",
              vehicleNo: r.OutVehNo || "Unknown",
              CustomerName: r.PartyName,
              fileNumber: r.FileNo,
            },
          });
        } else {
          await prisma.lRRequest.create({
            data: {
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
        }
      } catch (err) {
        console.error("❌ Failed LR record:", {
          LRNumber: r.OutLRNo,
          tvendorId: r.OutTPT,
          City: r.City,
          WH: r.WH,
        });
        console.error("Prisma error:", err);
      }
    }



    console.log("✅ Lorry Receipt seed completed!");
  } catch (e) {
    console.error("❌ Error seeding Lorry Receipts:", e);
  } finally {
    await prisma.$disconnect();
  }
}
