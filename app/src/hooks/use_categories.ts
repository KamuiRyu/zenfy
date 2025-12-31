"use client";

import { useCategories as useCategoriesContext } from "@/providers/categories_provider";
import { useState, useEffect } from "react";
import categoryService from "@/services/category_service";
import { CategoriesType } from "@/types/categories";

export default function useCategories() {
  return useCategoriesContext();
}

export function useFilteredCategories() {
  const [categories, setCategories] = useState<CategoriesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (filters?: { type?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories(filters);
      const data = response.data || response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}