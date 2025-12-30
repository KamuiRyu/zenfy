"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/useI18n";
import useTransactions from "@/hooks/use_transactions";
import TransactionItem from "./transaction_item";
import TransactionFilters from "./transaction_filters";
import TransactionPagination from "./transaction_pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";



export default function TransactionList() {
  const { t } = useI18n();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<{
    dateFrom?: string;
    dateTo?: string;
    type?: string;
    search?: string;
    categoryId?: number;
  }>({});
  const limit = 20;
  const offset = page * limit;
  const router = useRouter();

  const { transactions, loading, error, refetch } = useTransactions(
    limit,
    offset,
    filters,
    true
  );

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(0);
  };

  useEffect(() => {
      const handleTransactionUpdated = () => {
        refetch();
      };
      window.addEventListener('transactionUpdated', handleTransactionUpdated);
      return () => {
        window.removeEventListener('transactionUpdated', handleTransactionUpdated);
      };
    }, [refetch]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("dashboard.transactions.error_loading")}: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <TransactionFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-end mb-6">
            <Button onClick={() => router.push("/dashboard/transactions/add")} disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              {t("dashboard.transactions.add_transaction")}
            </Button>
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {t("dashboard.transactions.recent_transactions")}
            </h2>
            <span className="text-sm text-muted-foreground">
              {transactions.length} {t("dashboard.transactions.transactions")}
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-48 h-4" />
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                {t("dashboard.transactions.no_transactions_found")}
              </h3>
              <p className="text-muted-foreground">
                {t("dashboard.transactions.no_transactions_description")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.uuid}
                  transaction={transaction}
                  onDelete={() => refetch()}
                />
              ))}
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <TransactionPagination
            page={page}
            setPage={setPage}
            hasMore={transactions.length === limit}
          />
        )}
      </div>
    </div>
  );
}
