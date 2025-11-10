// import { prisma } from "@/lib/prisma"
// import { revalidatePath } from "next/cache"
// import { NextResponse } from "next/server"
 
// export async function DELETE(req: Request, { params }: { params:Promise< { id: string } >}) {
//   const { id } =await params

//   if (!id) {
//     return NextResponse.json({ error: "Annexure ID is required" }, { status: 400 })
//   }

//   try {
//     // Step 1: Unlink all LRRequests linked to this annexure
//     const updatedLRs = await prisma.lRRequest.updateMany({
//       where: { annexureId: id },
//       data: { annexureId: null },
//     })

//     // Step 2: Delete the Annexure
//     const deletedAnnexure = await prisma.annexure.delete({
//       where: { id },
//     })

//     revalidatePath("/lorries/annexure")
//     return NextResponse.json({
//       message: "Annexure deleted successfully",
//       unlinkedCount: updatedLRs.count,
//       deletedAnnexure,
//     })
//   } catch (err: any) {
//     console.error("❌ Error deleting annexure:", err)
//     return NextResponse.json({ error: err.message || "Failed to delete annexure" }, { status: 500 })
//   }
// }
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const annexure = await prisma.annexure.findUnique({
      where: { id: id },
      include: { LRRequest: true },
    })

    if (!annexure) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // unlink all LRs
    await prisma.lRRequest.updateMany({
      where: { annexureId: id },
      data: { annexureId: null },
    })

    await prisma.annexure.delete({ where: { id:  id } })

    return NextResponse.json({
      success: true,
      message: "Annexure deleted successfully",
      unlinkedCount: annexure.LRRequest.length,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete annexure" }, { status: 500 })
  }
}
