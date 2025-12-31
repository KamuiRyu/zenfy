import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { List } from 'react-window';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./input";

interface ComboboxProps {
  options: { value: string; label: React.ReactNode }[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Combobox({ options, value, onChange, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredOptions = React.useMemo(() => 
    options.filter(option => 
      option.value.toLowerCase().includes(search.toLowerCase())
    ), [options, search]
  )

  const loading = search.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 ">
        <div className="p-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm pr-8"
            />
            {loading && (
              <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
        <List
          rowCount={filteredOptions.length}
          rowHeight={45}
          className="border-t scrollbar h-60 overflow-auto"
          rowComponent={RowComponent}
          rowProps={{ filteredOptions, value, onChange, setOpen, setSearch }}
        />
      </PopoverContent>
    </Popover>
  )
}

function RowComponent({ index, style, filteredOptions, value, onChange, setOpen, setSearch }: any) {
  const option = filteredOptions[index];
  return (
    <div
      style={style}
      onClick={() => {
        onChange(option.value === value ? "" : option.value);
        setOpen(false);
        setSearch("");
      }}
      className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent"
    >
      {option.label}
      <Check
        className={cn(
          "ml-auto h-4 w-4",
          value === option.value ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}