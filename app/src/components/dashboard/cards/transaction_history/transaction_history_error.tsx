import React from "react";

interface TransactionHistoryErrorProps {
  title: string;
  error: string;
}

export default function TransactionHistoryError({ title, error }: TransactionHistoryErrorProps) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
      </div>
      <div className="text-center py-12 text-destructive">Error: {error}</div>
    </div>
  );
}