"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
import { useI18n } from "@/i18n/useI18n";
import useCategories from "@/hooks/use_categories";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFiltersProps {
  filters: {
    categoryId?: number;
    type?: string;
    search?: string;
  };
  onFiltersChange: (filters: {
    categoryId?: number;
    type?: string;
    search?: string;
  }) => void;
}

export default function CategoryFilters({
  filters,
  onFiltersChange,
}: CategoryFiltersProps) {
  const { t } = useI18n();
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const { loading } = useCategories();

  const updateFilter = useCallback(
    (key: string, value: string | number | undefined) => {
      const newFilters = { ...filters };
      if (value !== undefined) {
        (newFilters as Record<string, string | number | undefined>)[key] =
          value;
      } else {
        delete newFilters[key as keyof typeof newFilters];
      }

      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

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

  return (
    <div className="rounded-2xl p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4" />
        <span className="font-medium">
          {t("filter.title")}
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
          <label className="text-sm font-medium mb-2 block">
            {t("filter.search")}
          </label>
          {loading ? (
            <Skeleton className="w-full h-10" />
          ) : (
            <Input
              placeholder={t(
                "filter.search_placeholder", { entity: t("dashboard.categories.categories").toLowerCase() }
              )}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {t("filter.type.title")}
          </label>
          {loading ? (
            <Skeleton className="w-full h-10" />
          ) : (
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
                className="max-h-60"
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
          )}
        </div>
      </div>
    </div>
  );
}
