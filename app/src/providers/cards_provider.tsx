"use client";

import React, { createContext, useContext, useEffect, useReducer, ReactNode, useRef } from "react";
import cardService from "@/services/card_service";
import { CardType } from "@/types/cards";

type Card = {
  id?: string | number | null;
  lastFour: string;
  expiry: string;
  holderName?: string;
  nickname?: string;
  brand?: string | undefined;
  bank?: string;
  isDefault?: boolean;
  cardType?: string;
};

type CardsState = {
  cards: Card[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
};

type CardsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CARDS'; payload: Card[]; fromCache?: boolean };

const initialState: CardsState = {
  cards: [],
  loading: true,
  error: null,
  fromCache: false,
};

function cardsReducer(state: CardsState, action: CardsAction): CardsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, fromCache: false };
    case 'SET_CARDS':
      return {
        ...state,
        cards: action.payload,
        fromCache: action.fromCache || false
      };
    default:
      return state;
  }
}

type CardsContextType = CardsState & {
  refetch: () => void;
};

const CardsContext = createContext<CardsContextType | undefined>(undefined);

export function CardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cardsReducer, initialState);
  const cacheRef = useRef<{ data: Card[], timestamp: number } | null>(null);
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  const fetchCards = async (useCache: boolean = true) => {
    // Try cache first
    if (useCache && cacheRef.current && Date.now() - cacheRef.current.timestamp < CACHE_TTL) {
      dispatch({ type: 'SET_CARDS', payload: cacheRef.current.data, fromCache: true });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const resp = await cardService.getCards();
      const payload = resp && typeof resp === "object" && "data" in resp ? resp.data : resp;
      let dataArray: CardType[] = [];
      if (Array.isArray(payload)) dataArray = payload as CardType[];
      else if (payload && typeof payload === "object") {
        const keys = Object.keys(payload).filter((k) => String(Number(k)) === String(k));
        if (keys.length) {
          keys.sort((a, b) => Number(a) - Number(b));
          dataArray = keys.map((k) => (payload as Record<string, CardType>)[k]);
        } else dataArray = Object.values(payload as Record<string, CardType>);
      }
      const mappedCards = dataArray.map((c: CardType) => ({
        id: c.uuid ?? c.card_id ?? null,
        lastFour: c.last_four ?? c.lastFour ?? "",
        expiry: (() => {
          const expiryMonth = c.expiry_month ?? null;
          const expiryYear = c.expiry_year?? null;
          const month = expiryMonth ? String(expiryMonth).padStart(2, "0") : "00";
          const year = expiryYear ? String(expiryYear).slice(-2) : "00";
          return `${month}/${year}`;
        })(),
        holderName: c.holder_name ?? "",
        nickname: c.nickname ?? "",
        brand: c.brand ?? "",
        bank: c.bank ?? "",
        isDefault: c.is_default ?? false,
        cardType: c.card_type ?? "",
        
      }));

      // Cache the result
      cacheRef.current = { data: mappedCards, timestamp: Date.now() };

      dispatch({ type: 'SET_CARDS', payload: mappedCards });
    } catch (err: unknown) {
      console.error("Failed to load cards", err);
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : "Failed to load cards" });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const handleRefetch = () => fetchCards(false); // Force fresh data after CRUD operations
    window.addEventListener('refetchCards', handleRefetch);
    return () => window.removeEventListener('refetchCards', handleRefetch);
  }, []);

  const contextValue: CardsContextType = {
    ...state,
    refetch: () => fetchCards(false),
  };

  return (
    <CardsContext.Provider value={contextValue}>
      {children}
    </CardsContext.Provider>
  );
}

export function useCards() {
  const context = useContext(CardsContext);
  if (context === undefined) {
    throw new Error("useCards must be used within a CardsProvider");
  }
  return context;
}