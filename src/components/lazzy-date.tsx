"use client"

interface LazyDateProps {
  date: string
  format?: "short" | "long" | "medium"
}

export function LazyDate({ date, format = "medium" }: LazyDateProps) {
  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString)

      if (isNaN(dateObj.getTime())) {
        return dateString
      }

      const options: Intl.DateTimeFormatOptions | any= {
        short: { month: "short", day: "numeric", year: "numeric" },
        medium: { month: "short", day: "numeric", year: "numeric" },
        long: { month: "long", day: "numeric", year: "numeric" },
      }[format]

      return new Intl.DateTimeFormat("en-US", options).format(dateObj)
    } catch (error) {
        console.log("Error Lazzy: ", error)
      return dateString
    }
  }

  return <span suppressHydrationWarning>{formatDate(date)}</span>
}
