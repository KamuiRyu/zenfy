"use client";

import { Control } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import {
  FormField,

} from "@/components/ui/form";

import { FieldInput } from "@/components/forms/field_input";
import { FieldSelect } from "@/components/forms/field_select";
import { FieldTextarea } from "@/components/forms/field_textarea";

type CategoryFormData = {
  name: string;
  type: "income" | "expense";
  description?: string;
  color: string;
  icon?: string;
};

interface CategoryInfoFormProps {
  control: Control<CategoryFormData>;
}

export default function CategoryInfoForm({ control }: CategoryInfoFormProps) {
  const { t } = useI18n();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <FieldInput
            label={t("dashboard.categories.name")}
            type="text"
            id="email"
            placeholder={t("dashboard.categories.name_placeholder")}
            {...field}
            error={fieldState.error?.message}
            className="rounded-lg p-5"
          />
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FieldSelect
            label={t("dashboard.categories.select_type")}
            placeholder={t("dashboard.categories.select_type")}
            options={[
              {
                value: "expense",
                label: t("dashboard.categories.type.expense"),
              },
              {
                value: "income",
                label: t("dashboard.categories.type.income"),
              },
            ]}
            value={field.value}
            onValueChange={field.onChange}
            className="rounded-lg w-full"
          />
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FieldTextarea 
            label={t("dashboard.categories.description")}
            placeholder={t("dashboard.categories.description_placeholder")}
            {...field}
            className="rounded-lg p-5"
          />
        )}
      />
    </>
  );
}
