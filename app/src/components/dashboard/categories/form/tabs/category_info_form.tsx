"use client";

import { Control } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryInfoFormProps {
  control: Control<any>;
}

export default function CategoryInfoForm({ control }: CategoryInfoFormProps) {
  const { t } = useI18n();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("dashboard.categories.name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("dashboard.categories.name_placeholder")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("dashboard.categories.select_type")}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.categories.select_type")}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                side="bottom"
                avoidCollisions={false}
                position="popper"
              >
                <SelectItem value="income">
                  {t("dashboard.categories.type.income")}
                </SelectItem>
                <SelectItem value="expense">
                  {t("dashboard.categories.type.expense")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("dashboard.categories.description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  "dashboard.categories.description_placeholder"
                )}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}