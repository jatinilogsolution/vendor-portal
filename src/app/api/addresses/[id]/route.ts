import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await req.json().catch(() => ({}))
  const data: Record<string, any> = {}
  if (typeof body.line1 === "string") data.line1 = body.line1
  if (typeof body.line2 === "string" || body.line2 === null) data.line2 = body.line2
  if (typeof body.city === "string") data.city = body.city
  if (typeof body.state === "string" || body.state === null) data.state = body.state
  if (typeof body.postal === "string" || body.postal === null) data.postal = body.postal
  if (typeof body.country === "string") data.country = body.country

  if (Object.keys(data).length === 0) {
    return new Response(JSON.stringify({ error: "No valid fields provided" }), { status: 400 })
  }

  const updated = await prisma.address.update({
    where: { id },
    data,
  })

  return Response.json(updated)
}
