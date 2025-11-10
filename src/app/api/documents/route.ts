// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function POST(req: Request) {
//   try {
//     const { label, url, linkedId, description, entryBy } = await req.json()
//     if (!linkedId || !url) return NextResponse.json({ error: 'linkedId and url required' }, { status: 400 })

//     const existing = await prisma.document.findUnique({ where: { linkedId } })
//     if (existing) {
//       const updated = await prisma.document.update({ where: { linkedId }, data: { url, label, description, entryBy } })
//       return NextResponse.json(updated)
//     }

//     const doc = await prisma.document.create({ data: { label, url, linkedId, description, entryBy } })
//     return NextResponse.json(doc)
//   } catch (err) {
//     console.error(err)
//     return NextResponse.json({ error: 'Internal' }, { status: 500 })
//   }
// }

// app/api/documents/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST { label, url, linkedId, description, entryBy }
 * linkedId is unique — if exists update, else create
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { label, url, linkedId, description, entryBy } = body;
    if (!linkedId || !url) return NextResponse.json({ error: "linkedId and url required" }, { status: 400 });

    const existing = await prisma.document.findUnique({ where: { linkedId } });
    if (existing) {
      const updated = await prisma.document.update({
        where: { linkedId },
        data: { url, label, description, entryBy },
      });
      return NextResponse.json(updated);
    }

    const doc = await prisma.document.create({
      data: { label, url, linkedId, description, entryBy },
    });
    return NextResponse.json(doc);
  } catch (err: any) {
    console.error("documents route error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
