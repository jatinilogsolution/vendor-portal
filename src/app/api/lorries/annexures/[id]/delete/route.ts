// src/app/api/lorries/annexures/[id]/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const annexure = await prisma.annexure.findUnique({ where: { id: id }, include: { LRRequest: true } });
    if (!annexure) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // unlink LRs
    const unlinked = await prisma.lRRequest.updateMany({ where: { annexureId:  id }, data: { annexureId: null, groupId: null } });

    // delete groups
    await prisma.annexureFileGroup.deleteMany({ where: { annexureId:  id } });

    // delete annexure
    await prisma.annexure.delete({ where: { id:  id } });

    return NextResponse.json({ success: true, unlinkedCount: unlinked.count });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
