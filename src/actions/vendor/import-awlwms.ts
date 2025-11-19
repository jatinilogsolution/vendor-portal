"use server"
import { prisma } from "@/lib/prisma";
import { getAWLWMSDBPOOL } from "@/services/db";

 
export async function vendorImport() {
  try {
    const pool = await getAWLWMSDBPOOL();
    const request = pool.request();
    const today = new Date();

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    const todayStr = today.toISOString().split('T')[0];
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

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
    console.log("Sample Vendor:", vendors[0]);

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
              where: { vendorId: vendorId }, // FIXED

              update: {
                line1: v.Tadd || "N/A",
                city: v.Tcity || "Unknown",
                state: v.Tstate || null,
                postal: v.Tpin?.toString() || null,
                country: "India",
              },

              create: {
                // vendorId: vendorId, // REQUIRED
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
              // vendorId: vendorId, // REQUIRED
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
    return vendors.length;

  } catch (e) {
    console.error("❌ Error in seeding vendors:", e);
  } finally {
    await prisma.$disconnect();
  }
}


// export async function vendorImport() {
//   try {
//     const today = new Date();

//     const fiveDaysAgo = new Date();
//     // fiveDaysAgo.setDate(today.getDate() - 5);

//     const todayStr = today.toISOString().split('T')[0];
//     const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

//     const pool = await getAWLWMSDBPOOL();
//     const request = pool.request();

//     const query = `
//       SELECT DISTINCT 
//         Tid, 
//         Tname, 
//         Tadd, 
//         Tcity, 
//         Tstate, 
//         Tpin, 
//         Tcontactperson, 
//         Tcontactno, 
//         Temail, 
//         Tdoe  
//       FROM tbl_transporter 
//       WHERE Tactive='1' 
       
//     `;
// // ${fiveDaysAgoStr}
    
//     const response = await request.query(query);
//     const vendors = response.recordset;

//  console.log(`Found ${vendors.length} vendors to import.`, JSON.stringify(vendors[0]) );

//      for (const v of vendors) {
//       await prisma.vendor.upsert({
//         where: { id: v.Tid.toString() }, 
//         update: {
//           name: v.Tname,
//           contactEmail: v.temail,
//           contactPhone: v.Tcontactno,
//           isActive: true,
//           Address: {
//             upsert: {
//               where: { id: v.Tid.toString() },
//               update: {
//                 line1: v.Tadd || "N/A",
//                 city: v.Tcity || "Unknown",
//                 state: v.Tstate || null,
//                 postal: v.Tpin?.toString() || null,
//                 country: "India", // default
//               },
//               create: {
                
//                 line1: v.Tadd || "N/A",
//                 city: v.Tcity || "Unknown",
//                 state: v.Tstate || null,
//                 postal: v.Tpin?.toString() || null,
//                 country: "India",
                
//               },
//             },
//           },
//         },
//         create: {
//           id: v.Tid.toString(),
//           name: v.Tname,
//           contactEmail: v.temail,
//           contactPhone: v.Tcontactno,
//           isActive: true,
//           Address: {
//             create: {
//               line1: v.Tadd || "N/A",
//               city: v.Tcity || "Unknown",
//               state: v.Tstate || null,
//               postal: v.Tpin?.toString() || null,
//               country: "India",
//             },
//           },
//         },
//       });
//     }



//     console.log("✅ Vendor seed completed!");

//     return vendors.length
//   } catch (e) {
//     console.error("❌ Error in seeding vendors: ", e);
//   } finally {
//     await prisma.$disconnect();
//   }
// }




// export async function LRIMPORT() {
//   try {
//     const pool = await getAWLWMSDBPOOL();
//     const request = pool.request();
//     const today = new Date();

//     // Get the second last day (2 days before today)
//     const secondLastDay = new Date();
//     secondLastDay.setDate(today.getDate() - 20);

//     // Format as YYYY-MM-DD
//     const year = secondLastDay.getFullYear();
//     const month = String(secondLastDay.getMonth() + 1).padStart(2, "0");
//     const day = String(secondLastDay.getDate()).padStart(2, "0");

//     const formattedDate = `${year}-${month}-${day}`;
//     // ${formattedDate}

//     // and OutLRNo not in (select distinct tranId from NEWAWLDB.dbo.gDrive_Data  with(nolock)  where subFolder='pod'  )
//     // OutVehType not in ('COURIER')
//     const query = `select distinct  OutLRNo, City  , OutTPT , WH ,OutLRDate,OutVehType ,OutVehNo,PartyName ,FileNo from NEWAWLDB.dbo.tbl_MDN with(nolock) where CustID not in ('sberlc01') and  OutLRDate>='${formattedDate}'  and OutTransportBy='AWL' and isnull(OutGPNo,'')<>'' `;

//     const response = await request.query(query);
//     const records = response.recordset;

//     // console.log(`Found ${records.length} lorry receipts, : `, JSON.stringify(records[0]));



//     for (const r of records) {
//       try {
//         const existing = await prisma.lRRequest.findUnique({
//           where: { LRNumber: r.OutLRNo },
//         });

//         if (existing) {
//           await prisma.lRRequest.update({
//             where: { LRNumber: r.OutLRNo },
//             data: {
//               outDate: new Date(r.OutLRDate),
//               destination: r.City || "Unknown",
//               tvendorId: r.OutTPT || "N/A",
//               origin: r.WH || "N/A",
//               vehicleType: r.OutVehType || "Unknown",
//               vehicleNo: r.OutVehNo || "Unknown",
//               CustomerName: r.PartyName,
//               fileNumber: r.FileNo,
//             },
//           });
//         } else {
//           await prisma.lRRequest.create({
//             data: {
//               LRNumber: r.OutLRNo,
//               outDate: new Date(r.OutLRDate),
//               destination: r.City || "Unknown",
//               tvendorId: r.OutTPT,
//               origin: r.WH || "N/A",
//               vehicleType: r.OutVehType || "Unknown",
//               vehicleNo: r.OutVehNo || "Unknown",
//               CustomerName: r.PartyName,
//               fileNumber: r.FileNo,
//             },
//           });
//         }
//       } catch (err) {
//         console.error("❌ Failed LR record:", {
//           LRNumber: r.OutLRNo,
//           tvendorId: r.OutTPT,
//           City: r.City,
//           WH: r.WH,
//         });
//         console.error("Prisma error:", err);
//       }
//     }


//     return { total: records.length }

//     console.log("✅ Lorry Receipt seed completed!");
//   } catch (e) {
//     console.error("❌ Error seeding Lorry Receipts:", e);
//   } finally {
//     await prisma.$disconnect();
//   }
// }


export async function LRIMPORT() {
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

    console.log("✅ Lorry Receipt import completed");
    return { total: records.length };

  } catch (e) {
    console.error("❌ Error seeding Lorry Receipts:", e);
    throw e;
  }

  // ❌ DO NOT CALL prisma.$disconnect() HERE
}







export async function PODIMPORT() {
  try {
    let countUpdated = 0;
    let countNotFound = 0;

    const pool = await getAWLWMSDBPOOL();
    const request = pool.request();
    const today = new Date();

    const secondLastDay = new Date();
    secondLastDay.setDate(today.getDate() - 20);

    const year = secondLastDay.getFullYear();
    const month = String(secondLastDay.getMonth() + 1).padStart(2, "0");
    const day = String(secondLastDay.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const query = `
      SELECT DISTINCT 
        tranId AS OUTLRNO,
        file_url,
        custid
      FROM gDrive_Data WITH (NOLOCK)
      WHERE tranId <> ''
        AND CONVERT(DATE, createTime) > '${formattedDate}'
        AND subFolder = 'POD'
        AND docType = 'POD'
    `;

    const response = await request.query(query);
    const records = response.recordset;

    console.log("Found POD records:", records.length);

    for (const r of records) {
      try {
        const existing = await prisma.lRRequest.findUnique({
          where: { LRNumber: r.OUTLRNO },
        });

        if (existing) {
          await prisma.lRRequest.update({
            where: { LRNumber: r.OUTLRNO },
            data: {
              podlink: r.file_url,
            },
          });

          countUpdated++;
        } else {
          countNotFound++;
        }

      } catch (err) {
        console.error("❌ Error handling POD record:", {
          LRNumber: r.OUTLRNO,
          file_url: r.file_url,
          custid: r.custid,
        });
        console.error("Prisma error:", err);
      }
    }

    console.log("Updated PODs:", countUpdated);
    console.log("LR Not Found:", countNotFound);

    return {
      totalPOD: records.length,
      updated: countUpdated,
      notFoundLR: countNotFound,
    };

  } catch (e) {
    console.error("❌ Error in PODIMPORT:", e);
    throw e;
  }

  // ❌ NEVER disconnect Prisma in API routes or CRON
  // finally {
  //   await prisma.$disconnect();
  // }
}



// export async function PODIMPORT() {
//   try {
//     let countupdated = 0;
//     let countNotfoun = 0;

//     const pool = await getAWLWMSDBPOOL();
//     const request = pool.request();
//     const today = new Date();

//     // Get the second last day (2 days before today)
//     const secondLastDay = new Date();
//     secondLastDay.setDate(today.getDate() - 20);

//     // Format as YYYY-MM-DD
//     const year = secondLastDay.getFullYear();
//     const month = String(secondLastDay.getMonth() + 1).padStart(2, "0");
//     const day = String(secondLastDay.getDate()).padStart(2, "0");

//     const formattedDate = `${year}-${month}-${day}`;

//     const query = `SELECT distinct  tranId AS OUTLRNO,file_url,custid FROM gDrive_Data with(nolock) WHERE tranId<>'' AND CONVERT(DATE,createTime)>'${formattedDate}' AND subFolder='POD' AND docType='POD'`;

//     const response = await request.query(query);
//     const records = response.recordset;

//     // console.log(`Found ${records.length} lorry receipts, : `, JSON.stringify(records[0]));



//     for (const r of records) {
//       try {
//         const existing = await prisma.lRRequest.findUnique({
//           where: { LRNumber: r.OUTLRNO },
//         });

//         if (existing) {
//           await prisma.lRRequest.update({
//             where: { LRNumber: r.OUTLRNO },
//             data: {
//               podlink: r.file_url
//             },
//           });

//           countupdated++;
//           console.log(countNotfoun)

//         } else {
//           countNotfoun++;
//           console.warn(countNotfoun)
//         }
//       } catch (err) {
//         console.error("❌ Failed LR record:", {
//           LRNumber: r.OutLRNo,
//           tvendorId: r.OutTPT,
//           City: r.City,
//           WH: r.WH,
//         });
//         console.error("Prisma error:", err);
//       }
//     }


//     return { total: records.length }

//     console.log("✅ Lorry Receipt seed completed!");
//   } catch (e) {
//     console.error("❌ Error seeding Lorry Receipts:", e);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
