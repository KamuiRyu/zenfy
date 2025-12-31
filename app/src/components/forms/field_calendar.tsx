import React from "react";
import { FieldLabel } from "@ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl, FormItem, FormMessage } from "@ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type FieldCalendarProps = {
  label: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string | null;
  disabled?: (date: Date) => boolean;
  fromYear?: number;
  toYear?: number;
  fromMonth?: number | Date;
  toMonth?: number | Date;
  captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years";
};

export function FieldCalendar({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  fromYear,
  toYear,
  fromMonth,
  toMonth,
  captionLayout = "dropdown",
}: FieldCalendarProps) {
  return (
    <FormItem className="flex flex-col">
      <FieldLabel
        className={cn("text-sm font-medium", error ? "text-red-500" : "")}
      >
        {label}
      </FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal !h-12",
                !value && "text-muted-foreground",
                error ? "border-red-500" : ""
              )}
            >
              {value ? format(value, "PPP") : <span>{placeholder}</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start" side="top">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={disabled || ((date) => date < new Date("1900-01-01"))}
            buttonVariant="ghost"
            fromYear={fromYear}
            toYear={toYear}
            fromMonth={fromMonth instanceof Date ? fromMonth : fromMonth ? new Date(fromYear || 1900, fromMonth) : undefined}
            toMonth={toMonth instanceof Date ? toMonth : toMonth ? new Date(toYear || 2100, toMonth) : undefined}
            captionLayout={captionLayout}
          />
        </PopoverContent>
      </Popover>
      <div className="min-h-[20px]">
        {error ? (
          <FormMessage className="text-red-500 text-xs">{error}</FormMessage>
        ) : (
          <FormMessage />
        )}
      </div>
    </FormItem>
  );
}
