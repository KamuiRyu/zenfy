import React from "react";
import { FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { FormControl, FormItem, FormMessage } from "@ui/form";
import { cn } from "@/lib/utils";

type FieldInputProps = React.ComponentProps<typeof Input> & {
  label: string;
  description?: string;
  error?: string | null;
};

export function FieldInput({
  label,
  error,
  className,
  ...props
}: FieldInputProps) {
  return (
    <FormItem>
      <FieldLabel
        htmlFor={props.id}
        className={cn(error ? "text-red-500" : "")}
      >
        {label}
      </FieldLabel>
      <FormControl>
        <Input
          className={"!h-12 " + cn(error ? "border-red-500" : "", className)}
          {...props}
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
