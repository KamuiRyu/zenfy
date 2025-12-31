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

interface CacheEntry {
  data: BalanceOverview;
  timestamp: number;
}

class BalanceOverviewCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  get(key: string): BalanceOverview | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  set(key: string, data: BalanceOverview): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  invalidate(): void {
    this.cache.clear();
  }

  invalidateByCard(cardUuid?: string): void {
    if (cardUuid) {
      // Invalidate specific card cache
      const key = `balance_overview_${cardUuid}`;
      this.cache.delete(key);
    } else {
      // Invalidate all balance overview cache
      Array.from(this.cache.keys())
        .filter(key => key.startsWith('balance_overview_'))
        .forEach(key => this.cache.delete(key));
    }
  }
}

const balanceCache = new BalanceOverviewCache();

export default function useBalanceOverview(cardUuid?: string) {
  const [balanceOverview, setBalanceOverview] = useState<BalanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cacheKey = `balance_overview_${cardUuid || 'all'}`;

  const fetchBalanceOverview = useCallback(async (useCache: boolean = true) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Try cache first
      if (useCache) {
        const cachedData = balanceCache.get(cacheKey);
        if (cachedData) {
          setBalanceOverview(cachedData);
          setFromCache(true);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);
      setFromCache(false);

      const url = cardUuid ? `transactions/balance-overview?card_uuid=${cardUuid}` : 'transactions/balance-overview';
      const response = await request(url, "", {}, abortControllerRef.current.signal);
      
      if (response && response.data) {
        const data = response.data as BalanceOverview;
        setBalanceOverview(data);
        balanceCache.set(cacheKey, data);
      } else {
        setBalanceOverview(null);
        setError('Failed to parse balance overview data');
      }
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'CanceledError' || err.name === 'AbortError')) {
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to fetch balance overview");
    } finally {
      setLoading(false);
    }
  }, [cardUuid, cacheKey]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchBalanceOverview();
    }, 100);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cardUuid, fetchBalanceOverview]);

  // Listen for transaction changes to invalidate cache
  useEffect(() => {
    const handleTransactionChange = () => {
      balanceCache.invalidateByCard(cardUuid);
      fetchBalanceOverview(false); // Force fresh fetch
    };

    window.addEventListener('transactionUpdated', handleTransactionChange);
    window.addEventListener('transactionCreated', handleTransactionChange);
    window.addEventListener('transactionDeleted', handleTransactionChange);

    return () => {
      window.removeEventListener('transactionUpdated', handleTransactionChange);
      window.removeEventListener('transactionCreated', handleTransactionChange);
      window.removeEventListener('transactionDeleted', handleTransactionChange);
    };
  }, [cardUuid, fetchBalanceOverview]);

  const refetch = useCallback(() => {
    balanceCache.invalidateByCard(cardUuid);
    fetchBalanceOverview(false);
  }, [cardUuid, fetchBalanceOverview]);

  return {
    balanceOverview,
    loading,
    error,
    fromCache,
    refetch,
  };
}