import React from "react";

interface TransactionHistoryEmptyProps {
  title: string;
  message: string;
}

export default function TransactionHistoryEmpty({ title, message }: TransactionHistoryEmptyProps) {
  return (
    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
      </div>
      <div className="text-center py-12 text-muted-foreground">
        {message}
      </div>
    </div>
  );
}