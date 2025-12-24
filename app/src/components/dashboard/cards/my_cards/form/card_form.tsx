"use client";
import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CardFormSchema } from "./card_form.schema";
import { Controller, UseFormReturn } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";

type CardFormProps = {
  control: UseFormReturn<CardFormSchema>["control"];
  handleSubmit: UseFormReturn<CardFormSchema>["handleSubmit"];
  setValue: UseFormReturn<CardFormSchema>["setValue"];
  watch: UseFormReturn<CardFormSchema>["watch"];
  formState: UseFormReturn<CardFormSchema>["formState"];
  loading?: boolean;
  onSubmit?: (values: CardFormSchema) => void;
  submitLabel?: string;
  renderPreview?: (values: Partial<CardFormSchema>) => React.ReactNode;
};

export const CardForm = React.memo(function CardForm({
  control,
  handleSubmit,
  setValue,
  watch,
  formState,
  loading = false,
  onSubmit,
  submitLabel = "Salvar",
  renderPreview,
}: CardFormProps) {
  const [openExpiry, setOpenExpiry] = useState(false);
  const [openBillingDay, setOpenBillingDay] = useState(false);
  const errors = formState.errors;
  const { t } = useI18n();

  const values = watch();

  return (
    <>
      {renderPreview && renderPreview(values)}
      <form
        onSubmit={handleSubmit((data) => onSubmit?.(data))}
        className="grid gap-4"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lastFour">{t("dashboard.cards.last_four")}</Label>
            <Controller
              name="lastFour"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="lastFour"
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
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
            {errors.lastFour && (
              <span className="text-xs text-red-500">
                {errors.lastFour.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand">{t("dashboard.cards.brand")}</Label>
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
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("dashboard.cards.select_brand")}
                    />
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
            {errors.brand && (
              <span className="text-xs text-red-500">
                {errors.brand.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="holderName">
              {t("dashboard.cards.holder_name")}
            </Label>
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
            {errors.holderName && (
              <span className="text-xs text-red-500">
                {errors.holderName.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank">{t("dashboard.cards.bank")}</Label>
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
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("dashboard.cards.select_bank")}
                    />
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
            {errors.bank && (
              <span className="text-xs text-red-500">
                {errors.bank.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label>{t("dashboard.cards.expiry_date")}</Label>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <Popover open={openExpiry} onOpenChange={setOpenExpiry}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal"
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
                      fromYear={2025}
                      toYear={new Date().getFullYear() + 20}
                      disabled={loading}
                      className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                      buttonVariant="ghost"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.expiryDate && (
              <span className="text-xs text-red-500">
                {errors.expiryDate.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cardType">{t("dashboard.cards.card_type")}</Label>
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
                  <SelectTrigger className="w-full">
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
            {errors.cardType && (
              <span className="text-xs text-red-500">
                {errors.cardType.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label>{t("dashboard.cards.billing_day")}</Label>
            <Controller
              name="billingDayDate"
              control={control}
              render={({ field }) => (
                <Popover open={openBillingDay} onOpenChange={setOpenBillingDay}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal"
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
            {errors.billingDay && (
              <span className="text-xs text-red-500">
                {errors.billingDay.message}
              </span>
            )}
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
            {errors.nickname && (
              <span className="text-xs text-red-500">
                {errors.nickname.message}
              </span>
            )}
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
        <div className="flex justify-end mt-4 gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? t("dashboard.cards.saving") : submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
});
