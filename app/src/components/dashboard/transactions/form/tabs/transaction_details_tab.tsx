"use client";

import { Control, UseFormWatch, useFormContext } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionFormData } from "../transaction_form.schema";
import { useEffect } from "react";
import { FieldInput } from "@/components/forms/field_input";
import { FieldCalendar } from "@/components/forms/field_calendar";
import { FieldSelect } from "@/components/forms/field_select";
import { FieldSwitch } from "@/components/forms/field_switch";

interface TransactionDetailsTabProps {
  control: Control<TransactionFormData>;
  watch: UseFormWatch<TransactionFormData>;
  selectedCardUuid: string;
  kindOptions: string[];
}

export default function TransactionDetailsTab({
  control,
  watch,
  selectedCardUuid,
  kindOptions,
}: TransactionDetailsTabProps) {
  const { t } = useI18n();
  const { setValue } = useFormContext();

  const kind = watch("kind");

  useEffect(() => {
    if (kind !== "credit") {
      setValue("isInstallment", false);
    }
  }, [kind, setValue]);

  return (
    <Card className="border-0 shadow-lg bg-transparent">
      <CardContent className="pt-0">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="amount"
              render={({ field, fieldState }) => (
                <FieldInput
                  {...field}
                  label={`${t("dashboard.transactions.amount")} *`}
                  type="number"
                  step="0.01"
                  placeholder={t("dashboard.transactions.amount_placeholder")}
                  value={field.value?.toString() || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    field.onChange(isNaN(val) ? 0 : val);
                  }}
                  className="w-full"
                  error={fieldState.error?.message || null}
                  name={field.name}
                />
              )}
            />

            <FormField
              control={control}
              name="date"
              render={({ field, fieldState }) => (
                <FieldCalendar
                  label={`${t("dashboard.transactions.date")} *`}
                  placeholder={t("dashboard.transactions.select_date")}
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date)}
                  error={fieldState.error?.message || null}
                  disabled={(date) => date < new Date("1900-01-01")}
                />
              )}
            />
          </div>

          <FormField
            control={control}
            name="kind"
            render={({ field, fieldState }) => (
              <FieldSelect
                label={`${t("dashboard.transactions.kind")} *`}
                placeholder={t("dashboard.transactions.select_kind")}
                options={kindOptions.map((kindOption) => ({
                  value: kindOption,
                  label: t(`dashboard.transactions.kind_options.${kindOption}`),
                }))}
                error={fieldState.error?.message || null}
                value={field.value}
                onValueChange={field.onChange}
                className="rounded-lg w-full"
                name={field.name}
              />
            )}
          />

          <FormField
            control={control}
            name="isInstallment"
            render={({ field, fieldState }) => (
              <FieldSwitch
                label={t("dashboard.transactions.is_installment")}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={watch("kind") !== "credit" || watch("isRecurring")}
                error={fieldState.error?.message || null}
                name={field.name}
              />
            )}
          />

          {watch("isInstallment") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="installmentNumber"
                render={({ field, fieldState }) => (
                  <FieldInput
                    label={`${t(
                      "dashboard.transactions.installment_number"
                    )} *`}
                    type="number"
                    className="pl-10 w-full"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      field.onChange(isNaN(val) ? 1 : val);
                    }}
                    name={field.name}
                    error={fieldState.error?.message || null}
                  />
                )}
              />
              <FormField
                control={control}
                name="totalInstallments"
                render={({ field, fieldState }) => (
                  <FieldInput
                    label={`${t(
                      "dashboard.transactions.total_installments"
                    )} *`}
                    type="number"
                    className="pl-10 w-full"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      field.onChange(isNaN(val) ? 1 : val);
                    }}
                    name={field.name}
                    error={fieldState.error?.message || null}
                  />
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
