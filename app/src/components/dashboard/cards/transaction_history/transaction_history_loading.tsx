import React from "react";
import TransactionGroup from "./transaction_group";
import { useI18n } from "@/i18n/useI18n";

export default function TransactionHistoryLoading({}) {
  return (
    <div>
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg mb-4">
        <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-20"></div>
        <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-16"></div>
      </div>

      {/* Transaction items skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-32"></div>
                <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-24"></div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-16"></div>
              <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-12"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg mb-4 mt-8">
        <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-20"></div>
        <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-16"></div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-32"></div>
                <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-24"></div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-16"></div>
              <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
