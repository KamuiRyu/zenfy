"use client";

import { useCategories as useCategoriesContext } from "@/providers/categories_provider";

export default function useCategories() {
  return useCategoriesContext();
}