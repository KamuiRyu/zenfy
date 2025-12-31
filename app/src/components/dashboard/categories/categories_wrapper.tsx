"use client";

import { useI18n } from "@/i18n/useI18n";
import CategoryList from "@/components/dashboard/categories/category_list";

export default function CategoriesWrapper() {
  const { t } = useI18n();

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.categories.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('dashboard.categories.description')}</p>
          </div>
        
        </div>
      </div>

      <CategoryList/>
    </div>
  );
}