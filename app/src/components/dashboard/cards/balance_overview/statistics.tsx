"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BalanceOverview } from "@/hooks/use_balance_overview";
import { useI18n } from "@/i18n/useI18n";

interface StatisticsProps {
  balanceOverview: BalanceOverview | null;
  loading: boolean;
}

export default function Statistics({
  balanceOverview,
  loading,
}: StatisticsProps) {
  const { t, formatNumber } = useI18n();
  const chartConfig = {
    expense: {
      label: t("dashboard.statistics.expense"),
      color: "rgb(220 38 38)",
    },
    income: {
      label: t("dashboard.statistics.income"),
      color: "rgb(22 163 74)",
    },
  } satisfies ChartConfig;
  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium uppercase tracking-wide">
              {t("dashboard.statistics.title")}
            </h3>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="h-48">
            <div className="relative w-full h-full">
              <div className="absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-px bg-muted/30"></div>
                <div className="absolute inset-x-0 top-1/4 h-px bg-muted/20"></div>
                <div className="absolute inset-x-0 top-1/2 h-px bg-muted/20"></div>
                <div className="absolute inset-x-0 top-3/4 h-px bg-muted/20"></div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-muted/30"></div>

                <div className="absolute inset-y-0 left-0 w-px bg-muted/20"></div>
                <div className="absolute inset-y-0 left-1/6 w-px bg-muted/10"></div>
                <div className="absolute inset-y-0 left-2/6 w-px bg-muted/10"></div>
                <div className="absolute inset-y-0 left-3/6 w-px bg-muted/10"></div>
                <div className="absolute inset-y-0 left-4/6 w-px bg-muted/10"></div>
                <div className="absolute inset-y-0 left-5/6 w-px bg-muted/10"></div>
                <div className="absolute inset-y-0 right-0 w-px bg-muted/20"></div>

                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-100/50 to-transparent animate-pulse rounded-t-lg"></div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-red-100/30 to-transparent animate-pulse rounded-t-lg"
                  style={{ animationDelay: "0.2s" }}
                ></div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 pb-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-3 bg-muted/50 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none">
                  <div className="w-32 h-4 bg-muted/50 rounded animate-pulse"></div>
                  <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  <div className="w-20 h-3 bg-muted/50 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const chartData =
    balanceOverview?.monthly_stats?.slice(-6).map((stat) => ({
      month: stat.month,
      income: stat.total_income / 100,
      expense: stat.total_expense / 100,
    })) || [];

  // Only render chart if we have valid data and the component is not loading
  const shouldRenderChart = !loading && chartData.length > 0 && balanceOverview;

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-md font-medium uppercase tracking-wide">
            {t("dashboard.statistics.title")}
          </h3>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        <div className="h-48 w-full">
          {shouldRenderChart ? (
            <ChartContainer config={chartConfig} className="h-full w-full" >
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent formatValue={(value) => formatNumber(Number(value), { style: 'currency', currency: 'BRL' })} />}
                />
                <defs>
                  <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(22 163 74)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(22 163 74)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="rgb(220 38 38)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(220 38 38)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="expense"
                  type="natural"
                  fill="url(#fillExpense)"
                  fillOpacity={0.6}
                  stroke="rgb(220 38 38)"
                  stackId="a"
                />
                <Area
                  dataKey="income"
                  type="natural"
                  fill="url(#fillIncome)"
                  fillOpacity={0.6}
                  stroke="rgb(22 163 74)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.statistics.no_data")}
                </p>
              </div>
            </div>
          )}
        </div>

        {shouldRenderChart && (
          <div className="mt-4">
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  {t("dashboard.statistics.financial_overview")}{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  {t("dashboard.statistics.last_6_months")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}