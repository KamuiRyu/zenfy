import React from "react";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormItem, FormLabel, FormMessage } from "@ui/form";
import { cn } from "@/lib/utils";

type FieldSwitchProps = {
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: string | null;
  className?: string;
  name?: string;
};

export function FieldSwitch({
  label,
  checked,
  onCheckedChange,
  disabled,
  error,
  className,
  name,
}: FieldSwitchProps) {
  return (
    <FormItem
      className={cn("flex flex-row items-start space-x-3 space-y-0", className)}
    >
      <FormControl>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          name={name}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel className={cn(error ? "text-red-500" : "")}>
          {label}
        </FormLabel>
      </div>
      <div className="min-h-[20px]">
        {error && (
          <FormMessage className="text-red-500 text-xs">{error}</FormMessage>
        )}
      </div>
    </FormItem>
  );
}
