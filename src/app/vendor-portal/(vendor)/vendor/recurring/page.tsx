// src/app/vendor-portal/(vendor)/vendor/recurring/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  IconRepeat, IconRefresh, IconPlus,
  IconReceipt, IconCalendar, IconClock,
} from "@tabler/icons-react"
import { Button }   from "@/components/ui/button"
import { Badge }    from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { VpPageHeader }  from "@/components/ui/vp-page-header"
import { VpEmptyState }  from "@/components/ui/vp-empty-state"
 import {
  getMyRecurringSchedules,
  VpRecurringRow,
} from "@/actions/vp/recurring.action"

const CYCLE_LABELS: Record<string, string> = {
  MONTHLY:   "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY:    "Yearly",
}

const CYCLE_COLOR: Record<string, string> = {
  MONTHLY:   "bg-blue-100 text-blue-700 border-blue-200",
  QUARTERLY: "bg-violet-100 text-violet-700 border-violet-200",
  YEARLY:    "bg-amber-100 text-amber-700 border-amber-200",
}

function isDuesSoon(date: Date): boolean {
  const diff = new Date(date).getTime() - Date.now()
  return diff >= 0 && diff <= 7 * 86_400_000
}

function isOverdue(date: Date): boolean {
  return new Date(date).getTime() < Date.now()
}

export default function VendorRecurringPage() {
  const router   = useRouter()
  const [schedules, setSchedules] = useState<VpRecurringRow[]>([])
  const [loading,   setLoading]   = useState(true)
  const [isPending, startTransition] = useTransition()

  const load = useCallback(async () => {
    setLoading(true)
    const res = await getMyRecurringSchedules()
    if (!res.success) { toast.error(res.error); setLoading(false); return }
    setSchedules(res.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const overdue  = schedules.filter((s) => isOverdue(new Date(s.nextDueDate)))
  const dueSoon  = schedules.filter((s) => isDuesSoon(new Date(s.nextDueDate)))
  const upcoming = schedules.filter(
    (s) => !isOverdue(new Date(s.nextDueDate)) && !isDuesSoon(new Date(s.nextDueDate)),
  )

  return (
    <div className="space-y-6">
      <VpPageHeader
        title="Recurring Bills"
        description="Track and raise invoices for your recurring billing schedules."
        actions={
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
          </Button>
        }
      />

      {/* Overdue alert */}
      {!loading && overdue.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            ⚠️ {overdue.length} schedule{overdue.length > 1 ? "s are" : " is"} overdue
          </p>
          <p className="mt-0.5 text-xs text-red-600 dark:text-red-300">
            Please raise and submit these invoices as soon as possible.
          </p>
        </div>
      )}

      {/* Due soon alert */}
      {!loading && dueSoon.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            🔔 {dueSoon.length} schedule{dueSoon.length > 1 ? "s are" : " is"} due within 7 days
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <VpEmptyState
          icon={IconRepeat}
          title="No recurring schedules"
          description="Your admin will set up recurring billing schedules for you. They will appear here."
        />
      ) : (
        <div className="space-y-6">
          {/* Overdue */}
          {overdue.length > 0 && (
            <Section title="Overdue" count={overdue.length} variant="danger">
              {overdue.map((s) => (
                <ScheduleCard
                  key={s.id}
                  schedule={s}
                  variant="danger"
                  onRaise={() => router.push(
                    `/vendor-portal/vendor/my-invoices/new?scheduleId=${s.id}`,
                  )}
                />
              ))}
            </Section>
          )}

          {/* Due soon */}
          {dueSoon.length > 0 && (
            <Section title="Due Soon" count={dueSoon.length} variant="warning">
              {dueSoon.map((s) => (
                <ScheduleCard
                  key={s.id}
                  schedule={s}
                  variant="warning"
                  onRaise={() => router.push(
                    `/vendor-portal/vendor/my-invoices/new?scheduleId=${s.id}`,
                  )}
                />
              ))}
            </Section>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <Section title="Upcoming" count={upcoming.length} variant="default">
              {upcoming.map((s) => (
                <ScheduleCard
                  key={s.id}
                  schedule={s}
                  variant="default"
                  onRaise={() => router.push(
                    `/vendor-portal/vendor/my-invoices/new?scheduleId=${s.id}`,
                  )}
                />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

// ── Section wrapper ────────────────────────────────────────────

function Section({
  title, count, variant, children,
}: {
  title:    string
  count:    number
  variant:  "danger" | "warning" | "default"
  children: React.ReactNode
}) {
  const color = {
    danger:  "text-red-600",
    warning: "text-amber-600",
    default: "text-muted-foreground",
  }[variant]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className={`text-sm font-semibold ${color}`}>{title}</h3>
        <Badge variant="outline" className="text-xs">{count}</Badge>
        <div className="flex-1 border-t" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  )
}

// ── Schedule card ──────────────────────────────────────────────

function ScheduleCard({
  schedule, variant, onRaise,
}: {
  schedule: VpRecurringRow
  variant:  "danger" | "warning" | "default"
  onRaise:  () => void
}) {
  const dueDate   = new Date(schedule.nextDueDate)
  const overdue   = isOverdue(dueDate)
  const items     = schedule.itemsSnapshot as {
    description: string
    qty:         number
    unitPrice:   number
  }[]
  const subtotal  = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)

  const borderColor = {
    danger:  "border-red-200 dark:border-red-800",
    warning: "border-amber-200 dark:border-amber-800",
    default: "border",
  }[variant]

  const badgeClass = CYCLE_COLOR[schedule.cycle] ?? ""

  return (
    <Card className={`flex flex-col ${borderColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{schedule.title}</CardTitle>
          <Badge
            variant="outline"
            className={`shrink-0 text-[10px] ${badgeClass}`}
          >
            {CYCLE_LABELS[schedule.cycle] ?? schedule.cycle}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm">
        {/* Due date */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${
          overdue
            ? "text-red-600"
            : isDuesSoon(dueDate)
              ? "text-amber-600"
              : "text-muted-foreground"
        }`}>
          {overdue ? <IconClock size={13} /> : <IconCalendar size={13} />}
          {overdue
            ? `Overdue since ${format(dueDate, "d MMM yyyy")}`
            : `Due ${format(dueDate, "d MMM yyyy")}`
          }
        </div>

        <Separator />

        {/* Items snapshot */}
        <div className="space-y-1.5">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-2">
              <span className="text-xs text-muted-foreground line-clamp-1 flex-1">
                {item.description}
              </span>
              <span className="shrink-0 text-xs font-medium">
                ×{item.qty}
              </span>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-muted-foreground">+{items.length - 3} more items</p>
          )}
        </div>

        <Separator />

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Est. Amount</span>
          <span className="text-sm font-bold">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Last invoice */}
        {schedule.lastInvoiceId && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last Invoice</span>
            
            <a  href={`/vendor-portal/vendor/my-invoices/${schedule.lastInvoiceId}`}
              className="text-xs text-primary hover:underline"
            >
              View
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <Button
          size="sm"
          className="w-full"
          variant={overdue ? "default" : "outline"}
          onClick={onRaise}
        >
          <IconReceipt size={14} className="mr-1.5" />
          Raise Invoice
        </Button>
      </CardFooter>
    </Card>
  )
}