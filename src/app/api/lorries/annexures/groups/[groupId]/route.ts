// group/[gorupId]
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params:Promise<{ groupId: string }> }) {
  try {

    const {groupId} = await params
    const group = await prisma.annexureFileGroup.findUnique({ where: { id: groupId } });
    if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

    // unlink LRs
    const unlinked = await prisma.lRRequest.updateMany({
      where: { groupId: groupId },
      data: { groupId: null, annexureId: null },
    });

    await prisma.annexureFileGroup.delete({ where: { id: groupId } });

    return NextResponse.json({ success: true, unlinkedCount: unlinked.count });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal" }, { status: 500 });
  }
}

 