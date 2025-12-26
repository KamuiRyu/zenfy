import MoneyDisplay from "@/components/ui/money_display";
import { DollarSign, TrendingUp, TrendingDown, Clock, Plus } from "lucide-react";
import { useI18n } from "@/i18n/useI18n";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const { t } = useI18n();
  const balance = balanceOverview?.balance || 0;
  const isPositive = balance >= 0;


  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-md font-medium uppercase tracking-wide">
              {t('dashboard.balance_overview.title')}
            </h3>
            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-muted-foreground/50" />
            </div>
          </div>

          <div className="mb-6">
            <div className="space-y-2 mb-4">
              <div className="h-10 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-3/4"></div>
            </div>
          </div>

          <div className="mb-8">
            <div className="backdrop-blur-sm p-4 rounded-lg mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100/50 dark:bg-green-800/50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600/50 dark:text-green-400/50" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t('dashboard.balance_overview.total_incomes')}</div>
                  <div className="space-y-1">
                    <div className="h-5 bg-gradient-to-r from-green-100/50 via-green-100 to-green-100/50 dark:from-green-800/50 dark:via-green-800 dark:to-green-800/50 rounded animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-green-100/30 via-green-100/50 to-green-100/30 dark:from-green-800/30 dark:via-green-800/50 dark:to-green-800/30 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100/50 dark:bg-red-800/50 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-600/50 dark:text-red-400/50" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t('dashboard.balance_overview.total_expenses')}</div>
                  <div className="space-y-1">
                    <div className="h-5 bg-gradient-to-r from-red-100/50 via-red-100 to-red-100/50 dark:from-red-800/50 dark:via-red-800 dark:to-red-800/50 rounded animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-red-100/30 via-red-100/50 to-red-100/30 dark:from-red-800/30 dark:via-red-800/50 dark:to-red-800/30 rounded animate-pulse w-2/3"></div>
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
              <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-muted-foreground/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{t('dashboard.balance_overview.amount_paid')}</div>
                <div className="space-y-2">
                  <div className="h-6 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-1/2"></div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">{t('dashboard.balance_overview.payment_date')}</div>
                <div className="space-y-1">
                  <div className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-md font-medium uppercase tracking-wide">
            {t('dashboard.balance_overview.title')}
          </h3>
          
        </div>

        <div className={`text-4xl font-bold mb-6 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {error ? (
            <span className="text-destructive text-xl">{t('dashboard.balance_overview.error_loading')}</span>
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
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('dashboard.balance_overview.total_incomes')}</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  <MoneyDisplay amount={balanceOverview?.total_income || 0} size="lg" className="font-medium" />
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm p-4 rounded-lg ">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('dashboard.balance_overview.total_expenses')}</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  <MoneyDisplay amount={balanceOverview?.total_expense || 0} size="lg" className="font-medium"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium uppercase tracking-wide">
              {t('dashboard.balance_overview.last_payment_details')}
            </h3>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">{t('dashboard.balance_overview.amount_paid')}</div>
              <div className="text-2xl font-bold text-foreground">
                {balanceOverview?.last_payment_amount ? (
                    <MoneyDisplay amount={balanceOverview.last_payment_amount} size="2xl" className="font-medium" />
                ) : (
                  <span className="text-muted-foreground text-lg">{t('dashboard.balance_overview.no_payments')}</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">{t('dashboard.balance_overview.payment_date')}</div>
              <div className="text-sm font-medium">
                {balanceOverview?.last_payment_date ? (
                  <span className="inline-flex items-center py-0.5 rounded-full text-sm font-medium">
                    {new Date(balanceOverview.last_payment_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{t('dashboard.balance_overview.no_payments')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}