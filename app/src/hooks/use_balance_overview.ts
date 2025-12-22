import { useEffect, useState, useCallback, useRef } from "react";
import { request } from "@/services/service_base";

interface BalanceOverview {
  balance: number;
  total_income: number;
  total_expense: number;
  last_payment_amount?: number;
  last_payment_date?: string;
  statistics?: any;
}

export default function useBalanceOverview(cardUuid?: string) {
  const [balanceOverview, setBalanceOverview] = useState<BalanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBalanceOverview = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const url = `transactions/balance-overview?card_uuid=${cardUuid}`;
      const response = await request(url, "", {
        signal: abortControllerRef.current.signal,
      });
      if (response && response.data) {
        setBalanceOverview(response.data);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || "Failed to fetch balance overview");
      }
    } finally {
      setLoading(false);
    }
  }, [cardUuid]);

  useEffect(() => {
    if (cardUuid) {
      fetchBalanceOverview();
    } else {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setBalanceOverview(null);
      setError(null);
    }

    // Cleanup on unmount or cardUuid change
    return () => {
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