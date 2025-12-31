"use client";

import { Control } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import {
  FormField,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionFormData } from "../transaction_form.schema";
import { CategoryType } from "@/types/transactions";
import { FieldSelect } from "@/components/forms/field_select";
import { FieldInput } from "@/components/forms/field_input";
import { FieldTextarea } from "@/components/forms/field_textarea";

interface TransactionInfoTabProps {
  control: Control<TransactionFormData>;
  categories: CategoryType[];
  categoriesLoading: boolean;
  filteredCategories: CategoryType[];
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
              render={({ field, fieldState }) => (
                <FieldSelect
                  label={`${t("dashboard.transactions.type")} *`}
                  placeholder={t("dashboard.transactions.select_type")}
                  options={[
                    {
                      value: "expense",
                      label: t("dashboard.transactions.types.expense"),
                    },
                    {
                      value: "income",
                      label: t("dashboard.transactions.types.income"),
                    },
                  ]}
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={categoriesLoading}
                  className="rounded-lg w-full"
                  name={field.name}
                  error={fieldState.error?.message || null}
                />
              )}
            />

            <FormField
              control={control}
              name="category_uuid"
              render={({ field, fieldState }) => (
                <FieldSelect
                  label={t("dashboard.transactions.category")}
                  placeholder={t("dashboard.transactions.select_category")}
                  options={filteredCategories.map((category) => ({
                    value: category.uuid,
                    label: category.name,
                  }))}
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={categoriesLoading}
                  className="rounded-lg w-full"
                  name={field.name}
                  error={fieldState.error?.message || null}
                />
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
            render={({ field, fieldState }) => (
              <FieldInput
                label={t("dashboard.transactions.merchant")}
                type="text"
                placeholder={t("dashboard.transactions.merchant_placeholder")}
                {...field}
                className="rounded-lg p-5 mb-5"
                name={field.name}
                error={fieldState.error?.message || null}
              />
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <FieldTextarea
                label={t("dashboard.transactions.description")}
                placeholder={t(
                  "dashboard.transactions.description_placeholder"
                )}
                {...field}
                className="rounded-lg p-5"
                name={field.name}
                error={fieldState.error?.message || null}
              
              />
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
