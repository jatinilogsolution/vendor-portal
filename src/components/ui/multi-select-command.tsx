"use client"

import { useMemo, useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type MultiSelectOption = {
  id: string
  label: string
}

interface MultiSelectCommandProps {
  disabled?: boolean
  emptyMessage?: string
  onChange: (values: string[]) => void
  options: MultiSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  value: string[]
}

export function MultiSelectCommand({
  disabled = false,
  emptyMessage = "No options found.",
  onChange,
  options,
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  value,
}: MultiSelectCommandProps) {
  const [open, setOpen] = useState(false)

  const selectedOptions = useMemo(
    () => options.filter((option) => value.includes(option.id)),
    [options, value],
  )

  const toggleValue = (optionId: string) => {
    onChange(
      value.includes(optionId)
        ? value.filter((id) => id !== optionId)
        : [...value, optionId],
    )
  }

  const removeValue = (optionId: string) => {
    onChange(value.filter((id) => id !== optionId))
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="h-auto min-h-10 w-full justify-between px-3 py-2"
          >
            <span className="truncate text-sm text-muted-foreground">
              {selectedOptions.length > 0
                ? `${selectedOptions.length} selected`
                : placeholder}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.id)
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.label}
                      onSelect={() => toggleValue(option.id)}
                      className="gap-3"
                    >
                      <span
                        className={cn(
                          "flex size-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30",
                        )}
                      >
                        {isSelected ? <Check className="size-3" /> : null}
                      </span>
                      <span className="flex-1 truncate">{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.id}
              variant="secondary"
              className="gap-1 rounded-full px-3 py-1 text-xs font-medium"
            >
              <span className="max-w-48 truncate">{option.label}</span>
              <button
                type="button"
                aria-label={`Remove ${option.label}`}
                className="rounded-full p-0.5 transition hover:bg-black/10"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  removeValue(option.id)
                }}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
