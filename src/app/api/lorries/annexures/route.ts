// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const annexures = await prisma.annexure.findMany({
//       include: {
//         _count: {
//           select: { LRRequest: true },
//         },
//       },
//       orderBy: { fromDate: "desc" },
//     });

//     return NextResponse.json(annexures);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to fetch annexures" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const annexures = await prisma.annexure.findMany({
      orderBy: {  fromDate: "desc" },
      include: {
        _count: { select: { LRRequest: true } },
      },
    })

    return NextResponse.json(annexures)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch annexures" }, { status: 500 })
  }
}
