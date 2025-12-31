import { FieldLabel } from "@ui/field";
import { FormControl, FormItem, FormMessage } from "@ui/form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
};

type FieldSelectProps = {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  name?: string;
};

export function FieldSelect({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  error,
  disabled,
  className,
  name,
}: FieldSelectProps) {
  return (
    <FormItem>
      <FieldLabel className={cn(error ? "text-red-500" : "")}>
        {label}
      </FieldLabel>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <FormControl>
          <SelectTrigger
            className={"!h-12 " + cn(error ? "border-red-500" : "", className)}
            name={name}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent side="bottom" avoidCollisions={false} position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="min-h-[20px]">
        {error ? (
          <FormMessage className="text-red-500 text-xs">{error}</FormMessage>
        ) : null}
      </div>
    </FormItem>
  );
}
