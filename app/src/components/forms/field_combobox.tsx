import React from "react";
import { FieldLabel } from "@ui/field";
import { Combobox } from "@/components/ui/combobox";
import { FormControl, FormItem, FormMessage } from "@ui/form";
import { cn } from "@/lib/utils";

type ComboboxOption = {
  value: string;
  label: React.ReactNode;
};

type FieldComboboxProps = {
  label: string;
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  className?: string;
};

export function FieldCombobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  className,
}: FieldComboboxProps) {
  return (
    <FormItem>
      <FieldLabel className={cn(error ? "text-red-500" : "")}>
        {label}
      </FieldLabel>
      <FormControl className={cn(error ? "border-red-500" : "", className)}>
        <Combobox
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </FormControl>
      <div className="min-h-[20px]">
        {error ? (
          <FormMessage className="text-red-500 text-xs">{error}</FormMessage>
        ) : null}
      </div>
    </FormItem>
  );
}
