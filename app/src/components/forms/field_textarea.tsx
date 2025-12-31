import React from "react";
import { FieldLabel } from "@ui/field";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormItem, FormMessage } from "@ui/form";
import { cn } from "@/lib/utils";

type FieldTextareaProps = React.ComponentProps<typeof Textarea> & {
  label: string;
  error?: string | null;
};

export function FieldTextarea({
  label,
  error,
  className,
  ...props
}: FieldTextareaProps) {
  return (
    <FormItem>
      <FieldLabel className={cn(error ? "text-red-500" : "")}>
        {label}
      </FieldLabel>
      <FormControl>
        <Textarea
          className={cn(error ? "border-red-500" : "", className)}
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
