import { useEffect, useState, useCallback, useRef } from "react";
import { request } from "@/services/service_base";

export interface BalanceOverview {
  balance: number;
  total_income: number;
  total_expense: number;
  last_payment_amount?: number;
  last_payment_date?: string;
  monthly_stats?: Array<{
    month: string;
    total_income: number;
    total_expense: number;
  }>;
}

export default function useBalanceOverview(cardUuid?: string) {
  const [balanceOverview, setBalanceOverview] = useState<BalanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalanceOverview = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const url = `transactions/balance-overview?card_uuid=${cardUuid}`;
      const response = await request(url, "", {}, abortControllerRef.current.signal);
      
      // Handle the API response structure: { type, code, message, data: { balance, total_income, ... } }
      if (response && response.data) {
        setBalanceOverview(response.data);
      } else {
        setBalanceOverview(null);
        setError('Failed to parse balance overview data');
      }
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.message || "Failed to fetch balance overview");
    } finally {
      setLoading(false);
    }
  }, [cardUuid]);

  useEffect(() => {
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (cardUuid) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchBalanceOverview();
      }, 100);
    } else {
      setBalanceOverview(null);
      setError(null);
      setLoading(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cardUuid, fetchBalanceOverview]);

  return {
    balanceOverview,
    loading,
    error,
    refetch: fetchBalanceOverview,
  };
}