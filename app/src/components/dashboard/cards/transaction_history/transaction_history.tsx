"use client";

import { useState } from "react";
import TransactionItem from "./transaction_item";
import TransactionHistoryEmpty from "./transaction_history_empty";
import TransactionHistoryHeader from "./transaction_history_header";
import TransactionGroup from "./transaction_group";
import TransactionHistoryFooter from "./transaction_history_footer";
import { useSelectedCard } from "@/providers/selected_card_provider";
import useTransactions from "@/hooks/use_transactions";
import NoTransactions from "./no_transactions";

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  }).format(amount / 100);
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupTransactionsByDate(transactions: any[]) {
  const groups: Record<string, any[]> = {};

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  transactions.forEach((transaction) => {
    const date = new Date(transaction.occurred_at);
    let dateKey = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (dateKey === today) dateKey = "Today";
    else if (dateKey === yesterdayStr) dateKey = "Yesterday";
    else {
      dateKey = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
  });

  return groups;
}

export default function TransactionHistory() {
  const { selectedCardUuid, selectedCardLastFour, selectedCardBrand } = useSelectedCard();
  const [page, setPage] = useState(0);
  const limit = 10;
  const offset = page * limit;
  const { transactions, loading, error } = useTransactions(limit, offset, selectedCardUuid || undefined);

  if (!selectedCardUuid) {
    return <TransactionHistoryEmpty title="Transaction History" message="Select a card to view its transaction history" />;
  }

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 sm:p-8 ">
        <TransactionHistoryHeader title="Transaction History" />

        {loading && <div className="text-center py-12 max-h-130 text-muted-foreground">Loading transactions...</div>}

        {error && <div className="text-center py-12 max-h-130 text-destructive">Error: {error}</div>}

        {!loading && !error && (
          <>
            <div className="space-y-10 max-h-160 overflow-y-auto">
              {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
                <TransactionGroup
                  key={date}
                  date={date}
                  transactions={dayTransactions}
                  formatTime={formatTime}
                  formatCurrency={formatCurrency}
                  selectedCardLastFour={selectedCardLastFour}
                  selectedCardBrand={selectedCardBrand}
                />
              ))}
              {transactions.length === 0 && <NoTransactions />}
            </div>
            {transactions.length > 0 && (
              <TransactionHistoryFooter
                page={page}
                setPage={setPage}
                hasMore={transactions.length === limit}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

