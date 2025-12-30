"use client";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import cardService from "@/services/card_service";
import { CardTypes } from "@/types/cards";
import { useRouter } from "next/navigation";
import CardPreview from "../form/card_preview";
import { CardForm } from "../form/card_form";
import { useForm } from "react-hook-form";
import { CardFormSchema } from "../form/card_form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/i18n/useI18n";

interface Card {
  uuid: string;
  last_four: string;
  brand: string;
  bank: string;
  card_type: string;
  holder_name: string;
  nickname?: string;
  expiry_month: number;
  expiry_year: number;
  billing_day: number;
  is_default: boolean;
}

export default function EditCardDialog({
  cardId,
}: {
  cardId: string | number;
}) {
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
  const [card, setCard] = useState<Card | null>(null);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadCard() {
      if (!cardId) return;
      setFetching(true);
      try {
        const fetchedCard = await cardService.getCard(cardId);
        if (!fetchedCard) {
          router.back();
          return;
        }
        setCard(fetchedCard);
      } catch {
        router.back();
      } finally {
        setFetching(false);
      }
    }
    loadCard();
  }, [cardId, router]);

  const form = useForm<CardFormSchema>({
    resolver: zodResolver(cardFormSchema),
    mode: "onTouched",
    defaultValues: card
      ? {
          lastFour: card.last_four,
          brand: card.brand,
          holderName: card.holder_name,
          bank: card.bank,
          expiryDate:
            card.expiry_month && card.expiry_year
              ? new Date(card.expiry_year, card.expiry_month - 1)
              : undefined,
          cardType: card.card_type,
          billingDay: String(card.billing_day),
          billingDayDate: card.billing_day
            ? new Date(2025, 0, card.billing_day)
            : undefined,
          nickname: card.nickname,
          isDefault: card.is_default,
        }
      : {},
  });

  useEffect(() => {
    if (card) {
      form.reset({
        lastFour: card.last_four,
        brand: card.brand,
        holderName: card.holder_name,
        bank: card.bank,
        expiryDate:
          card.expiry_month && card.expiry_year
            ? new Date(card.expiry_year, card.expiry_month - 1)
            : undefined,
        cardType: card.card_type,
        billingDay: String(card.billing_day),
        billingDayDate: card.billing_day
          ? new Date(2025, 0, card.billing_day)
          : undefined,
        nickname: card.nickname,
        isDefault: card.is_default,
      });
    }
  }, [card, form]);

  async function handleSubmit(data: CardFormSchema) {
    if (!card) {
      return;
    }

    setLoading(true);
    try {
      await cardService.updateCard(cardId, {
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
        card_type: data.cardType as CardTypes,
        billing_day: Number(data.billingDay),
        is_default: data.isDefault,
        nickname: data.nickname,
      });
      window.dispatchEvent(new Event("refetchCards"));
      router.back();
    } catch {
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
          <DialogTitle>{t("dashboard.cards.edit_card")}</DialogTitle>
        </DialogHeader>
        {fetching ? (
          <div className="flex items-center justify-center min-h-[200px] gap-2">
            <Spinner className="w-6 h-6" />
            <span>{t("dashboard.cards.loading_card")}</span>
          </div>
        ) : (
          card && (
            <CardForm
              control={form.control}
              handleSubmit={form.handleSubmit}
              setValue={form.setValue}
              watch={form.watch}
              formState={form.formState}
              loading={loading}
              onSubmit={handleSubmit}
              submitLabel={t("dashboard.cards.save")}
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
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
