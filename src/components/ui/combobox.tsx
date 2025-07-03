"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  className,
  triggerClassName,
  disabled = false
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-all duration-300 ease-out outline-none",
              "hover:border-ring/40 hover:bg-accent/10",
              "focus-visible:border-ring focus-visible:ring-[0.2rem] focus-visible:ring-ring/20 focus-visible:ring-offset-0 focus-visible:shadow-lg focus-visible:shadow-ring/10",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "justify-between font-normal",
              triggerClassName
            )}
          >
            <span className="flex items-center gap-2 truncate">
              {selectedOption?.icon && (
                <span className="shrink-0">
                  {selectedOption.icon}
                </span>
              )}
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border-input shadow-md" 
          align="start"
          sideOffset={4}
        >
          <Command>
            <CommandInput 
              placeholder={searchPlaceholder} 
              className="h-8 text-sm border-none focus:ring-0" 
            />
            <CommandList className="max-h-[200px]">
              <CommandEmpty className="py-4 text-center text-sm text-foreground/60">
                {emptyMessage}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      const newValue = currentValue === value ? "" : currentValue
                      onValueChange?.(newValue)
                      setOpen(false)
                    }}
                    className="cursor-pointer text-sm py-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {option.icon && (
                        <span className="shrink-0">
                          {option.icon}
                        </span>
                      )}
                      <span className="truncate">
                        {option.label}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 