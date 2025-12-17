"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import cardService from "@/services/card_service";
import { toast } from "sonner";

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

export default function useCardsCarousel() {
  const router = useRouter();

  const [items, setItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

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
        id: c.id ?? c.card_id ?? null,
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
    setError(null);
    try {
      const resp = await cardService.getCards();
      const payload =
        resp && typeof resp === "object" && "data" in resp
          ? (resp as any).data
          : resp;
      const mapped = mapPayloadToItems(payload);
      const defaultIndex = mapped.findIndex((m) => m.isDefault);
      React.startTransition(() => {
        setItems(mapped);
        setSelectedIndex(defaultIndex >= 0 ? defaultIndex : 0);
        setLoading(false);
      });
    } catch (err: any) {
      console.error("Failed to load cards", err);
      React.startTransition(() => {
        setError(err?.message || "Failed to load cards");
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    let mounted = true;
    if (!mounted) return;
    fetchCards();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedIndex((s) => (items.length ? Math.min(s, items.length - 1) : 0));
  }, [items.length]);

  useEffect(() => {
    const el = itemRefs.current[selectedIndex + 1];
    if (el && containerRef.current) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

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

  function selectIndex(i: number) {
    setSelectedIndex(i);
  }

  function prev() {
    setSelectedIndex((s) => Math.max(0, s - 1));
  }

  function next() {
    setSelectedIndex((s) => Math.min(items.length - 1, s + 1));
  }

  async function handleDelete(id?: string | number | null) {
    if (!id) return;
    setLoading(true);
    try {
      await cardService.deleteCard(String(id));

      React.startTransition(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setLoading(false);
      });
    } catch (err) {
      console.error("delete failed", err);
      setLoading(false);
      toast.error("Failed to delete card");
    }
  }

  function handleEdit(id?: string | number | null) {
    if (!id) return;
    router.push(`/dashboard/cards/edit/${id}`);
  }

  return {
    items,
    loading,
    error,
    selectedIndex,
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
