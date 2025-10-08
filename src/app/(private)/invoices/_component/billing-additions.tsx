"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { MinusCircle, Plus } from "lucide-react"

export type BillingAddition = {
  id: string
  label: string
  amount: number
  note?: string
}

function uid(prefix = "add") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function BillingAdditions({
  value,
  onChange,
  title = "Billing Additions",
  className,
}: {
  value: BillingAddition[]
  onChange: (next: BillingAddition[]) => void
  title?: string
  className?: string
}) {
  const [local, setLocal] = useState<BillingAddition[]>(value ?? [])

  // sync up if parent changes value externally
  useMemo(() => {
    setLocal(value ?? [])
  }, [value])

  const addItem = () => {
    const next = [...local, { id: uid(), label: "", amount: 0, note: "" } as BillingAddition]
    setLocal(next)
    onChange(next)
  }

  const updateItem = (id: string, patch: Partial<BillingAddition>) => {
    const next = local.map((it) => (it.id === id ? { ...it, ...patch } : it))
    setLocal(next)
    onChange(next)
  }

  const removeItem = (id: string) => {
    const next = local.filter((it) => it.id !== id)
    setLocal(next)
    onChange(next)
  }

  const total = local.reduce((sum, it) => sum + (Number(it.amount) || 0), 0)

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <Button size="sm" onClick={addItem}>
          <Plus className="mr-1 h-4 w-4" />
          Add more
        </Button>
      </div>

      <div className="space-y-3">
        {local.length === 0 && (
          <div className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            No additions yet. Click “Add more” to add your first item.
          </div>
        )}

        {local.map((item, idx) => (
          <div key={item.id} className="rounded-md border border-border bg-background p-3">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Item {idx + 1}</div>
            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-6">
                <Label htmlFor={`label-${item.id}`} className="mb-1 block">
                  Label
                </Label>
                <Input
                  id={`label-${item.id}`}
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  placeholder="e.g., Fuel surcharge"
                />
              </div>

              <div className="md:col-span-3">
                <Label htmlFor={`amount-${item.id}`} className="mb-1 block">
                  Amount
                </Label>
                <Input
                  id={`amount-${item.id}`}
                  inputMode="decimal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={Number.isFinite(item.amount) ? item.amount : 0}
                  onChange={(e) => updateItem(item.id, { amount: Number.parseFloat(e.target.value || "0") })}
                  placeholder="0.00"
                />
              </div>

              <div className="md:col-span-3 flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full md:w-auto"
                  onClick={() => removeItem(item.id)}
                >
                  <MinusCircle className="mr-1 h-4 w-4" />
                  Remove
                </Button>
              </div>

              <div className="md:col-span-12">
                <Label htmlFor={`note-${item.id}`} className="mb-1 block">
                  Note (optional)
                </Label>
                <Input
                  id={`note-${item.id}`}
                  value={item.note || ""}
                  onChange={(e) => updateItem(item.id, { note: e.target.value })}
                  placeholder="Add a short description..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="text-sm text-muted-foreground">Additions total</div>
        <div className="text-base font-semibold text-foreground">
          {new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "INR",
            currencyDisplay: "symbol",
            maximumFractionDigits: 2,
          }).format(total || 0)}
        </div>
      </div>
    </div>
  )
}
