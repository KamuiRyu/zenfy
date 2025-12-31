import React from "react";
import { FieldLabel } from "@ui/field";
import { Compact } from "@uiw/react-color";
import { FormControl, FormItem, FormMessage } from "@ui/form";
import { cn } from "@/lib/utils";

type FieldColorPickerProps = {
  label: string;
  color?: string;
  value?: string;
  onChange?: (color: { hex: string }) => void;
  colors?: string[];
  error?: string | null;
  className?: string;
};

export function FieldColorPicker({
  label,
  color,
  value,
  onChange,
  colors,
  error,
  className,
}: FieldColorPickerProps) {
  return (
    <FormItem>
      <FieldLabel className={cn(error ? "text-red-500" : "")}>
        {label}
      </FieldLabel>
      <FormControl>
        <Compact
          color={color}
          onChange={onChange}
          colors={colors}
          defaultValue={value}
          className={cn("!w-full", error ? "border-red-500" : "", className)}
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