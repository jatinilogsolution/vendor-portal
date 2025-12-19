"use client"

import { useEffect, useState } from "react"

interface LazyDateProps {
  date: string | Date
  format?: "short" | "medium" | "long"
}

export function LazyDate({ date, format = "medium" }: LazyDateProps) {
  const [formatted, setFormatted] = useState<string>(date.toString())

  useEffect(() => {
    try {
      const dateObj = new Date(date)

      if (isNaN(dateObj.getTime())) {
        setFormatted(date.toString())
        return
      }

      const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
        short: { month: "short", day: "numeric", year: "numeric" },
        medium: { month: "short", day: "numeric", year: "numeric" },
        long: { month: "long", day: "numeric", year: "numeric" },
      }
      const options = optionsMap[format]

      setFormatted(
        new Intl.DateTimeFormat("en-US", options).format(dateObj)
      )
    } catch {
      setFormatted(date.toString())
    }
  }, [date, format])

  return <span>{formatted}</span>
}
