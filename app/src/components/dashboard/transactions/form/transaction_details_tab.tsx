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
import { TransactionFormData } from "./transaction_form.schema";
import { useEffect } from "react";

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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">{t("dashboard.transactions.amount")} *</FormLabel>
                  <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("dashboard.transactions.amount_placeholder")}
                        className="!h-12 w-full"
                        value={field.value?.toString() || ""}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                        name={field.name}
                      />
                  </FormControl>
                  <div className="min-h-[20px]"><FormMessage /></div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium">{t("dashboard.transactions.date")} *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal !h-12 ",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("dashboard.transactions.select_date")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-full" align="start" side="top">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        buttonVariant="ghost"
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="min-h-[20px]"><FormMessage /></div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="kind"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">{t("dashboard.transactions.kind")} *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedCardUuid}>
                  <FormControl>
                    <SelectTrigger className="!h-12 w-full">
                      <SelectValue placeholder={t("dashboard.transactions.select_kind")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent avoidCollisions={false} position="popper" className="max-h-70">
                    {kindOptions.map((kind) => (
                      <SelectItem key={kind} value={kind}>
                        {t(`dashboard.transactions.${kind}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="min-h-[20px]"><FormMessage /></div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isInstallment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={watch("kind") !== "credit" || watch("isRecurring")}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t("dashboard.transactions.is_installment")}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {watch("isInstallment") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="installmentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t("dashboard.transactions.installment_number")} *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="pl-10 !h-12 w-full"
                        value={field.value?.toString() || ""}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          field.onChange(isNaN(val) ? 1 : val);
                        }}
                        name={field.name}
                      />
                    </FormControl>
                    <div className="min-h-[20px]"><FormMessage /></div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="totalInstallments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t("dashboard.transactions.total_installments")} *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="pl-10 !h-12 w-full"
                        value={field.value?.toString() || ""}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          field.onChange(isNaN(val) ? 1 : val);
                        }}
                        name={field.name}
                      />
                    </FormControl>
                    <div className="min-h-[20px]"><FormMessage /></div>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}