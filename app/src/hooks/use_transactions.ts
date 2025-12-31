"use client";

import { useEffect, useReducer, useRef, useCallback } from "react";
import transactionService from "@/services/transaction_service";
import { TransactionFiltersAPI, TransactionFiltersType, TransactionType } from "@/types/transactions";

type TransactionsState = {
  transactions: TransactionType[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  total: number;
  hasMore: boolean;
};

type TransactionsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: TransactionType[]; total?: number; hasMore?: boolean; fromCache?: boolean };

const initialState: TransactionsState = {
  transactions: [],
  loading: true,
  error: null,
  fromCache: false,
  total: 0,
  hasMore: false,
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
        total: action.total || 0,
        hasMore: action.hasMore || false,
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
  const cacheRef = useRef<Map<string, { data: TransactionType[], timestamp: number }>>(new Map());
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  const getCacheKey = useCallback((filters?: TransactionFiltersType, limit?: number, offset?: number): string => {
    const filterStr = JSON.stringify({
      ...filters,
      limit,
      offset,
    });
    return btoa(filterStr); // Base64 encode for safe storage
  }, []);

  const fetchTransactions = useCallback(async (useCache: boolean = true) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    dispatch({ type: 'SET_ERROR', payload: null });

    // Try cache first
    const cacheKey = getCacheKey(filters, limit, offset);
    const cachedEntry = cacheRef.current.get(cacheKey);
    if (useCache && cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: cachedEntry.data, fromCache: true });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
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
      let total = 0;
      let hasMore = false;

      if (payload && typeof payload === "object" && "data" in payload) {
        // Paginated response
        const paginated = payload as { data: unknown[]; total: number; has_more: boolean };
        transactionsArray = paginated.data;
        total = paginated.total;
        hasMore = paginated.has_more;
      } else if (Array.isArray(payload)) {
        // Legacy array response
        transactionsArray = payload;
        hasMore = transactionsArray.length === limit;
      } else if (payload && typeof payload === "object") {
        // Object response
        const keys = Object.keys(payload).filter(
          (k) => String(Number(k)) === String(k)
        );
        if (keys.length) {
          keys.sort((a, b) => Number(a) - Number(b));
          transactionsArray = keys.map((k) => (payload as Record<string, unknown>)[k]);
        } else {
          transactionsArray = Object.values(payload as Record<string, unknown>);
        }
        hasMore = transactionsArray.length === limit;
      }

      const transactions = transactionsArray as TransactionType[];

      // Cache the result
      cacheRef.current.set(cacheKey, { data: transactions, timestamp: Date.now() });

      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions, total, hasMore });
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'CanceledError' || err.name === 'AbortError')) {
        return;
      }
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : "Failed to load transactions" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [limit, offset, filters, CACHE_TTL, getCacheKey]);

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

  useEffect(() => {
    const handleRefetch = () => fetchTransactions(false);
    window.addEventListener('transactionCreated', handleRefetch);
    window.addEventListener('transactionUpdated', handleRefetch);
    window.addEventListener('transactionDeleted', handleRefetch);
    return () => {
      window.removeEventListener('transactionCreated', handleRefetch);
      window.removeEventListener('transactionUpdated', handleRefetch);
      window.removeEventListener('transactionDeleted', handleRefetch);
    };
  }, [fetchTransactions]);

  const refetch = useCallback(() => {
    const cacheKey = getCacheKey(filters, limit, offset);
    cacheRef.current.delete(cacheKey);
    fetchTransactions(false); 
  }, [filters, limit, offset, getCacheKey, fetchTransactions]);

  return {
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    fromCache: state.fromCache,
    total: state.total,
    hasMore: state.hasMore,
    refetch,
  };
}