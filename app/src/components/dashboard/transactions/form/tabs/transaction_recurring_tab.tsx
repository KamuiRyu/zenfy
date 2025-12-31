"use client";

import { Control, UseFormWatch } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TransactionFormData } from "../transaction_form.schema";
import { FieldSwitch } from "@/components/forms/field_switch";
import { FieldSelect } from "@/components/forms/field_select";
import { FieldCalendar } from "@/components/forms/field_calendar";

interface TransactionRecurringTabProps {
  control: Control<TransactionFormData>;
  watch: UseFormWatch<TransactionFormData>;
}

export default function TransactionRecurringTab({
  control,
  watch,
}: TransactionRecurringTabProps) {
  const { t } = useI18n();

  return (
    <Card className="border-0 shadow-lg bg-transparent">
      <CardContent className="pt-0">
        <FormField
          control={control}
          name="isRecurring"
          render={({ field, fieldState }) => (
            <FieldSwitch
              label={t("dashboard.transactions.is_recurring")}
              checked={field.value}
              onCheckedChange={field.onChange}
              name={field.name}
              error={fieldState.error?.message || null}
            />
          )}
        />

        {watch("isRecurring") && (
          <div className="space-y-6 mt-6">
            <FormField
              control={control}
              name="recurrenceType"
              render={({ field, fieldState }) => (
                <FieldSelect
                  label={`${t("dashboard.transactions.recurrence_type")} *`}
                  placeholder={t(
                    "dashboard.transactions.select_recurrence_type"
                  )}
                  options={[
                    {
                      value: "daily",
                      label: t("dashboard.transactions.recurrence_types.daily"),
                    },
                    {
                      value: "weekly",
                      label: t("dashboard.transactions.recurrence_types.weekly"),
                    },
                    {
                      value: "monthly",
                      label: t(
                        "dashboard.transactions.recurrence_types.monthly"
                      ),
                    },
                    {
                      value: "yearly",
                      label: t("dashboard.transactions.recurrence_types.yearly"),
                    },
                  ]}
                  onValueChange={field.onChange}
                  value={field.value}
                  className="rounded-lg w-full"
                  name={field.name}
                  error={fieldState.error?.message || null}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="recurrenceStartDate"
                render={({ field, fieldState }) => (
                  <FieldCalendar
                    label={`${t(
                      "dashboard.transactions.recurrence_start_date"
                    )} *`}
                    placeholder={t(
                      "dashboard.transactions.select_recurrence_start_date"
                    )}
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date)}
                    error={fieldState.error?.message || null}
                    disabled={(date) => date < new Date("1900-01-01")}
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 20}
                    fromMonth={new Date()}
                  />
                )}
              />

              <FormField
                control={control}
                name="recurrenceEndDate"
                render={({ field, fieldState }) => (
                  <FieldCalendar
                    label={t("dashboard.transactions.recurrence_end_date")}
                    placeholder={t(
                      "dashboard.transactions.select_recurrence_end_date"
                    )}
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date)}
                    disabled={(date) => date < new Date("1900-01-01")}
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 20}
                    fromMonth={new Date()}
                    error={fieldState.error?.message || null}
                  />
                )}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
