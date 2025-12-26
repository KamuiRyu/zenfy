"use client";

import React from "react";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/useI18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/base/confirm_dialog";
import MoneyDisplay from "@/components/ui/money_display";
import { useTransactionActions } from "@/hooks/use_transaction_actions";
import { CardBrand } from "@/components/dashboard/cards/my_cards/card_brand";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import { useRouter } from "next/navigation";

interface IconComponentProps {
  className?: string;
}

type IconComponent = React.ComponentType<IconComponentProps>;

interface TransactionItemProps {
  transaction: any;
  onDelete: (uuid: string) => void;
}

export default function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const { t } = useI18n();
  const { deleteTransaction } = useTransactionActions();
  const router = useRouter();

  const isIncome = transaction.category?.type === "income";
  const amountColor = isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy 'às' HH:mm", {
      locale: t('locale') === 'pt' ? ptBR : enUS
    });
  };

  const transactionIcon =React.useMemo(() => {
    const icon: string | undefined = transaction.category?.icon;
    if (icon) {
      const siIconName: string = `Si${icon
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")}`;

      const bsIconName: string = `Bs${icon
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")}`;

      const SiIconComponent: IconComponent | undefined = (SiIcons as Record<string, IconComponent>)[siIconName];
      if (SiIconComponent) {
        return <SiIconComponent className="w-6 h-6 text-white" />;
      }

      const BsIconComponent: IconComponent | undefined = (BsIcons as Record<string, IconComponent>)[bsIconName];
      if (BsIconComponent) {
        return <BsIconComponent className="w-6 h-6 text-white" />;
      }
    }
    return <BsIcons.BsCreditCardFill className="w-6 h-6 text-white" />;
  }, [transaction.category?.icon]);


  const title = transaction.description || t('dashboard.transactions.transaction');
  const merchant = transaction.merchant;
  const subtitle = transaction.category?.name;
  const time = formatDate(transaction.occurred_at);
  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: transaction.currency || "BRL",
  }).format((transaction.amount || 0) / 100);

  return (
    <div className="group grid grid-cols-[5fr_1fr_1fr_1fr_auto] items-center gap-4 p-4 hover:bg-muted/80 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
          style={{ backgroundColor: transaction.category?.color || "#f3f4f6" }}
        >
          {transactionIcon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-card-foreground truncate text-lg">
            {title}
          </div>
          {merchant && (
            <div className="text-sm text-muted-foreground truncate mt-0.5">
              {merchant}
            </div>
          )}
          <div className="text-base text-muted-foreground mt-0.5 font-medium">
            {time}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-2 py-1 flex-shrink-0">
        <div className="relative w-12 h-7 flex items-center justify-center font-bold text-card-foreground border border-border rounded-sm shadow-sm">
          <CardBrand brand={transaction.card?.brand || "visa"} />
        </div>
        <span className="text-md font-medium text-muted-foreground">
          ****{transaction.card?.last_four || "4329"}
        </span>
      </div>

      <div className="hidden lg:flex justify-center flex-shrink-0">
        <span className="px-3 py-1 rounded-full text-sm font-medium border truncate w-[120px] text-center " title={subtitle || t("dashboard.transaction_history.general")}>
            {subtitle || t("dashboard.transaction_history.general")}
        </span>
      </div>

      <div
        className={`font-medium text-md flex-shrink-0 text-center ${amountColor}`}
      >
        {isIncome ? "+" : "-"} {formattedAmount}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/transactions/edit/${transaction.uuid}`)}
          className="h-8 w-8 p-0"
        >
          <Edit2 className="w-4 h-4" />
        </Button>

        <ConfirmDialog
          title={t("dashboard.transactions.confirm_delete")}
          description={t("dashboard.transactions.delete_description")}
          onConfirm={async () => {
            try {
              await deleteTransaction(transaction.uuid);
              onDelete(transaction.uuid);
            } catch (error) {
            }
          }}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          }
        />
      </div>
    </div>
  );
}