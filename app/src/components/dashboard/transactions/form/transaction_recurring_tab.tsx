"use client";

import { Control, UseFormWatch } from "react-hook-form";
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
  Form,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TransactionFormData } from "./transaction_form.schema";

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
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={watch("isInstallment")}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t("dashboard.transactions.is_recurring")}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {watch("isRecurring") && (
          <div className="space-y-6 mt-6">
            <FormField
              control={control}
              name="recurrenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">{t("dashboard.transactions.recurrence_type")} *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="!h-12 w-full">
                        <SelectValue placeholder={t("dashboard.transactions.select_recurrence_type")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent avoidCollisions={false} position="popper" className="max-h-70">
                      <SelectItem value="daily">{t("dashboard.transactions.daily")}</SelectItem>
                      <SelectItem value="weekly">{t("dashboard.transactions.weekly")}</SelectItem>
                      <SelectItem value="monthly">{t("dashboard.transactions.monthly")}</SelectItem>
                      <SelectItem value="yearly">{t("dashboard.transactions.yearly")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[20px]"><FormMessage /></div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="recurrenceStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">{t("dashboard.transactions.recurrence_start_date")} *</FormLabel>
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
                              <span>{t("dashboard.transactions.select_recurrence_start_date")}</span>
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
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 20}
                          fromMonth={new Date()}
                          captionLayout="dropdown"
                          buttonVariant="ghost"
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="min-h-[20px]"><FormMessage /></div>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="recurrenceEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">{t("dashboard.transactions.recurrence_end_date")}</FormLabel>
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
                              <span>{t("dashboard.transactions.select_recurrence_end_date")}</span>
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
                            date < new Date()
                          }
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 20}
                          fromMonth={new Date()}
                          captionLayout="dropdown"
                          buttonVariant="ghost"
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="min-h-[20px]"><FormMessage /></div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}