"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useI18n } from "@/i18n/useI18n";
import { TransactionFiltersType, CategoryType}  from "@/types/transactions";

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  onFiltersChange: (filters: TransactionFiltersType) => void;
  categories: CategoryType[];
  loading?: boolean;
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
  categories,
  loading,
}: TransactionFiltersProps) {
  const { t } = useI18n();
  const [openDateRange, setOpenDateRange] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  useEffect(() => {
    let needsUpdate = false;
    const newFilters = { ...filters };

    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      if (dateFrom < monthStart || dateFrom > monthEnd) {
        delete newFilters.dateFrom;
        needsUpdate = true;
      }
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      if (dateTo < monthStart || dateTo > monthEnd) {
        delete newFilters.dateTo;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      onFiltersChange(newFilters);
    }
  }, [filters, monthStart, monthEnd, onFiltersChange]);

  useEffect(() => {
    if (!filters.dateFrom && !filters.dateTo) {
      onFiltersChange({
        ...filters,
        dateFrom: monthStart.toISOString(),
        dateTo: monthEnd.toISOString(),
      });
    }
  }, [filters, monthStart, monthEnd, onFiltersChange]);

  const updateFilter = useCallback((key: string, value: string | number | undefined) => {
    const newFilters = { ...filters };
    if (value !== undefined) {
      (newFilters as Record<string, string | number | undefined>)[key] = value;
    } else {
      delete newFilters[key as keyof typeof newFilters];
    }

    if (key === "dateFrom" || key === "dateTo") {
      const hasDateFrom = newFilters.dateFrom !== undefined;
      const hasDateTo = newFilters.dateTo !== undefined;

      if ((hasDateFrom && !hasDateTo) || (!hasDateFrom && hasDateTo)) {
        return;
      }
    }

    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newSearchValue = searchValue || undefined;
      if (newSearchValue !== filters.search) {
        updateFilter("search", newSearchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, updateFilter]);

  const clearFilters = () => {
    onFiltersChange({});
    setSearchValue("");
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return loading ? (
    <div className="p-4 rounded-2xl">
      <div className="h-10 bg-muted animate-pulse rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  ) : (
    <div className="mb-8 p-4 ">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4" />
        <span className="font-medium">
          {t("filter.title")}
        </span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            {t("filter.clear")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium">
            {t("filter.search")}
          </label>
          <Input
            placeholder={t("filter.search_placeholder", { entity: t("dashboard.transaction_history.transaction").toLocaleLowerCase() })}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("filter.date_range")}
          </label>
          <Popover open={openDateRange} onOpenChange={setOpenDateRange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom && filters.dateTo
                  ? `${format(new Date(filters.dateFrom), "MMM dd")} - ${format(
                      new Date(filters.dateTo),
                      "MMM dd"
                    )}`
                  : `${format(monthStart, "MMM dd")} - ${format(
                      monthEnd,
                      "MMM dd"
                    )}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="top">
              <Calendar
                mode="range"
                selected={{
                  from: filters.dateFrom
                    ? new Date(filters.dateFrom)
                    : monthStart,
                  to: filters.dateTo ? new Date(filters.dateTo) : monthEnd,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    const newFilters = { ...filters };
                    newFilters.dateFrom = range.from.toISOString();
                    newFilters.dateTo = range.to.toISOString();

                    onFiltersChange(newFilters);
                    setOpenDateRange(false);
                  }
                }}
                buttonVariant="ghost"
                numberOfMonths={1}
                month={new Date()}
                hideNavigation
                defaultMonth={currentMonth}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("filter.category")}
          </label>
          <Select
            value={filters.categoryId ? filters.categoryId.toString() : "all"}
            onValueChange={(value) =>
              updateFilter(
                "categoryId",
                value === "all" ? undefined : parseInt(value)
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("filter.all_categories")}
              />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-70"
            >
              <SelectItem value="all">
                {t("filter.all_categories")}
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.uuid} value={cat.uuid}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("filter.type.title")}
          </label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              updateFilter("type", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("filter.type.all")}
              />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-70"
            >
              <SelectItem value="all">
                {t("filter.type.all")}
              </SelectItem>
              <SelectItem value="income">
                {t("filter.type.income")}
              </SelectItem>
              <SelectItem value="expense">
                {t("filter.type.expense")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">
            {t("filter.kind.title")}
          </label>
          <Select
            value={filters.kind || "all"}
            onValueChange={(value) =>
              updateFilter("kind", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("filter.kind.all")}
              />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-70"
            >
              <SelectItem value="all">
                {t("filter.kind.all")}
              </SelectItem>
              <SelectItem value="credit">
                {t("filter.kind.credit")}
              </SelectItem>
              <SelectItem value="debit">
                {t("filter.kind.debit")}
              </SelectItem>
               <SelectItem value="deposit">
                {t("filter.kind.deposit")}
              </SelectItem>
              <SelectItem value="withdrawal">
                {t("filter.kind.withdrawal")}
              </SelectItem>
              <SelectItem value="transfer">
                {t("filter.kind.transfer")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

         <div>
          <label className="text-sm font-medium">
            {t("filter.recurring.title")}
          </label>
          <Select
            value={filters.recurring || "all"}
            onValueChange={(value) =>
              updateFilter("recurring", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("filter.recurring.all")}
              />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-70"
            >
              <SelectItem value="all">
                {t("filter.recurring.all")}
              </SelectItem>
              <SelectItem value="yes">
                {t("filter.recurring.yes")}
              </SelectItem>
              <SelectItem value="no">
                {t("filter.recurring.no")}
              </SelectItem>

            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
