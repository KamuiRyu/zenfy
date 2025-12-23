"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/useI18n";

interface TransactionPaginationProps {
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  hasMore: boolean;
}

export default function TransactionPagination({ page, setPage, hasMore }: TransactionPaginationProps) {
  const { t } = useI18n();

  return (
    <div className="flex justify-center items-center p-6 border-t border-border">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('dashboard.transaction_history.previous')}
        </Button>

        <span className="text-sm text-muted-foreground px-4">
          {t('dashboard.transaction_history.page')} {page + 1}
        </span>

        <Button
          variant="outline"
          onClick={() => setPage(p => p + 1)}
          disabled={!hasMore}
          className="flex items-center gap-2"
        >
          {t('dashboard.transaction_history.next')}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}