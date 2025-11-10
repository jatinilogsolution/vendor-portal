// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const {id} = await params
//     const annexure = await prisma.annexure.findUnique({
//       where: { id: id },
//       include: {
//         LRRequest: true,
//       },
//     });

//     if (!annexure) return NextResponse.json({ error: "Not found" }, { status: 404 });

//     return NextResponse.json({ annexure, lrRequests: annexure.LRRequest });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const annexure = await prisma.annexure.findUnique({
      where: { id: id },
      include: {
        LRRequest: {
          orderBy: { createdAt: "desc" },
          include: {
            tvendor: { select: { name: true } },
          },
        },
      },
    })

    if (!annexure) return NextResponse.json({ error: "Annexure not found" }, { status: 404 })

    // Get documents linked to fileNumbers
    const fileNos = annexure.LRRequest.map(lr => lr.fileNumber)
    const docs = await prisma.document.findMany({
      where: { linkedId: { in: fileNos } },
    })

    return NextResponse.json({ annexure, documents: docs })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch annexure" }, { status: 500 })
  }
}
