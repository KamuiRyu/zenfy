import React from "react";

interface TransactionHistoryHeaderProps {
  title: string;
}

export default function TransactionHistoryHeader({ title }: TransactionHistoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:flex-none">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-muted border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="px-6 py-2.5 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">
          Filters
        </button>
      </div>
    </div>
  );
}