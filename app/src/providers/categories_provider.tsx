"use client";

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import categoryService from "@/services/category_service";

type Category = {
  id: number;
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default: boolean;
};

type CategoriesState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

type CategoriesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CATEGORIES'; payload: Category[] };

const initialState: CategoriesState = {
  categories: [],
  loading: true,
  error: null,
};

function categoriesReducer(state: CategoriesState, action: CategoriesAction): CategoriesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

type CategoriesContextType = CategoriesState & {
  refetch: () => void;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(categoriesReducer, initialState);

  const fetchCategories = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const resp = await categoryService.getCategories();
      const payload = resp && typeof resp === "object" && "data" in resp ? resp.data : resp;
      let dataArray: Category[] = [];
      if (Array.isArray(payload)) dataArray = payload;
      else if (payload && typeof payload === "object") {
        const keys = Object.keys(payload).filter((k) => String(Number(k)) === String(k));
        if (keys.length) {
          keys.sort((a, b) => Number(a) - Number(b));
          dataArray = keys.map((k) => (payload as any)[k]);
        } else dataArray = Object.values(payload as any);
      }
      dispatch({ type: 'SET_CATEGORIES', payload: dataArray });
    } catch (err: any) {
      console.error("Failed to load categories", err);
      dispatch({ type: 'SET_ERROR', payload: err?.message || "Failed to load categories" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleRefetch = () => fetchCategories();
    window.addEventListener('refetchCategories', handleRefetch);
    return () => window.removeEventListener('refetchCategories', handleRefetch);
  }, []);

  const contextValue: CategoriesContextType = {
    ...state,
    refetch: fetchCategories,
  };

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}