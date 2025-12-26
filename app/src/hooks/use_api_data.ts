"use client";

import { useEffect, useReducer, useState, useRef, useCallback } from "react";

type ApiDataState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
};

type ApiDataAction<T> =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: T[] };

function createApiDataReducer<T>() {

  return function apiDataReducer(state: ApiDataState<T>, action: ApiDataAction<T>): ApiDataState<T> {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'SET_DATA':
        return { ...state, data: action.payload };
      default:
        return state;
    }
  };
}

export default function useApiData<T>(
  service: Record<string, (...args: unknown[]) => Promise<unknown>>,
  methodName: string,
  mapper?: (item: unknown) => T,
  autoFetch: boolean = true
) {
  const reducer = createApiDataReducer<T>();
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const resp = await service[methodName]();
      const payload =
        resp && typeof resp === "object" && "data" in resp
          ? (resp as { data: unknown }).data
          : resp;

      let dataArray: unknown[] = [];
      if (Array.isArray(payload)) dataArray = payload;
      else if (payload && typeof payload === "object") {
        const keys = Object.keys(payload).filter(
          (k) => String(Number(k)) === String(k)
        );
        if (keys.length) {
          keys.sort((a, b) => Number(a) - Number(b));
          dataArray = keys.map((k) => (payload as Record<string, unknown>)[k]);
        } else dataArray = Object.values(payload as Record<string, unknown>);
      }

      const mappedData: T[] = mapper ? dataArray.map(mapper) : (dataArray as T[]);

      dispatch({ type: 'SET_DATA', payload: mappedData });
    } catch (err: unknown) {
      console.error(`Failed to load ${methodName}`, err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : `Failed to load ${methodName}` });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [service, methodName, mapper]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchData,
  };
}

export function useApiSingleData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: readonly unknown[] = [],
  autoFetch: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook para dados com filtros e paginação
export function useApiDataWithFilters<T, F = Record<string, unknown>>(
  fetchFunction: (filters?: F, limit?: number, offset?: number, signal?: AbortSignal) => Promise<T[]>,
  filters?: F,
  limit?: number,
  offset?: number,
  mounted?: boolean,
  debounceMs: number = 100
) {
  const [state, dispatch] = useReducer(createApiDataReducer<T>(), {
    data: [],
    loading: true,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const data = await fetchFunction(filters, limit, offset, abortControllerRef.current.signal);
      dispatch({ type: 'SET_DATA', payload: data });
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'CanceledError' || err.name === 'AbortError')) {
        return;
      }
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : "Failed to load data" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [filters, limit, offset, fetchFunction]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (mounted) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchData();
      }, debounceMs);
    } else if (mounted === false) {
      dispatch({ type: 'SET_DATA', payload: [] });
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
  }, [filters, limit, offset, mounted, fetchData, debounceMs]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchData,
  };
}