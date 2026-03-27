 
import { NextResponse } from "next/server"
import { auth }   from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json(null, { status: 401 })

    const user = await prisma.user.findUnique({
      where:  { id: session.user.id },
      select: {
        name:  true,
        email: true,
        phone: true,
        Vendor: {
          select: {
            name:         true,
            contactEmail: true,
            contactPhone: true,
            gstNumber:    true,
            panNumber:    true,
            paymentTerms: true,
            isActive:     true,
            Address:      true,
            vpVendors: {
              take:   1,
              select: {
                id:             true,
                vendorType:     true,
                billingType:    true,
                recurringCycle: true,
                portalStatus:   true,
                category:       { select: { name: true } },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(user)
  } catch (e) {
    return NextResponse.json(null, { status: 500 })
  }
}