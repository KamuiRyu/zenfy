"use client";

import { useState, useEffect, useMemo } from "react";
import TransactionHistoryEmpty from "./transaction_history_empty";
import TransactionHistoryHeader from "./transaction_history_header";
import TransactionGroup from "./transaction_group";
import TransactionHistoryFooter from "./transaction_history_footer";
import TransactionFilters from "./transaction_filters";
import { useSelectedCard } from "@/providers/selected_card_provider";
import useTransactions from "@/hooks/use_transactions";
import NoTransactions from "./no_transactions";
import { request } from "@/services/service_base";

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
  const [filters, setFilters] = useState<{ dateFrom?: string; dateTo?: string; type?: string; search?: string }>({});

  const handleFiltersChange = (newFilters: { dateFrom?: string; dateTo?: string; type?: string; search?: string }) => {
    setFilters(newFilters);
    setPage(0);
  };
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  const limit = 10;
  const offset = page * limit;
  const memoizedFilters = useMemo(() => ({ ...filters, cardUuid: selectedCardUuid || undefined }), [filters, selectedCardUuid]);
  const { transactions, loading, error, refetch } = useTransactions(limit, offset, memoizedFilters, mounted);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await request("/categories", "");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    if (mounted) {
      fetchCategories();
    }
  }, [mounted]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;
    if (isCounting && countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            setIsCounting(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isCounting, countdown, refetch]);

  const handleRefresh = () => {
    if (!isCounting) {
      refetch();
      setIsCounting(true);
      setCountdown(5);
    }
  };



  const groupedTransactions = groupTransactionsByDate(transactions);

  if (!mounted) {
    return (
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 sm:p-8 ">
          <TransactionHistoryHeader title="Transaction History" onRefresh={() => {}} countdown={null} />
          <div suppressHydrationWarning>
            <TransactionFilters filters={filters} onFiltersChange={handleFiltersChange} categories={[]} />
          </div>
          <div className="space-y-10 max-h-160 overflow-y-auto">
            <TransactionGroup
              date="Today"
              transactions={[]}
              formatTime={formatTime}
              formatCurrency={formatCurrency}
              selectedCardLastFour={selectedCardLastFour}
              selectedCardBrand={selectedCardBrand}
              loading={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 sm:p-8 ">
        <TransactionHistoryHeader title="Transaction History" onRefresh={handleRefresh} countdown={countdown} />

        <div suppressHydrationWarning>
          <TransactionFilters filters={filters} onFiltersChange={handleFiltersChange} categories={categories} />
        </div>

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
                  loading={false}
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

        {loading && (
          <div className="space-y-10 max-h-160 overflow-y-auto">
            <TransactionGroup
              date="Today"
              transactions={[]}
              formatTime={formatTime}
              formatCurrency={formatCurrency}
              selectedCardLastFour={selectedCardLastFour}
              selectedCardBrand={selectedCardBrand}
              loading={true}
            />
            <TransactionGroup
              date="Yesterday"
              transactions={[]}
              formatTime={formatTime}
              formatCurrency={formatCurrency}
              selectedCardLastFour={selectedCardLastFour}
              selectedCardBrand={selectedCardBrand}
              loading={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

