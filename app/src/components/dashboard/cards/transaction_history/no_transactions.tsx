import React from "react";

export default function NoTransactions() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-card-foreground">No transactions found</h3>
      <p className="text-muted-foreground mt-1">Try adjusting your filters or select another card.</p>
    </div>
  );
}