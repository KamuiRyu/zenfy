"use client";

import React, { useEffect, useRef, useState, useReducer } from "react";
import { usePathname, useRouter } from "next/navigation";
import cardService from "@/services/card_service";
import { toast } from "sonner";
import { useSelectedCard } from "@/providers/selected_card_provider";

type CardItem = {
  id?: string | number | null;
  lastFour: string;
  expiry: string;
  holderName?: string;
  nickname?: string;
  brand?: string | undefined;
  bank?: string;
  isDefault?: boolean;
};

type CarouselState = {
  items: CardItem[];
  loading: boolean;
  error: string | null;
  selectedIndex: number;
};

type CarouselAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: CardItem[] }
  | { type: 'SET_SELECTED_INDEX'; payload: number }
  | { type: 'RESET' };

const initialState: CarouselState = {
  items: [],
  loading: true,
  error: null,
  selectedIndex: 0,
};

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_SELECTED_INDEX':
      return { ...state, selectedIndex: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function useCards() {
  const router = useRouter();
  const { setSelectedCard } = useSelectedCard();

  const [state, dispatch] = useReducer(carouselReducer, initialState);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const [dragging, setDragging] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/dashboard/cards") {
      fetchCards();
    }
  }, [pathname]);

  function mapPayloadToItems(payload: any): CardItem[] {
    let cardsArray: any[] = [];
    if (Array.isArray(payload)) cardsArray = payload;
    else if (payload && typeof payload === "object") {
      const keys = Object.keys(payload).filter(
        (k) => String(Number(k)) === String(k)
      );
      if (keys.length) {
        keys.sort((a, b) => Number(a) - Number(b));
        cardsArray = keys.map((k) => (payload as any)[k]);
      } else cardsArray = Object.values(payload as any);
    }

    return cardsArray.map((c: any) => {
      const expiryMonth = c.expiry_month ?? c.expiryMonth ?? null;
      const expiryYear = c.expiry_year ?? c.expiryYear ?? null;
      const month = expiryMonth ? String(expiryMonth).padStart(2, "0") : "00";
      const year = expiryYear ? String(expiryYear).slice(-2) : "00";
      return {
        id: c.uuid ?? c.card_id ?? null,
        lastFour: c.last_four ?? c.lastFour ?? "",
        expiry: `${month}/${year}`,
        holderName: c.holder_name ?? c.holderName ?? c.name ?? "",
        nickname: c.nickname ?? "",
        brand: (c.brand ?? c.card_brand ?? "")?.toString(),
        bank: c.bank ?? "",
        isDefault: !!c.is_default,
      } as CardItem;
    });
  }

  async function fetchCards() {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const resp = await cardService.getCards();
      const payload =
        resp && typeof resp === "object" && "data" in resp
          ? (resp as any).data
          : resp;
      const mapped = mapPayloadToItems(payload);
      const defaultIndex = mapped.findIndex((m) => m.isDefault);
      const initialIndex = defaultIndex >= 0 ? defaultIndex : 0;
      React.startTransition(() => {
        dispatch({ type: 'SET_ITEMS', payload: mapped });
        dispatch({ type: 'SET_SELECTED_INDEX', payload: initialIndex });
        updateSelectedCard(initialIndex);
        dispatch({ type: 'SET_LOADING', payload: false });
      });
    } catch (err: any) {
      console.error("Failed to load cards", err);
      React.startTransition(() => {
        dispatch({ type: 'SET_ERROR', payload: err?.message || "Failed to load cards" });
        dispatch({ type: 'SET_LOADING', payload: false });
      });
    }
  }

  useEffect(() => {
    dispatch({ type: 'SET_SELECTED_INDEX', payload: state.items.length ? Math.min(state.selectedIndex, state.items.length - 1) : 0 });
  }, [state.items.length]);

  useEffect(() => {
    const el = itemRefs.current[state.selectedIndex + 1];
    if (el && containerRef.current) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [state.selectedIndex]);

  useEffect(() => {
    updateSelectedCard(state.selectedIndex);
  }, [state.selectedIndex, state.items]);

  function onPointerDown(e: React.PointerEvent) {
    if (!containerRef.current) return;
    isDragging.current = true;
    setDragging(true);
    startX.current = e.clientX;
    startScroll.current = containerRef.current.scrollLeft;
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !containerRef.current) return;
    const dx = e.clientX - startX.current;
    containerRef.current.scrollLeft = startScroll.current - dx;
  }

  function onPointerUp(e: React.PointerEvent) {
    isDragging.current = false;
    setDragging(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  }

  function updateSelectedCard(index: number) {
    const selectedCard = state.items[index];
    React.startTransition(() => {
      if (selectedCard && selectedCard.id) {
        setSelectedCard(selectedCard.id.toString(), selectedCard.lastFour, selectedCard.brand);
      } else {
        setSelectedCard(null, null, null);
      }
    });
  }

  function selectIndex(i: number) {
    dispatch({ type: 'SET_SELECTED_INDEX', payload: i });
  }

  function prev() {
    dispatch({ type: 'SET_SELECTED_INDEX', payload: Math.max(0, state.selectedIndex - 1) });
  }

  function next() {
    dispatch({ type: 'SET_SELECTED_INDEX', payload: Math.min(state.items.length - 1, state.selectedIndex + 1) });
  }

  async function handleDelete(id?: string | number | null) {
    if (!id) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cardService.deleteCard(String(id));

      React.startTransition(() => {
        dispatch({ type: 'SET_ITEMS', payload: state.items.filter((item) => item.id !== id) });
        dispatch({ type: 'SET_LOADING', payload: false });
      });
    } catch (err) {
      console.error("delete failed", err);
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error("Failed to delete card");
    }
  }

  function handleEdit(id?: string | number | null) {
    if (!id) return;
    router.push(`/dashboard/cards/edit/${id}`);
  }

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    selectedIndex: state.selectedIndex,
    selectIndex,
    prev,
    next,
    containerRef,
    itemRefs,
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    handleEdit,
    handleDelete,
    reload: fetchCards,
  };
}
