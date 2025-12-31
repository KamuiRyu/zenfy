"use client";

import { useState, useEffect, useMemo } from "react";
import TransactionHistoryHeader from "./transaction_history_header";
import TransactionGroup from "./transaction_group";
import TransactionHistoryFooter from "./transaction_history_footer";
import TransactionFilters from "./transaction_filters";
import { useSelectedCard } from "@/providers/selected_card_provider";
import useTransactions from "@/hooks/use_transactions";
import useCategories from "@/hooks/use_categories";
import NoTransactions from "./no_transactions";
import { useI18n } from "@/i18n/useI18n";
import TransactionHistoryLoading from "./transaction_history_loading";
import { useRouter } from "next/navigation";
import { TransactionType, TransactionFiltersType, CategoryType } from "@/types/transactions";

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

export default function TransactionHistory() {
  const { t } = useI18n();
  const { selectedCardUuid, selectedCardLastFour, selectedCardBrand } = useSelectedCard();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<TransactionFiltersType>({});

  const handleFiltersChange = (newFilters: TransactionFiltersType) => {
    setFilters(newFilters);
    setPage(0);
  };
  const [mounted] = useState(true);
  const limit = 10;
  const offset = page * limit;
  const memoizedFilters = useMemo(() => ({ ...filters, cardUuid: selectedCardUuid || undefined }), [filters, selectedCardUuid]);
  const { transactions, loading, error, refetch } = useTransactions(limit, offset, memoizedFilters, mounted);
  const { categories, loading: categoriesLoading } = useCategories();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const router = useRouter();

  const mappedCategories = useMemo(() => categories.map(cat => ({ uuid: cat.uuid || '0', name: cat.name } as CategoryType)), [categories]);


  useEffect(() => {
    const handleTransactionAdded = () => {
      refetch();
      window.dispatchEvent(new CustomEvent('balanceOverviewUpdated'));
    };
    window.addEventListener('transactionAdded', handleTransactionAdded);
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, [refetch]);

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

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, TransactionType[]> = {};

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    transactions.forEach((transaction) => {
      const date = new Date(transaction.occurred_at);
      const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      let dateKey: string;

      if (transactionDate >= today) {
        dateKey = t('dashboard.transaction_history.today');
      } else if (transactionDate >= yesterday) {
        dateKey = t('dashboard.transaction_history.yesterday');
      } else if (transactionDate >= lastWeek) {
        dateKey = t('dashboard.transaction_history.last_week');
      } else if (transactionDate >= lastMonth) {
        dateKey = t('dashboard.transaction_history.last_month');
      } else {
        dateKey = t('dashboard.transaction_history.older');
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction as unknown as TransactionType);
    });

    return groups;
  }, [transactions, t]);

  if (!mounted) {
    return (
      <div className="rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 ">
          <TransactionHistoryHeader title={t('dashboard.transaction_history.title')} onRefresh={() => {}} onAdd={() => router.push('/dashboard/transactions/add')} countdown={null} loading={loading}  />
          <div suppressHydrationWarning>
            <TransactionFilters filters={filters} onFiltersChange={handleFiltersChange} categories={mappedCategories} loading={categoriesLoading} />
          </div>
          <div className="space-y-10 max-h-160 overflow-y-auto">
            <TransactionGroup
              date={t('dashboard.transaction_history.today')}
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
    <div className="overflow-hidden">
      <div className="rounded-2xl p-6 sm:p-8 ">
        <TransactionHistoryHeader title={t('dashboard.transaction_history.title')} onRefresh={handleRefresh} onAdd={() => router.push('/dashboard/transactions/add')} countdown={countdown} loading={loading} />

        <div suppressHydrationWarning>
          <TransactionFilters filters={filters} onFiltersChange={handleFiltersChange} categories={mappedCategories} loading={categoriesLoading} />
        </div>

        {error && <div className="text-center py-12 max-h-130 text-destructive">{t('dashboard.transaction_history.error')}: {error}</div>}

        {!selectedCardUuid && !loading && !error && (
          <div className="max-h-160 overflow-y-auto">
            <NoTransactions/>
          </div>
        )}

        {selectedCardUuid && !loading && !error && (
          <>
            <div className="space-y-10 max-h-120 overflow-y-auto">
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

        {loading && selectedCardUuid && (
          <TransactionHistoryLoading />
        )}
      </div>
    </div>
  );
}

