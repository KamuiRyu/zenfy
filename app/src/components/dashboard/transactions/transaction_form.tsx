"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/i18n/useI18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTransactionActions } from "@/hooks/use_transaction_actions";
import useCategories from "@/hooks/use_categories";
import useCards from "@/hooks/use_cards";

const transactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  categoryId: z.string().min(1, "Category is required"),
  cardId: z.string().min(1, "Card is required"),
  date: z.date(),
  type: z.enum(["income", "expense", "investment"]),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: any;
  onClose: () => void;
}

export default function TransactionForm({ transaction, onClose }: TransactionFormProps) {
  const { t } = useI18n();
  const { createTransaction, updateTransaction, loading } = useTransactionActions();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { cards, loading: cardsLoading, error: cardsError } = useCards();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description || "",
      amount: transaction ? (transaction.amount / 100).toString() : "",
      categoryId: transaction?.category?.id?.toString() || "",
      cardId: transaction?.card_uuid || "",
      date: transaction ? new Date(transaction.occurred_at) : new Date(),
      type: transaction?.category?.type || "expense",
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      if (transaction) {
        await updateTransaction(transaction.uuid, data);
      } else {
        await createTransaction(data);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === form.watch("type"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {transaction ? t("dashboard.transactions.edit_transaction") : t("dashboard.transactions.add_transaction")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.transactions.type")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("dashboard.transactions.select_type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">{t("dashboard.transaction_history.income")}</SelectItem>
                    <SelectItem value="expense">{t("dashboard.transaction_history.expense")}</SelectItem>
                    <SelectItem value="investment">{t("dashboard.transaction_history.investment")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.transaction_history.category")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("dashboard.transactions.select_category")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dashboard.transactions.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("dashboard.transactions.description_placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.transactions.amount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.transactions.card")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("dashboard.transactions.select_card")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cards.filter(card => card.id).map((card) => (
                      <SelectItem key={card.id} value={card.id!.toString()}>
                        ****{card.lastFour} ({card.brand})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("dashboard.transactions.date")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>{t("dashboard.transactions.select_date")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("action.cancel")}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t("action.loading") : transaction ? t("dashboard.transactions.save") : t("dashboard.transactions.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}