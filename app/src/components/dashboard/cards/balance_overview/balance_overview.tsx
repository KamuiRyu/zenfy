import MoneyDisplay from "@/components/ui/money_display";

interface BalanceOverviewData {
  balance: number;
  total_income: number;
  total_expense: number;
  last_payment_amount?: number;
  last_payment_date?: string;
}

interface BalanceOverviewProps {
  balanceOverview: BalanceOverviewData | null;
  loading: boolean;
  error: string | null;
}

export default function BalanceOverview({ balanceOverview, loading, error }: BalanceOverviewProps) {
  const balance = balanceOverview?.balance || 0;
  const isPositive = balance >= 0;

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-md font-medium uppercase tracking-wide">
            Balance Overview
          </h3>
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>

        <div className={`text-4xl font-bold mb-6 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {loading ? (
            <div className="animate-pulse bg-muted h-10 w-40 rounded-lg"></div>
          ) : error ? (
            <span className="text-destructive text-xl">Error loading balance</span>
          ) : (
            <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                <MoneyDisplay amount={balance} size="4xl" className="font-medium"/>
            </span>
          )}
        </div>

        <div className="mb-8">
          <div className="backdrop-blur-sm p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total incomes this month</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-5 w-24 rounded"></div>
                  ) : (
                    <MoneyDisplay amount={balanceOverview?.total_income || 0} size="lg" className="font-medium" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm p-4 rounded-lg ">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total expenses this month</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {loading ? (
                    <div className="animate-pulse bg-muted h-5 w-24 rounded"></div>
                  ) : (
                    <MoneyDisplay amount={balanceOverview?.total_expense || 0} size="lg" className="font-medium"/>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium uppercase tracking-wide">
              Last Payment Details
            </h3>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Amount Paid</div>
              <div className="text-2xl font-bold text-foreground">
                {loading ? (
                  <div className="animate-pulse bg-muted h-6 w-28 rounded"></div>
                ) : balanceOverview?.last_payment_amount ? (
                    <MoneyDisplay amount={balanceOverview.last_payment_amount} size="2xl" className="font-medium" />
                ) : (
                  <span className="text-muted-foreground text-lg">No payments yet</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Payment Date</div>
              <div className="text-sm font-medium">
                {loading ? (
                  <div className="animate-pulse bg-muted h-4 w-32 rounded"></div>
                ) : balanceOverview?.last_payment_date ? (
                  <span className="inline-flex items-center py-0.5 rounded-full text-sm font-medium">
                    {new Date(balanceOverview.last_payment_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">No payments yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}