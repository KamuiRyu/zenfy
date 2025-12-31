"use client";

import { useEffect, useState, useMemo } from "react";
import { useI18n } from "@/i18n/useI18n";
import CategoryItem from "./category_item";
import CategoryFilters from "./category_filters";
import CategoryPagination from "./category_pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import useCategories from "@/hooks/use_categories";
import { CategoriesType } from "@/types/categories";
import categoryService from "@/services/category_service";

export default function CategoryList() {
  const { t } = useI18n();
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<{
    dateFrom?: string;
    dateTo?: string;
    type?: string;
    search?: string;
    categoryId?: number;
  }>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [filteringLoading, setFilteringLoading] = useState(false);
  const limit = 20;
  const offset = page * limit;
  const router = useRouter();

  const { categories: allCategories, loading, error, refetch } = useCategories();

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilteringLoading(true);
    setFilters(newFilters);
    setPage(0);
    
    setTimeout(() => {
      setFilteringLoading(false);
    }, 300);
  };

  const handleEdit = (uuid: string) => {
    router.push(`/dashboard/categories/edit/${uuid}`);
  };

  const handleDelete = async (uuid: string) => {
    if (confirm(t("dashboard.categories.confirm_delete"))) {
      try {
        await categoryService.deleteCategory(uuid);
        refetch();
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    }
  };

  const filteredCategories = useMemo(() => {
    let filtered = allCategories.filter(category => !category.is_default);

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchLower) ||
        (category.description && category.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter(category => category.type === filters.type);
    }

    return filtered;
  }, [allCategories, filters.search, filters.type]);

  const paginatedCategories = useMemo(() => {
    const start = offset;
    const end = start + limit;
    return filteredCategories.slice(start, end);
  }, [filteredCategories, offset, limit]);

  const hasMore = filteredCategories.length > offset + limit;

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinLoadingTime(false);
    }, 800);

    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    if (!loading && !minLoadingTime) {
      setInitialLoading(false);
    } else {
      setInitialLoading(true);
    }
  }, [loading, minLoadingTime]);

  useEffect(() => {
      const handleCategoryUpdated = () => {
        refetch();
      };
      window.addEventListener('categoryUpdated', handleCategoryUpdated);
      return () => {
        window.removeEventListener('categoryUpdated', handleCategoryUpdated);
      };
    }, [refetch]);

  if (initialLoading) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-500">
        {/* Filters skeleton */}
        <div className="rounded-2xl p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="w-16 h-4 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>
            <div>
              <Skeleton className="w-12 h-4 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="rounded-2xl overflow-hidden border">
          <div className="p-6">
            <div className="flex items-center justify-end mb-6">
              <Skeleton className="w-24 h-10" />
            </div>
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-16 h-4" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-border rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-48 h-4" />
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("dashboard.categories.error_loading")}: {error}
        </AlertDescription>
      </Alert>
    );
  }

  function handleAdd(): void {
    router.push('/dashboard/categories/add');
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      <CategoryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-end mb-6">
            <Button onClick={handleAdd} disabled={loading || filteringLoading}>
              <Plus className="w-4 h-4 mr-2" />
              {t("dashboard.categories.add")}
            </Button>
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {t("dashboard.categories.my_categories")}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredCategories.length} {t("dashboard.categories.categories")}
            </span>
          </div>

          {loading || filteringLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-48 h-4" />
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                {t("dashboard.categories.no_categories_found")}
              </h3>
              <p className="text-muted-foreground">
                {t("dashboard.categories.no_categories_description")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {paginatedCategories.map((category) => (
                <CategoryItem
                  key={category.uuid}
                  category={category as CategoriesType}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>

        {filteredCategories.length > 0 && (
          <CategoryPagination
            page={page}
            setPage={setPage}
            hasMore={hasMore}
          />
        )}
      </div>
    </div>
  );
}
