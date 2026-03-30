// src/app/vendor-portal/(admin)/admin/recurring/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  IconRepeat, IconRefresh, IconPlus,
  IconClock, IconCalendar, IconTrash,
} from "@tabler/icons-react"
import { z } from "zod"
import { Button }   from "@/components/ui/button"
import { Badge }    from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input }    from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { VpPageHeader }  from "@/components/ui/vp-page-header"
import { VpEmptyState }  from "@/components/ui/vp-empty-state"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import {
  getAllRecurringSchedules,
  createRecurringSchedule,
  VpRecurringRow,
} from "@/actions/vp/recurring.action"
import { getVpVendors } from "@/actions/vp/vendor.action"

// ── Form schema ────────────────────────────────────────────────

const scheduleSchema = z.object({
  vendorId:  z.string().min(1, "Vendor is required"),
  title:     z.string().min(3, "Title is required"),
  cycle:     z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  startDate: z.string().min(1, "Start date is required"),
  items:     z.array(z.object({
    description: z.string().min(1, "Description required"),
    qty:         z.coerce.number<number>().min(0.01),
    unitPrice:   z.coerce.number<number>().min(0),
  })).min(1, "Add at least one item"),
})
type ScheduleFormInput = z.input<typeof scheduleSchema>
type ScheduleFormValues = z.output<typeof scheduleSchema>

// ── Helpers ────────────────────────────────────────────────────

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

function isOverdue(date: Date): boolean {
  return new Date(date).getTime() < Date.now()
}
function isDueSoon(date: Date): boolean {
  const diff = new Date(date).getTime() - Date.now()
  return diff >= 0 && diff <= 7 * 86_400_000
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminRecurringPage() {
  const [schedules, setSchedules] = useState<VpRecurringRow[]>([])
  const [vendors,   setVendors]   = useState<{ id: string; name: string }[]>([])
  const [loading,   setLoading]   = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const load = useCallback(async () => {
    setLoading(true)
    const [schRes, vRes] = await Promise.all([
      getAllRecurringSchedules(),
      getVpVendors({ per_page: 200, status: "ACTIVE" }),
    ])
    if (schRes.success) setSchedules(schRes.data)
    if (vRes.success)   setVendors(vRes.data.data.map((v) => ({ id: v.id, name: v.vendor.name })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const form = useForm<ScheduleFormInput, unknown, ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      vendorId:  "",
      title:     "",
      cycle:     "MONTHLY",
      startDate: new Date().toISOString().split("T")[0],
      items:     [{ description: "", qty: 1, unitPrice: 0 }],
    },
  })

  const items = form.watch("items")

  const addItem = () =>
    form.setValue("items", [...items, { description: "", qty: 1, unitPrice: 0 }])

  const removeItem = (i: number) =>
    form.setValue("items", items.filter((_, idx) => idx !== i))

  const onSubmit = (values: ScheduleFormValues) => {
    startTransition(async () => {
      const res = await createRecurringSchedule(values)
      if (!res.success) { toast.error(res.error); return }
      toast.success("Recurring schedule created")
      setDialogOpen(false)
      form.reset()
      load()
    })
  }

  // Stats
  const overdueCount = schedules.filter((s) => isOverdue(new Date(s.nextDueDate))).length
  const dueSoonCount = schedules.filter((s) => isDueSoon(new Date(s.nextDueDate))).length

  return (
    <div className="space-y-6">
      <VpPageHeader
        title="Recurring Schedules"
        description={`${schedules.length} active schedule${schedules.length !== 1 ? "s" : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <IconPlus className="mr-1 h-4 w-4" />
              New Schedule
            </Button>
          </div>
        }
      />

      {/* Alerts */}
      {!loading && overdueCount > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-semibold text-red-700">
            ⚠️ {overdueCount} vendor{overdueCount > 1 ? "s have" : " has"} overdue recurring invoices
          </p>
          <p className="mt-0.5 text-xs text-red-600">
            Follow up with the vendor or check their invoice submission.
          </p>
        </div>
      )}
      {!loading && dueSoonCount > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-semibold text-amber-700">
            🔔 {dueSoonCount} schedule{dueSoonCount > 1 ? "s are" : " is"} due within 7 days
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <VpEmptyState
          icon={IconRepeat}
          title="No recurring schedules"
          description="Create schedules for vendors with recurring or rental billing."
          action={{ label: "New Schedule", onClick: () => setDialogOpen(true) }}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead className="text-right">Est. Amount</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Last Invoice</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((s) => {
                const dueDate  = new Date(s.nextDueDate)
                const overdue  = isOverdue(dueDate)
                const dueSoon  = isDueSoon(dueDate)
                const subtotal = s.itemsSnapshot.reduce(
                  (sum: number, i: any) => sum + i.qty * i.unitPrice, 0,
                )

                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-sm max-w-48">
                      <p className="truncate">{s.title}</p>
                    </TableCell>
                    <TableCell className="text-sm">{s.vendorName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${CYCLE_COLOR[s.cycle] ?? ""}`}
                      >
                        {CYCLE_LABELS[s.cycle] ?? s.cycle}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${
                        overdue ? "text-red-600" : dueSoon ? "text-amber-600" : "text-muted-foreground"
                      }`}>
                        {overdue
                          ? <IconClock size={12} />
                          : <IconCalendar size={12} />
                        }
                        {format(dueDate, "d MMM yyyy")}
                        {overdue  && <span className="ml-1 text-[10px]">(Overdue)</span>}
                        {dueSoon  && !overdue && <span className="ml-1 text-[10px]">(Soon)</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.itemsSnapshot.length} item{s.itemsSnapshot.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      {s.lastInvoiceId
                        ? (
                          <a
                            href={`/vendor-portal/admin/invoices/${s.lastInvoiceId}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View last
                          </a>
                        )
                        : <span className="text-xs text-muted-foreground">None yet</span>
                      }
                    </TableCell>
                    <TableCell>
                      <VpStatusBadge status={s.isActive ? "ACTIVE" : "INACTIVE"} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create schedule dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) { setDialogOpen(false); form.reset() } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Recurring Schedule</DialogTitle>
            <DialogDescription>
              Set up a recurring billing schedule for a vendor. They will be
              reminded and can raise invoices directly from this schedule.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Vendor */}
              <FormField control={form.control} name="vendorId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor <span className="text-destructive">*</span></FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendors.map((v) => (
                        <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Title */}
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Monthly Logistics Bill — Jiya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-3">
                {/* Cycle */}
                <FormField control={form.control} name="cycle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Start date */}
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Due Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Line items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Recurring Items</p>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <IconPlus size={13} className="mr-1" />Add
                  </Button>
                </div>

                {items.map((_, i) => (
                  <div key={i} className="grid grid-cols-12 items-end gap-2 rounded-md border bg-muted/20 p-2">
                    <div className="col-span-6">
                      {i === 0 && <p className="mb-1 text-xs text-muted-foreground">Description</p>}
                      <FormField
                        control={form.control}
                        name={`items.${i}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input className="h-8 text-xs" placeholder="Item description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      {i === 0 && <p className="mb-1 text-xs text-muted-foreground">Qty</p>}
                      <FormField
                        control={form.control}
                        name={`items.${i}.qty`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" min={0} step={0.01} className="h-8 text-xs" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      {i === 0 && <p className="mb-1 text-xs text-muted-foreground">Unit Price (₹)</p>}
                      <FormField
                        control={form.control}
                        name={`items.${i}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" min={0} step={0.01} className="h-8 text-xs" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 flex items-end pb-0.5">
                      {items.length > 1 && (
                        <Button
                          type="button" variant="ghost" size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(i)}
                        >
                          <IconTrash size={13} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {form.formState.errors.items?.root && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.items.root.message}
                  </p>
                )}

                {/* Subtotal preview */}
                {items.length > 0 && (
                  <div className="flex justify-end rounded-md bg-muted/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground mr-3">Est. per cycle</span>
                    <span className="text-sm font-bold">
                      ₹{items
                        .reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unitPrice) || 0), 0)
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button" variant="secondary"
                  onClick={() => { setDialogOpen(false); form.reset() }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating…" : "Create Schedule"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
