"use client";

import { Control } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { TransactionFormData } from "./transaction_form.schema";

interface TransactionInfoTabProps {
  control: Control<TransactionFormData>;
  categories: any[];
  categoriesLoading: boolean;
  filteredCategories: any[];
}

export default function TransactionInfoTab({
  control,
  categoriesLoading,
  filteredCategories,
}: TransactionInfoTabProps) {
  const { t } = useI18n();

  return (
    <>
      <Card className="border-0 shadow-lg bg-transparent">
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t("dashboard.transactions.type")} *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="!h-12 w-full">
                        <SelectValue
                          placeholder={t("dashboard.transactions.select_type")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      avoidCollisions={false}
                      position="popper"
                      className="max-h-70"
                    >
                      <SelectItem value="income">
                        {t("dashboard.transaction_history.income")}
                      </SelectItem>
                      <SelectItem value="expense">
                        {t("dashboard.transaction_history.expense")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="category_uuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    {t("dashboard.transaction_history.category")} *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={categoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="!h-12 w-full">
                        <SelectValue
                          placeholder={
                            categoriesLoading
                              ? t("action.loading")
                              : t("dashboard.transactions.select_category")
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      avoidCollisions={false}
                      position="popper"
                      className="max-h-70"
                    >
                      {filteredCategories.map((category) => (
                        <SelectItem
                          key={category.uuid}
                          value={category.uuid.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-transparent">
        <CardContent className="pt-0">
          <FormField
            control={control}
            name="merchant"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  {t("dashboard.transactions.merchant")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      "dashboard.transactions.merchant_placeholder"
                    )}
                    className="min-h-[60px] resize-none !h-auto w-full"
                    {...field}
                  />
                </FormControl>
                <div className="min-h-[20px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  {t("dashboard.transactions.description")} *
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t(
                      "dashboard.transactions.description_placeholder"
                    )}
                    className="min-h-[100px] resize-none !h-auto w-full"
                    {...field}
                  />
                </FormControl>
                <div className="min-h-[20px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
