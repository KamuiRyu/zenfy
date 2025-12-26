import React from "react";
import TransactionItem from "./transaction_item";
import { useI18n } from "@/i18n/useI18n";
import { TransactionType } from "@/types/transactions";

interface TransactionGroupProps {
  date: string;
  transactions: TransactionType[];
  formatTime: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
  selectedCardLastFour?: string | null;
  selectedCardBrand?: string | null;
  loading?: boolean;
}

const TransactionGroup = React.memo(function TransactionGroup({ date, transactions, formatTime, formatCurrency, selectedCardLastFour, selectedCardBrand, loading = false }: TransactionGroupProps) {
  const { t } = useI18n();
  if (loading) {
    return (
      <div>
        {/* Header skeleton */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg mb-4">
          <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-20"></div>
          <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-16"></div>
        </div>

        {/* Transaction items skeleton */}
        <div className="space-y-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-24"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-16"></div>
                <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg mb-4">
        <span className="text-sm font-medium text-muted-foreground">{date}</span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {transactions.length} {transactions.length === 1 ? t("dashboard.transaction_history.transaction") : t("dashboard.transaction_history.transactions")}
        </span>
      </div>
      <div className="space-y-1">
        {transactions.map((transaction) => (
        
          <TransactionItem
            key={transaction.uuid}
            title={transaction.description || t("dashboard.transaction_history.transaction")}
            merchant={transaction.merchant}
            subtitle={transaction.category?.name}
            time={formatTime(transaction.occurred_at)}
            card={transaction.card_uuid}
            amount={formatCurrency(transaction.amount, transaction.currency)}
            categoryType={transaction.category?.type}
            icon={transaction.category?.icon}
            categoryColor={transaction.category?.color}
            selectedCardLastFour={selectedCardLastFour}
            selectedCardBrand={selectedCardBrand}
          />
        ))}
      </div>
    </div>
  );
});

export default TransactionGroup;