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

type DetailsTabProps = {
  control: UseFormReturn<CardFormSchema>["control"];
  formState: UseFormReturn<CardFormSchema>["formState"];
  loading?: boolean;
};

export const CardDetailsTab = React.memo(function CardDetailsTab({
  control,
  formState,
  loading = false,
}: DetailsTabProps) {
  const errors = formState.errors;
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="bank">{t("dashboard.cards.bank")} *</Label>
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={loading}
              required
              name="bank"
            >
              <SelectTrigger
                className={`w-full ${
                  errors.bank ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              >
                <SelectValue placeholder={t("dashboard.cards.select_bank")} />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                avoidCollisions={false}
                position="popper"
                className="max-h-70"
              >
                <SelectItem value="nubank">Nubank</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="itau">Itaú</SelectItem>
                <SelectItem value="bradesco">Bradesco</SelectItem>
                <SelectItem value="santander">Santander</SelectItem>
                <SelectItem value="caixa">Caixa</SelectItem>
                <SelectItem value="bb">Banco do Brasil</SelectItem>
                <SelectItem value="c6">C6 Bank</SelectItem>
                <SelectItem value="sicredi">Sicredi</SelectItem>
                <SelectItem value="picpay">PicPay</SelectItem>
                <SelectItem value="next">Next</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
                <SelectItem value="original">Original</SelectItem>
                <SelectItem value="safra">Safra</SelectItem>
                <SelectItem value="btg">BTG Pactual</SelectItem>
                <SelectItem value="will">Will Bank</SelectItem>
                <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                <SelectItem value="pagbank">PagBank</SelectItem>
                <SelectItem value="banrisul">Banrisul</SelectItem>
                <SelectItem value="votorantim">Votorantim</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <span className="text-xs text-red-500">{errors.bank?.message}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cardType">{t("dashboard.cards.card_type")} *</Label>
        <Controller
          name="cardType"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={loading}
              required
              name="cardType"
            >
              <SelectTrigger
                className={`w-full ${
                  errors.cardType
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              >
                <SelectValue
                  placeholder={t("dashboard.cards.select_card_type")}
                />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                avoidCollisions={false}
                position="popper"
                className="max-h-70"
              >
                <SelectItem value="credit/debit">
                  {t("dashboard.cards.credit_debit")}
                </SelectItem>
                <SelectItem value="credit">
                  {t("dashboard.cards.credit")}
                </SelectItem>
                <SelectItem value="debit">
                  {t("dashboard.cards.debit")}
                </SelectItem>
                <SelectItem value="outro">
                  {t("dashboard.cards.other")}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <span className="text-xs text-red-500">{errors.cardType?.message}</span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nickname">{t("dashboard.cards.nickname")}</Label>
        <Controller
          name="nickname"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="nickname"
              value={field.value || ""}
              onChange={field.onChange}
              placeholder={t("dashboard.cards.nickname_placeholder")}
              disabled={loading}
              className={
                errors.nickname
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
          )}
        />
        <span className="text-xs text-red-500">{errors.nickname?.message}</span>
      </div>
    </div>
  );
});
