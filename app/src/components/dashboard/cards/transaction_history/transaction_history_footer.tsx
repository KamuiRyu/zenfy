import React from "react";
import { useI18n } from "@/i18n/useI18n";

interface TransactionHistoryFooterProps {
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  hasMore: boolean;
}

export default function TransactionHistoryFooter({ page, setPage, hasMore }: TransactionHistoryFooterProps) {
  const { t } = useI18n();
  return (
    <div className="flex justify-center items-center mt-8 space-x-4 pt-4 border-t border-border">
      <button
        onClick={() => setPage(p => Math.max(0, p - 1))}
        disabled={page === 0}
        className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
      >
        {t('dashboard.transaction_history.previous')}
      </button>
      <span className="text-sm text-muted-foreground">{t('dashboard.transaction_history.page')} {page + 1}</span>
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={!hasMore}
        className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
      >
        {t('dashboard.transaction_history.next')}
      </button>
    </div>
  );
}