// validate file 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: {params:  Promise<{ id: string}>}) {
  const {id} =await params;
  const { lrNumber } = await req.json();

  if (!lrNumber) {
    return NextResponse.json({ error: "LR number required" }, { status: 400 });
  }

  // 1. LR exists?
  const lr = await prisma.lRRequest.findUnique({
    where: { LRNumber: lrNumber },
  });

  if (!lr) {
    return NextResponse.json(
      { error: "LR not found in database." },
      { status: 400 }
    );
  }

  // 2. LR has fileNumber?
  const fileNumber = lr.fileNumber;
  if (!fileNumber) {
    return NextResponse.json(
      { error: "This LR has no File Number assigned. Cannot attach." },
      { status: 400 }
    );
  }

  // 3. Fetch all LRs in this file
  const fileLRs = await prisma.lRRequest.findMany({
    where: { fileNumber },
    orderBy: { LRNumber: "asc" },
  });

  // 4. Check if this file is attached to another annexure
  const inOther = fileLRs.find(
    (x) => x.annexureId && x.annexureId !== id
  );

  if (inOther) {
    const ann = await prisma.annexure.findUnique({
      where: { id: inOther.annexureId! },
    });
    return NextResponse.json(
      {
        error: `This File (${fileNumber}) already belongs to Annexure "${ann?.name}".`,
      },
      { status: 400 }
    );
  }

  // 5. Check if invoiced
  const invoiced = fileLRs.find((x) => x.isInvoiced);
  if (invoiced) {
    return NextResponse.json(
      {
        error: `LR ${invoiced.LRNumber} is already invoiced. Cannot attach this file.`,
      },
      { status: 400 }
    );
  }

  // 6. Check if already in current annexure
  const inCurrent = fileLRs.find((x) => x.annexureId === id);
  if (inCurrent) {
    return NextResponse.json(
      { error: `This file (${fileNumber}) already exists in this annexure.` },
      { status: 400 }
    );
  }

  // 7. All good → return list of LRs
  return NextResponse.json({
    success: true,
    fileNumber,
    total: fileLRs.length,
    lrs: fileLRs.map((x) => ({
      id: x.id,
      LRNumber: x.LRNumber,
      price: x.lrPrice ?? null,
      extra: x.extraCost ?? null,
      podlink: x.podlink ?? null,
      remark: x.remark ?? "",
    })),
  });
}
