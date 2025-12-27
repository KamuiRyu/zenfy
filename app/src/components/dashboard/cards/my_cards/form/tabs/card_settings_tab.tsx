import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, UseFormReturn } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import { CardFormSchema } from "../card_form.schema";

type SettingsTabProps = {
  control: UseFormReturn<CardFormSchema>["control"];
  setValue: UseFormReturn<CardFormSchema>["setValue"];
  formState: UseFormReturn<CardFormSchema>["formState"];
  loading?: boolean;
  openExpiry: boolean;
  setOpenExpiry: (open: boolean) => void;
  openBillingDay: boolean;
  setOpenBillingDay: (open: boolean) => void;
};

export const CardSettingsTab = React.memo(function CardSettingsTab({
  control,
  setValue,
  formState,
  loading = false,
  openExpiry,
  setOpenExpiry,
  openBillingDay,
  setOpenBillingDay,
}: SettingsTabProps) {
  const errors = formState.errors;
  const { t } = useI18n();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>{t("dashboard.cards.expiry_date")} *</Label>
          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <Popover open={openExpiry} onOpenChange={setOpenExpiry}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between font-normal ${
                      errors.expiryDate
                        ? "!border-red-500 !focus-visible:ring-red-500"
                        : ""
                    }`}
                    type="button"
                    disabled={loading}
                  >
                    {field.value
                      ? format(field.value, "MM/yyyy")
                      : t("dashboard.cards.select_expiry_date")}
                    <CalendarIcon className="size-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                  side="top"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      field.onChange(date);
                      setOpenExpiry(false);
                    }}
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 20}
                    disabled={loading}
                    className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                    buttonVariant="ghost"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <span className="text-xs text-red-500">
            {errors.expiryDate?.message}
          </span>
        </div>
        <div className="grid gap-2">
          <Label>{t("dashboard.cards.billing_day")} *</Label>
          <Controller
            name="billingDayDate"
            control={control}
            render={({ field }) => (
              <Popover open={openBillingDay} onOpenChange={setOpenBillingDay}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between font-normal ${
                      errors.billingDay
                        ? "!border-red-500 !focus-visible:ring-red-500"
                        : ""
                    }`}
                    type="button"
                    disabled={loading}
                  >
                    {field.value
                      ? field.value.getDate()
                      : t("dashboard.cards.select_billing_day")}
                    <CalendarIcon className="size-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                  side="top"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setValue(
                        "billingDay",
                        date ? String(date.getDate()) : ""
                      );
                      setOpenBillingDay(false);
                    }}
                    disabled={loading}
                    className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                    buttonVariant="ghost"
                    month={new Date()}
                    hideNavigation
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <span className="text-xs text-red-500">
            {errors.billingDay?.message}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <div className="flex items-start gap-3">
              <Checkbox
                id="isDefault"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={loading}
              />
              <div className="grid gap-2">
                <Label htmlFor="isDefault">
                  {t("dashboard.cards.is_default")}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.cards.is_default_description")}
                </p>
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
});
