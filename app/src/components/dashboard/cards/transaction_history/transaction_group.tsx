import React from "react";
import TransactionItem from "./transaction_item";
import TransactionHistoryLoading from "./transaction_history_loading";

interface TransactionGroupProps {
  date: string;
  transactions: any[];
  formatTime: (dateString: string) => string;
  formatCurrency: (amount: number, currency: string) => string;
  selectedCardLastFour?: string | null;
  selectedCardBrand?: string | null;
  loading?: boolean;
}

const TransactionGroup = React.memo(function TransactionGroup({ date, transactions, formatTime, formatCurrency, selectedCardLastFour, selectedCardBrand, loading = false }: TransactionGroupProps) {
  if (loading) {
    return (
      <TransactionHistoryLoading/>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg mb-4">
        <span className="text-sm font-medium text-muted-foreground">{date}</span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {transactions.length} {transactions.length === 1 ? "Transaction" : "Transactions"}
        </span>
      </div>
      <div className="space-y-1">
        {transactions.map((transaction) => (
        
          <TransactionItem
            key={transaction.uuid}
            title={transaction.description || transaction.merchant || "Transaction"}
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