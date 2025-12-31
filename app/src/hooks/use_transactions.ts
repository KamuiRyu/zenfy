"use client";

import { useEffect, useReducer, useRef, useCallback } from "react";
import transactionService from "@/services/transaction_service";
import { TransactionFiltersAPI, TransactionFiltersType, TransactionType } from "@/types/transactions";

interface CacheEntry {
  data: TransactionType[];
  timestamp: number;
  filters: TransactionFiltersType;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxEntries: number;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxEntries: 10,
};

class TransactionCache {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config;
    this.loadFromStorage();
  }

  private getCacheKey(filters: TransactionFiltersType, limit?: number, offset?: number): string {
    const filterStr = JSON.stringify({
      ...filters,
      limit,
      offset,
    });
    return btoa(filterStr); // Base64 encode for safe storage
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('transaction_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only load entries that haven't expired
        const now = Date.now();
        Object.entries(parsed).forEach(([key, entry]: [string, any]) => {
          if (now - entry.timestamp < this.config.ttl) {
            this.cache.set(key, entry);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load transaction cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clean expired entries before saving
      this.cleanExpired();

      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem('transaction_cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save transaction cache to storage:', error);
    }
  }

  private cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private enforceMaxEntries(): void {
    if (this.cache.size > this.config.maxEntries) {
      // Remove oldest entries (simple FIFO)
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      const toRemove = entries.slice(0, this.cache.size - this.config.maxEntries);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  get(filters: TransactionFiltersType, limit?: number, offset?: number): TransactionType[] | null {
    const key = this.getCacheKey(filters, limit, offset);
    const entry = this.cache.get(key);

    if (entry && Date.now() - entry.timestamp < this.config.ttl) {
      return entry.data;
    }

    // Remove expired entry
    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  set(filters: TransactionFiltersType, limit: number | undefined, offset: number | undefined, data: TransactionType[]): void {
    const key = this.getCacheKey(filters, limit, offset);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      filters: { ...filters },
    };

    this.cache.set(key, entry);
    this.enforceMaxEntries();
    this.saveToStorage();
  }

  invalidate(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('transaction_cache');
    }
  }

  // Invalidate cache for specific filters pattern
  invalidatePattern(pattern: Partial<TransactionFiltersType>): void {
    for (const [key, entry] of this.cache.entries()) {
      const matches = Object.entries(pattern).every(([k, v]) => {
        const filterKey = k as keyof TransactionFiltersType;
        return entry.filters[filterKey] === v;
      });

      if (matches) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }
}

// Global cache instance
const transactionCache = new TransactionCache();

type TransactionsState = {
  transactions: TransactionType[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
};

type TransactionsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: TransactionType[]; fromCache?: boolean };

const initialState: TransactionsState = {
  transactions: [],
  loading: true,
  error: null,
  fromCache: false,
};

function transactionsReducer(state: TransactionsState, action: TransactionsAction): TransactionsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, fromCache: false };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        fromCache: action.fromCache || false
      };
    default:
      return state;
  }
}

export default function useTransactions(limit?: number, offset?: number, filters?: TransactionFiltersType, mounted?: boolean) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTransactions = useCallback(async (useCache: boolean = true) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    dispatch({ type: 'SET_ERROR', payload: null });

    // Try to get from cache first
    if (useCache && filters) {
      const cachedData = transactionCache.get(filters, limit, offset);
      if (cachedData) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: cachedData, fromCache: true });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const params: TransactionFiltersAPI = {};
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      if (filters?.dateFrom) params.date_from = filters.dateFrom;
      if (filters?.dateTo) params.date_to = filters.dateTo;
      if (filters?.categoryId) params.category_id = filters.categoryId;
      if (filters?.type) params.type = filters.type;
      if (filters?.recurring) params.recurring = filters.recurring;
      if (filters?.kind) params.kind = filters.kind;
      if (filters?.cardUuid) params.card_uuid = filters.cardUuid;
      if (filters?.search) params.search = filters.search;

      const resp = await transactionService.getTransactions(params.limit, params.offset, params.card_uuid, params.date_from, params.date_to, params.category_id, params.type, params.search, params.kind, params.recurring, abortControllerRef.current.signal);

      const payload =
        resp && typeof resp === "object" && "data" in resp
          ? (resp as { data: unknown }).data
          : resp;

      let transactionsArray: unknown[] = [];
      if (Array.isArray(payload)) transactionsArray = payload;
      else if (payload && typeof payload === "object") {
        const keys = Object.keys(payload).filter(
          (k) => String(Number(k)) === String(k)
        );
        if (keys.length) {
          keys.sort((a, b) => Number(a) - Number(b));
          transactionsArray = keys.map((k) => (payload as Record<string, unknown>)[k]);
        } else transactionsArray = Object.values(payload as Record<string, unknown>);
      }

      const transactions = transactionsArray as TransactionType[];

      // Cache the result
      if (filters) {
        transactionCache.set(filters, limit, offset, transactions);
      }

      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'CanceledError' || err.name === 'AbortError')) {
        return;
      }
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : "Failed to load transactions" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [limit, offset, filters]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (mounted) {
      // Set loading to true immediately when filters change
      dispatch({ type: 'SET_LOADING', payload: true });

      debounceTimeoutRef.current = setTimeout(() => {
        fetchTransactions();
      }, 100);
    } else {
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, limit, offset, mounted, fetchTransactions]);

  const refetch = useCallback(() => {
    // Clear cache for current filters
    if (filters) {
      transactionCache.invalidatePattern(filters);
    }
    fetchTransactions(false); // Force fresh fetch
  }, [filters, fetchTransactions]);

  const invalidateCache = useCallback(() => {
    transactionCache.invalidate();
  }, []);

  return {
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    fromCache: state.fromCache,
    refetch,
    invalidateCache,
  };
}