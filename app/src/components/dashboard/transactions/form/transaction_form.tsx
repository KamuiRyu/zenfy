"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/i18n/useI18n";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, CreditCard } from "lucide-react";
import { useTransactionActions } from "@/hooks/use_transaction_actions";
import useCategories from "@/hooks/use_categories";
import useCards from "@/hooks/use_cards";
import { TransactionFormData } from "@/components/dashboard/transactions/form/transaction_form.schema";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { CardBrand } from "../../cards/my_cards/card_brand";
import { bankStylesFor } from "../../cards/my_cards/bank_styles";
import TransactionInfoTab from "./transaction_info_tab";
import TransactionDetailsTab from "./transaction_details_tab";
import TransactionRecurringTab from "./transaction_recurring_tab";

interface TransactionFormProps {
  transaction?: any;
  onClose: () => void;
  preSelectedCard?: string;
}

export default function TransactionForm({ transaction, onClose, preSelectedCard }: TransactionFormProps) {
  const { t } = useI18n();

  const transactionSchema = z.object({
    description: z.string().min(1, t("validation.required")),
    amount: z.string().min(1, t("validation.required")),
    category_uuid: z.string().min(1, t("validation.select_option")),
    card_uuid: z.string().min(1, t("validation.select_option")),
    date: z.date(),
    type: z.enum(["income", "expense", "investment"]),
    kind: z.enum(["credit", "debit"], { message: t("validation.select_option") }),
    isInstallment: z.boolean().optional(),
    installmentNumber: z.number().optional(),
    totalInstallments: z.number().optional(),
    isRecurring: z.boolean().optional(),
    recurrenceType: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
    recurrenceStartDate: z.date().optional(),
    recurrenceEndDate: z.date().optional(),
  });

  const { createTransaction, updateTransaction, loading } = useTransactionActions();
  const { categories, loading: categoriesLoading } = useCategories();
  const { cards, loading: cardsLoading } = useCards();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description || "",
      amount: transaction ? (transaction.amount / 100).toString() : "",
      category_uuid: transaction?.category?.uuid?.toString() || "",
      card_uuid: preSelectedCard || transaction?.card_uuid || "",
      date: (() => {
        if (transaction?.occurred_at) {
          const d = new Date(transaction.occurred_at);
          return isNaN(d.getTime()) ? new Date() : d;
        }
        return new Date();
      })(),
      type: transaction?.category?.type || "expense",
      kind: transaction?.kind || undefined,
      isInstallment: transaction?.is_installment || false,
      installmentNumber: transaction?.installment_number || undefined,
      totalInstallments: transaction?.total_installments || undefined,
      isRecurring: transaction?.is_recurring || false,
      recurrenceType: transaction?.recurrence_type || undefined,
      recurrenceEndDate: transaction?.recurrence_end_date ? new Date(transaction.recurrence_end_date) : undefined,
    },
  });

  const selectedType = form.watch("type");
  const selectedCardUuid = form.watch("card_uuid");
  const selectedCard = cards.find(card => card.id?.toString() === selectedCardUuid);

  const filteredCategories = useMemo(() => {
    return categories.filter(category => category.type === selectedType);
  }, [categories, selectedType]);

  const kindOptions = useMemo(() => {
    if (!selectedCard?.cardType) return ["credit", "debit"];
    if (selectedCard.cardType === "credit") return ["credit"];
    if (selectedCard.cardType === "debit") return ["debit"];
    return ["credit", "debit"];
  }, [selectedCard]);

  const onSubmit = async () => {
    const data = form.getValues();
    
    try {
      if (transaction) {
        await updateTransaction(transaction.uuid, data);
      } else {
        await createTransaction(data);
      }
      onClose();
    } catch (error) {
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {transaction ? t("dashboard.transactions.edit_transaction") : t("dashboard.transactions.add_transaction")}
        </h2>
        <p className="text-muted-foreground">
          {transaction ? t("dashboard.transactions.edit_description") : t("dashboard.transactions.add_description")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-0 shadow-lg bg-transparent">
            <CardContent className="pt-0">
              <FormField
                control={form.control}
                name="card_uuid"
                render={({ field }) => {
                  const selectedCard = cards.find(card => card.id?.toString() === field.value);
                  const isPreSelected = !!preSelectedCard;
                  const bankStyle = bankStylesFor(selectedCard?.bank || "")?.gradient;
                  
                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {t("dashboard.transactions.card")}
                        {isPreSelected && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {t("dashboard.transactions.pre_selected")}
                          </span>
                        )}
                      </FormLabel>
                      {isPreSelected ? (
                        <div className="flex items-center gap-2 p-3 border border-dashed border-muted-foreground/50 rounded-md bg-muted/50">
                          <div className={`w-6 h-4 ${bankStyle} rounded-sm flex items-center justify-center relative`}>
                            <span className="text-white text-xs font-bold flex items-center justify-center">
                              <CardBrand brand={selectedCard?.brand as string} />
                            </span>
                          </div>
                          <span className="font-medium">
                            **** {selectedCard?.lastFour}
                          </span>
                        </div>
                      ) : (
                        <Select onValueChange={field.onChange} value={field.value} disabled={cardsLoading}>
                          <FormControl>
                            <SelectTrigger className="!h-12 w-full">
                              <SelectValue placeholder={cardsLoading ? t("action.loading") : t("dashboard.transactions.select_card")}>
                                {selectedCard ? (
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-4 ${bankStyle} rounded-sm flex items-center justify-center relative`}>
                                      <span className="text-white text-xs font-bold flex items-center justify-center">
                                        <CardBrand brand={selectedCard.brand as string} />
                                      </span>
                                    </div>
                                    <span className="font-medium">
                                      **** {selectedCard.lastFour}
                                    </span>
                                  </div>
                                ) : null}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent avoidCollisions={false} position="popper" className="max-h-70" side="top">
                            {cards.filter(card => card.id).map((card) => {
                              const itemBankStyle = bankStylesFor(card.bank || "")?.gradient;
                              return (
                                <SelectItem key={card.id} value={card.id!.toString()}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-4 ${itemBankStyle} rounded-sm flex items-center justify-center relative`}>
                                      <span className="text-white text-xs font-bold flex items-center justify-center">
                                        <CardBrand brand={card.brand as string} />
                                      </span>
                                    </div>
                                    <span>****{card.lastFour}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                      {isPreSelected && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("dashboard.transactions.pre_selected_description")}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">{t("dashboard.transactions.basic_info")}</TabsTrigger>
              <TabsTrigger value="details">{t("dashboard.transactions.payment_details")}</TabsTrigger>
              <TabsTrigger value="recurring">{t("dashboard.transactions.recurring")}</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 mt-6">
              <TransactionInfoTab
                control={form.control}
                categories={categories}
                categoriesLoading={categoriesLoading}
                filteredCategories={filteredCategories}
              />
            </TabsContent>
            <TabsContent value="details" className="space-y-6 mt-6">
              <TransactionDetailsTab
                control={form.control}
                watch={form.watch}
                selectedCardUuid={selectedCardUuid}
                kindOptions={kindOptions}
              />
            </TabsContent>
            <TabsContent value="recurring" className="space-y-6 mt-6">
              <TransactionRecurringTab
                control={form.control}
                watch={form.watch}
              />
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-8 border-t border-border/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 h-12"
              disabled={loading}
            >
              {t("action.cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              {loading ? t("action.loading") : transaction ? t("dashboard.transactions.save") : t("dashboard.transactions.create")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}