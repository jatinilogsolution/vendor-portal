'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Props {
  onSearch: (value: string) => void
}

export default function UserFilters({ onSearch }: Props) {
  const [value, setValue] = useState("")

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Input
        placeholder="Search by name, vendor, or email..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onSearch(e.target.value)
        }}
        className="max-w-sm"
      />
    </div>
  )
}
