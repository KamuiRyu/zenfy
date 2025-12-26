"use client";

import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { useI18n } from "@/i18n/useI18n";
import useCategories from "@/hooks/use_categories";

interface TransactionFiltersProps {
  filters: {
    dateFrom?: string;
    dateTo?: string;
    categoryId?: number;
    type?: string;
    kind?: string;
    search?: string;
  };
  onFiltersChange: (filters: {
    dateFrom?: string;
    dateTo?: string;
    categoryId?: number;
    type?: string;
    kind?: string;
    search?: string;
  }) => void;
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
}: TransactionFiltersProps) {
  const { t } = useI18n();
  const [openDateRange, setOpenDateRange] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const { categories } = useCategories();

  useEffect(() => {
    const timer = setTimeout(() => {
      const newSearchValue = searchValue || undefined;
      if (newSearchValue !== filters.search) {
        updateFilter("search", newSearchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search]);

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters };
    if (value !== undefined) {
      newFilters[key as keyof typeof newFilters] = value;
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
  };

  const clearFilters = () => {
    onFiltersChange({});
    setSearchValue("");
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4" />
        <span className="font-medium">
          {t("dashboard.transaction_history.filters")}
        </span>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            {t("dashboard.transaction_history.clear")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("dashboard.transaction_history.search")}
          </label>
          <Input
            placeholder={t("dashboard.transaction_history.search_placeholder")}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("dashboard.transaction_history.date_range")}
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
                  : t("dashboard.transaction_history.select_date_range")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{
                  from: filters.dateFrom
                    ? new Date(filters.dateFrom)
                    : undefined,
                  to: filters.dateTo ? new Date(filters.dateTo) : undefined,
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
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("dashboard.transaction_history.category")}
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
                placeholder={t("dashboard.transaction_history.all_categories")}
              />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-60"
            >
              <SelectItem value="all">
                {t("dashboard.transaction_history.all_categories")}
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
          <label className="text-sm font-medium mb-2 block">
            {t("dashboard.transaction_history.type")}
          </label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              updateFilter("type", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("dashboard.transaction_history.all_types")}
              />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-60"
            >
              <SelectItem value="all">
                {t("dashboard.transaction_history.all_types")}
              </SelectItem>
              <SelectItem value="income">
                {t("dashboard.transaction_history.income")}
              </SelectItem>
              <SelectItem value="expense">
                {t("dashboard.transaction_history.expense")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("dashboard.transaction_history.kind")}
          </label>
          <Select
            value={filters.kind || "all"}
            onValueChange={(value) =>
              updateFilter("kind", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("dashboard.transaction_history.all_kinds")}
              />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-60"
            >
              <SelectItem value="all">
                {t("dashboard.transaction_history.all_kinds")}
              </SelectItem>
              <SelectItem value="credit">
                {t("dashboard.transaction_history.credit")}
              </SelectItem>
              <SelectItem value="debit">
                {t("dashboard.transaction_history.debit")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}