"use client";

import dynamic from "next/dynamic";

const TransactionHistory = dynamic(() => import("@/components/dashboard/cards/transaction_history/transaction_history"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg"></div>,
});

export default function TransactionHistoryWrapper() {
  return <TransactionHistory />;
}