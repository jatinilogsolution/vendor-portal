// src/app/api/vp/cron/recurring/route.ts
// Call this from a cron job (Vercel cron, GitHub Actions, etc.) daily
// Add to vercel.json: { "crons": [{ "path": "/api/vp/cron/recurring", "schedule": "0 9 * * *" }] }

import { NextResponse } from "next/server"
import { prisma }       from "@/lib/prisma"
import { sendEmail } from "@/services/mail"
 
const SECRET = process.env.CRON_SECRET ?? ""

export async function GET(req: Request) {
  // Protect with secret
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today    = new Date()
  const in3Days  = new Date(today)
  in3Days.setDate(today.getDate() + 3)

  // Schedules due within 3 days
  const due = await prisma.vpRecurringSchedule.findMany({
    where: {
      isActive:    true,
      nextDueDate: { lte: in3Days },
    },
    include: {
      vendor: {
        include: {
          existingVendor: { include: { users: { select: { email: true, name: true } } } },
        },
      },
    },
  })

  let reminded = 0
  for (const schedule of due) {
    const vendorEmails = schedule.vendor.existingVendor.users
      .map((u) => u.email)
      .filter(Boolean)

    if (!vendorEmails.length) continue

    const daysUntil = Math.ceil(
      (new Date(schedule.nextDueDate).getTime() - today.getTime()) / 86_400_000,
    )

    await sendEmail({
      to:           vendorEmails,
      subject:      `Reminder: Recurring invoice due ${daysUntil <= 0 ? "today" : `in ${daysUntil} day${daysUntil > 1 ? "s" : ""}`}`,
      html:         `
        <div style="font-family:Arial,sans-serif;max-width:640px">
          <h3>Recurring Invoice Due Soon</h3>
          <p>Your recurring billing schedule <strong>${schedule.title}</strong> is due on
          <strong>${new Date(schedule.nextDueDate).toLocaleDateString("en-IN")}</strong>.</p>
          <p>Please submit your invoice on the vendor portal.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor-portal/vendor/my-invoices/new"
             style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
            Submit Invoice
          </a>
        </div>
      `,
      templateType: "STATUS_CHANGE",
      relatedModel: "VpRecurringSchedule",
      relatedId:    schedule.id,
    })
    reminded++
  }

  return NextResponse.json({ reminded, total: due.length })
}