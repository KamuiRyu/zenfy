"use client";

import { useI18n } from "@/i18n/useI18n";
import TransactionList from "@/components/dashboard/transactions/transaction_list";

export default function TransactionsWrapper() {
  const { t } = useI18n();

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.transactions.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('dashboard.transactions.subtitle')}</p>
          </div>
        
        </div>
      </div>

      <TransactionList/>
    </div>
  );
}