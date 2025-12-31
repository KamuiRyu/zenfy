"use client";

import { createContext, useContext, useEffect, useReducer, ReactNode, useRef, useCallback } from "react";
import categoryService from "@/services/category_service";

type Category = {
  uuid: string;
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
  user_id?: string | null;
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
  const cacheRef = useRef<{ data: Category[], timestamp: number } | null>(null);
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  const fetchCategories = useCallback(async (useCache: boolean = true) => {
    // Try cache first
    if (useCache && cacheRef.current && Date.now() - cacheRef.current.timestamp < CACHE_TTL) {
      dispatch({ type: 'SET_CATEGORIES', payload: cacheRef.current.data });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const resp = await categoryService.getCategories();
      const payload = resp && typeof resp === "object" && "data" in resp ? resp.data : resp;
      let dataArray: Category[] = [];
      
      if (payload && typeof payload === "object" && "data" in payload) {
        // Paginated response
        const paginated = payload as { data: Category[] };
        dataArray = paginated.data;
      } else if (Array.isArray(payload)) {
        // Legacy array response
        dataArray = payload;
      } else if (payload && typeof payload === "object") {
        // Object response
        const keys = Object.keys(payload).filter((k) => String(Number(k)) === String(k));
        if (keys.length) {
          keys.sort((a, b) => Number(a) - Number(b));
          dataArray = keys.map((k) => (payload as Record<string, Category>)[k]);
        } else dataArray = Object.values(payload as Record<string, Category>);
      }

      // Cache the result
      cacheRef.current = { data: dataArray, timestamp: Date.now() };

      dispatch({ type: 'SET_CATEGORIES', payload: dataArray });
    } catch (err: unknown) {
      console.error("Failed to load categories", err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : "Failed to load categories" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [CACHE_TTL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const handleRefetch = () => fetchCategories(false); // Force fresh data after CRUD operations
    window.addEventListener('refetchCategories', handleRefetch);
    window.addEventListener('categoryCreated', handleRefetch);
    window.addEventListener('categoryUpdated', handleRefetch);
    window.addEventListener('categoryDeleted', handleRefetch);
    return () => {
      window.removeEventListener('refetchCategories', handleRefetch);
      window.removeEventListener('categoryCreated', handleRefetch);
      window.removeEventListener('categoryUpdated', handleRefetch);
      window.removeEventListener('categoryDeleted', handleRefetch);
    };
  }, [fetchCategories]);

  const contextValue: CategoriesContextType = {
    ...state,
    refetch: () => fetchCategories(false),
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