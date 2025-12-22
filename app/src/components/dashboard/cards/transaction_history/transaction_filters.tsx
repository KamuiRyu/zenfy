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

interface TransactionFiltersProps {
  filters: {
    dateFrom?: string;
    dateTo?: string;
    categoryId?: number;
    type?: string;
    search?: string;
  };
  onFiltersChange: (filters: {
    dateFrom?: string;
    dateTo?: string;
    categoryId?: number;
    type?: string;
    search?: string;
  }) => void;
  categories: { id: number; name: string }[];
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
  categories,
}: TransactionFiltersProps) {
  const { t } = useI18n();
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [openDateTo, setOpenDateTo] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters };
    if (value !== undefined) {
      newFilters[key as keyof typeof newFilters] = value;
    } else {
      delete newFilters[key as keyof typeof newFilters];
    }
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      onFiltersChange(newFilters);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        updateFilter("search", searchValue || undefined);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search]);

  const clearFilters = () => {
    onFiltersChange({});
    setSearchValue("");
  };

  const hasFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="mb-8 p-4 ">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4" />
        <span className="font-medium">{t('dashboard.transaction_history.filters')}</span>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            {t('dashboard.transaction_history.clear')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium">{t('dashboard.transaction_history.search')}</label>
          <Input
            placeholder={t('dashboard.transaction_history.search_placeholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t('dashboard.transaction_history.from_date')}</label>
          <Popover open={openDateFrom} onOpenChange={setOpenDateFrom}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom
                  ? format(new Date(filters.dateFrom), "PPP")
                  : t('dashboard.transaction_history.select_date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  filters.dateFrom ? new Date(filters.dateFrom) : undefined
                }
                onSelect={(date) => {
                  updateFilter(
                    "dateFrom",
                    date ? date.toISOString() : undefined
                  );
                  setOpenDateFrom(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To */}
        <div>
          <label className="text-sm font-medium">{t('dashboard.transaction_history.to_date')}</label>
          <Popover open={openDateTo} onOpenChange={setOpenDateTo}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo
                  ? format(new Date(filters.dateTo), "PPP")
                  : t('dashboard.transaction_history.select_date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                onSelect={(date) => {
                  updateFilter("dateTo", date ? date.toISOString() : undefined);
                  setOpenDateTo(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium">{t('dashboard.transaction_history.category')}</label>
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
              <SelectValue placeholder={t('dashboard.transaction_history.all_categories')} />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-70"
            >
              <SelectItem value="all">{t('dashboard.transaction_history.all_categories')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium">{t('dashboard.transaction_history.type')}</label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              updateFilter("type", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('dashboard.transaction_history.all_types')} />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="max-h-70"
            >
              <SelectItem value="all">{t('dashboard.transaction_history.all_types')}</SelectItem>
              <SelectItem value="income">{t('dashboard.transaction_history.income')}</SelectItem>
              <SelectItem value="expense">{t('dashboard.transaction_history.expense')}</SelectItem>
              <SelectItem value="investment">{t('dashboard.transaction_history.investment')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
}
