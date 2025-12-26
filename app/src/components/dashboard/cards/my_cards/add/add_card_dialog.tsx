"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import cardService from "@/services/card_service";
import { useRouter } from "next/navigation";
import CardPreview from "../form/card_preview";
import { CardForm } from "../form/card_form";
import { useForm } from "react-hook-form";
import { CardFormSchema } from "../form/card_form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/i18n/useI18n";

export default function AddCardDialog() {
  const { t } = useI18n();

  const cardFormSchema = z.object({
    lastFour: z.string().length(4, t("validation.exact_length", { count: 4 })),
    brand: z.string().min(1, t("validation.select_option")),
    holderName: z.string().min(1, t("validation.required")),
    bank: z.string().min(1, t("validation.select_option")),
    expiryDate: z.date({ message: t("validation.select_date") }),
    cardType: z.string().min(1, t("validation.select_option")),
    billingDay: z.string().min(1, t("validation.select_option")),
    billingDayDate: z.date().optional(),
    nickname: z.string().optional(),
    isDefault: z.boolean().optional(),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<CardFormSchema>({
    resolver: zodResolver(cardFormSchema),
    mode: "onTouched",
    defaultValues: {
      lastFour: "",
      brand: "",
      holderName: "",
      bank: "",
      expiryDate: undefined,
      cardType: "",
      billingDay: "",
      billingDayDate: undefined,
      nickname: "",
      isDefault: false,
    },
  });

  async function handleSubmit(data: CardFormSchema) {
    setLoading(true);
    try {
      await cardService.createCard({
        last_four: data.lastFour,
        brand: data.brand,
        holder_name: data.holderName,
        bank: data.bank,
        expiry_month: data.expiryDate
          ? data.expiryDate.getMonth() + 1
          : undefined,
        expiry_year: data.expiryDate
          ? data.expiryDate.getFullYear()
          : undefined,
        card_type: data.cardType,
        billing_day: Number(data.billingDay),
        nickname: data.nickname,
        is_default: data.isDefault,
      });
      window.dispatchEvent(new Event('refetchCards'));
      router.back();
    } catch  {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent
        className="w-full max-w-1xl sm:max-w-2xl md:max-w-3xl lg:max-w-1xl p-8"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{t("dashboard.cards.new_card")}</DialogTitle>
        </DialogHeader>
        <CardForm
          control={form.control}
          handleSubmit={form.handleSubmit}
          setValue={form.setValue}
          watch={form.watch}
          formState={form.formState}
          loading={loading}
          onSubmit={handleSubmit}
          submitLabel={t("dashboard.cards.add")}
          renderPreview={(values) => (
            <CardPreview
              lastFour={values.lastFour || ""}
              brand={values.brand || ""}
              bank={values.bank || ""}
              holderName={values.holderName || ""}
              nickname={values.nickname || ""}
              expiryDate={values.expiryDate}
            />
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
