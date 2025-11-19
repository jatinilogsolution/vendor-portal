

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { lrNumbers } = body

        if (!lrNumbers || !Array.isArray(lrNumbers) || lrNumbers.length === 0) {
            return NextResponse.json({ error: "lrNumbers array required" }, { status: 400 })
        }

        const annexure = await prisma.annexure.findUnique({ where: { id } })
        if (!annexure) return NextResponse.json({ error: "Annexure not found" }, { status: 404 })

        const added: string[] = []
        const missingInDb: string[] = []
        const alreadyAnnexured: string[] = []
        const alreadyInvoiced: string[] = []
        const missingPod: string[] = []
        const duplicateInFile: string[] = []
        const createdGroups: any[] = []

        const seenInFile = new Set<string>()

        for (const lrNum of lrNumbers) {
            const lrNumber = String(lrNum).trim().toUpperCase()

            if (seenInFile.has(lrNumber)) {
                duplicateInFile.push(lrNumber)
                continue
            }
            seenInFile.add(lrNumber)

            const lr = await prisma.lRRequest.findUnique({ where: { LRNumber: lrNumber }, include: { Invoice: true } })
            if (!lr) {
                missingInDb.push(lrNumber)
                continue
            }

            if (lr.annexureId) {
                alreadyAnnexured.push(lrNumber)
                continue
            }

            const isInvoicedStatus = lr.isInvoiced || !!lr.invoiceId
            if (isInvoicedStatus) {
                alreadyInvoiced.push(lrNumber)
                continue
            }

            if (!lr.podlink) {
                missingPod.push(lrNumber)
                continue
            }

            const fileNumber = lr.fileNumber
            let group = await prisma.annexureFileGroup.findFirst({
                where: { annexureId: id, fileNumber },
            })

            if (!group) {
                group = await prisma.annexureFileGroup.create({
                    data: {
                        annexureId: id,
                        fileNumber,
                        totalPrice: 0,
                        extraCost: 0,
                    },
                })
                createdGroups.push(group)
            }

            await prisma.lRRequest.update({
                where: { id: lr.id },
                data: { annexureId: id, groupId: group.id },
            })

            added.push(lrNumber)
        }

        return NextResponse.json({
            success: true,
            added,
            missingInDb,
            alreadyAnnexured,
            alreadyInvoiced,
            missingPod,
            duplicateInFile,
            createdGroups,
        })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
    }
}
