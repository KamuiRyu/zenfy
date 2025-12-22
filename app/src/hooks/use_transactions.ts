"use client";

import { useEffect, useReducer } from "react";
import transactionService from "@/services/transaction_service";

type Transaction = {
  uuid: string;
  card_uuid: string;
  user_uuid: string;
  category_uuid: string;
  category?: {
    uuid: string;
    user_id?: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };
  amount: number;
  currency: string;
  type: string;
  merchant?: string;
  description?: string;
  metadata?: Record<string, any>;
  occurred_at: string;
  created_at: string;
  updated_at: string;
  is_recurring: boolean;
  recurrence_type?: string;
  recurrence_interval?: number;
  recurrence_end_date?: string;
  is_installment: boolean;
  installment_number?: number;
  total_installments?: number;
  original_transaction_id?: number;
};

type TransactionsState = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
};

type TransactionFilters = {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
  type?: string;
  cardUuid?: string;
  search?: string;
};

type TransactionsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] };

const initialState: TransactionsState = {
  transactions: [],
  loading: true,
  error: null,
};

function transactionsReducer(state: TransactionsState, action: TransactionsAction): TransactionsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    default:
      return state;
  }
}

export default function useTransactions(limit?: number, offset?: number, filters?: TransactionFilters, mounted?: boolean) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);

  useEffect(() => {
    if (mounted && filters?.cardUuid) {
      fetchTransactions();
    } else if (mounted) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      dispatch({ type: 'SET_LOADING', payload: true });
    }
  }, [filters, limit, offset, mounted]);

  async function fetchTransactions() {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params: any = {};
      if (limit) params.limit = limit;
      if (offset) params.offset = offset;
      if (filters?.dateFrom) params.date_from = filters.dateFrom;
      if (filters?.dateTo) params.date_to = filters.dateTo;
      if (filters?.categoryId) params.category_id = filters.categoryId;
      if (filters?.type) params.type = filters.type;
      if (filters?.cardUuid) params.card_uuid = filters.cardUuid;
      if (filters?.search) params.search = filters.search;

      const resp = await transactionService.getTransactions(params.limit, params.offset, params.card_uuid, params.date_from, params.date_to, params.category_id, params.type, params.search);
      const payload =
        resp && typeof resp === "object" && "data" in resp
          ? (resp as any).data
          : resp;

      let transactionsArray: any[] = [];
      if (Array.isArray(payload)) transactionsArray = payload;
      else if (payload && typeof payload === "object") {
        const keys = Object.keys(payload).filter(
          (k) => String(Number(k)) === String(k)
        );
        if (keys.length) {
          keys.sort((a, b) => Number(a) - Number(b));
          transactionsArray = keys.map((k) => (payload as any)[k]);
        } else transactionsArray = Object.values(payload as any);
      }

      dispatch({ type: 'SET_TRANSACTIONS', payload: transactionsArray });
    } catch (err: any) {
      console.error("Failed to load transactions", err);
      dispatch({ type: 'SET_ERROR', payload: err?.message || "Failed to load transactions" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  return {
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    refetch: fetchTransactions,
  };
}