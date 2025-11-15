"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="relative">
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(v) => v && setTheme(v)}
        className="inline-flex h-10 w-full ring ring-primary items-center justify-center rounded-lg border bg-background p-1 shadow-sm"
      >
        <ThemeButton value="light" icon={<Sun className="h-4 w-4 text-yellow-500" />} />
        <ThemeButton value="dark" icon={<Moon className="h-4 w-4" />} />
        <ThemeButton value="system" icon={<Monitor className="h-4 w-4 text-blue-500" />} />
      </ToggleGroup>
    </div>
  )
}

function ThemeButton({ value, icon }: { value: string; icon: React.ReactNode }) {
  return (
    <ToggleGroupItem
      value={value}
      aria-label={`${value} mode`}
      className="
        relative h-8 w-8 rounded-md
        data-[state=off]:text-muted-foreground
        data-[state=on]:bg-accent data-[state=on]:text-accent-foreground
        hover:bg-muted hover:text-foreground
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      "
    >
      {icon}
    </ToggleGroupItem>
  )
}