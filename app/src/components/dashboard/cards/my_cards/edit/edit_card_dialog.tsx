"use client";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import cardService from "@/services/card_service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CardPreview from "../form/card_preview";
import { CardForm } from "../form/card_form";
import { useForm } from "react-hook-form";
import { cardFormSchema, CardFormSchema } from "../form/card_form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/i18n/useI18n";

export default function EditCardDialog({
  cardId,
}: {
  cardId: string | number;
}) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadCard() {
      if (!cardId) return;
      setFetching(true);
      try {
        const fetchedCard = await cardService.getCard(cardId);
        if (!fetchedCard) {
          toast.error(t("dashboard.cards.card_not_found"));
          router.back();
          return;
        }
        setCard(fetchedCard);
      } catch (error) {
        toast.error(t("dashboard.cards.error_loading_card"));
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
      toast.error(t("dashboard.cards.card_not_found"));
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
        card_type: data.cardType,
        billing_day: Number(data.billingDay),
        is_default: data.isDefault,
        nickname: data.nickname,
      });
      router.back();
    } catch (err: any) {
      toast.error(t("dashboard.cards.error_updating_card"));
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
