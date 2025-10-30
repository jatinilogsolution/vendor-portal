"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface DateRangeValue {
  from?: Date
  to?: Date
}

interface DateRangePickerProps {
  value?: DateRangeValue
  onChange?: (range: DateRangeValue) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className,
}: DateRangePickerProps) {
  // 🧩 Convert incoming prop to react-day-picker compatible DateRange
  const [date, setDate] = React.useState<DateRange | undefined>(
    value?.from ? (value as DateRange) : undefined
  )

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    onChange?.(range || {})
  }

  const label =
    date?.from && date?.to
      ? `${format(date.from, "dd MMM yyyy")} - ${format(date.to, "dd MMM yyyy")}`
      : date?.from
      ? format(date.from, "dd MMM yyyy")
      : placeholder

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              " justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            // ✅ Explicit cast here prevents type errors
            onSelect={(range) => handleSelect(range as DateRange | undefined)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
