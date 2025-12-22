interface BalanceOverviewData {
  balance: number;
  total_income: number;
  total_expense: number;
  last_payment_amount?: number;
  last_payment_date?: string;
}

interface StatisticsProps {
  balanceOverview: BalanceOverviewData | null;
  loading: boolean;
  error: string | null;
}

export default function Statistics({ balanceOverview, loading, error }: StatisticsProps) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-medium uppercase tracking-wide">
            Statistics
          </h3>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Chart Coming Soon</p>
            <p className="text-xs text-muted-foreground mt-1">Analytics dashboard in development</p>
          </div>
        </div>
      </div>
    </div>
  );
}