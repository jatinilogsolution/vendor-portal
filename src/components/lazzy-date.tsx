"use client"

import { useEffect, useState } from "react"

interface LazyDateProps {
  date: string
  format?: "short" | "medium" | "long"
}

export function LazyDate({ date, format = "short" }: LazyDateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const dateObj = new Date(date)

  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { dateStyle: "short" }
      : format === "long"
        ? { dateStyle: "full", timeStyle: "medium" }
        : { dateStyle: "medium", timeStyle: "short" }

  return (
    <span className=" text-secondary">
      {new Intl.DateTimeFormat("en-IN", options).format(dateObj)}
    </span>
  )
}
