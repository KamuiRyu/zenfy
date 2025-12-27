import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, UseFormReturn } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import { CardFormSchema } from "../card_form.schema";

type BasicInfoTabProps = {
  control: UseFormReturn<CardFormSchema>["control"];
  formState: UseFormReturn<CardFormSchema>["formState"];
  loading?: boolean;
};

export const CardInfoTab = React.memo(function CardInfoTab({
  control,
  formState,
  loading = false,
}: BasicInfoTabProps) {
  const errors = formState.errors;
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="lastFour">{t("dashboard.cards.last_four")} *</Label>
        <Controller
          name="lastFour"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="lastFour"
              value={field.value || ""}
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder={t("dashboard.cards.last_four_placeholder")}
              disabled={loading}
              maxLength={4}
              inputMode="numeric"
              className={
                errors.lastFour
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
          )}
        />
        <span className="text-xs text-red-500">{errors.lastFour?.message}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="brand">{t("dashboard.cards.brand")} *</Label>
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={loading}
              required
              name="brand"
            >
              <SelectTrigger
                className={`w-full ${
                  errors.brand
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              >
                <SelectValue placeholder={t("dashboard.cards.select_brand")} />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                avoidCollisions={false}
                position="popper"
                className="max-h-70"
              >
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="elo">Elo</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
                <SelectItem value="hipercard">Hipercard</SelectItem>
                <SelectItem value="diners">Diners Club</SelectItem>
                <SelectItem value="discover">Discover</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <span className="text-xs text-red-500">{errors.brand?.message}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="holderName">{t("dashboard.cards.holder_name")} *</Label>
        <Controller
          name="holderName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="holderName"
              value={field.value || ""}
              onChange={field.onChange}
              placeholder={t("dashboard.cards.card_holder_placeholder")}
              disabled={loading}
              className={
                errors.holderName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
          )}
        />
        <span className="text-xs text-red-500">
          {errors.holderName?.message}
        </span>
      </div>
    </div>
  );
});
