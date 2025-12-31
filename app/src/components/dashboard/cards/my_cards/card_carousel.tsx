"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardItem from "./card_item";
import CardAdd from "./card_add";
import { Skeleton } from "@ui/skeleton";
import useCards from "@/hooks/use_cards";
import { useI18n } from "@/i18n/useI18n";
import { useSelectedCard } from "@/providers/selected_card_provider";
import { useRouter } from "next/navigation";
import cardService from "@/services/card_service";

export default function CardCarousel() {
  const { cards, loading, fromCache } = useCards();
  const { setSelectedCard } = useSelectedCard();
  const router = useRouter();
  const { t } = useI18n();

  const [selectedCardId, setSelectedCardId] = useState<string | number | null>(
    null
  );
  const [dragging, setDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const selectedIndex = useMemo(() => {
    if (cards.length === 0) return 0;

    if (selectedCardId !== null) {
      const index = cards.findIndex((card) => card.id === selectedCardId);
      if (index !== -1) return index;
    }

    return 0;
  }, [cards, selectedCardId]);

  const hasSetDefault = useRef(false);
  useEffect(() => {
    const hasValidSelection = selectedCardId !== null && cards.some(card => card.id === selectedCardId);
    
    if (cards.length > 0 && !loading && (!hasValidSelection || !hasSetDefault.current)) {
      const defaultCard = cards.find((card) => card.isDefault) || cards[0];
      if (defaultCard && (!hasValidSelection || defaultCard.id !== selectedCardId)) {
        setTimeout(() => {
          setSelectedCardId(defaultCard.id ?? null);
          setSelectedCard(defaultCard.id ? String(defaultCard.id) : null, defaultCard.lastFour, defaultCard.brand);
        }, 0);
        hasSetDefault.current = true;
      }
    }
  }, [cards, loading, setSelectedCard, selectedCardId]);


  const selectIndex = useCallback(
    (index: number) => {
      const item = cards[index];
      if (item) {
        setSelectedCardId(item.id ?? null);
        setSelectedCard(item.id ? String(item.id) : null, item.lastFour, item.brand);
      }
    },
    [cards, setSelectedCard]
  );

  const prev = () => {
    if (selectedIndex > 0) {
      selectIndex(selectedIndex - 1);
    }
  };

  const next = () => {
    if (selectedIndex < cards.length - 1) {
      selectIndex(selectedIndex + 1);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    startX.current = e.clientX;
    startScroll.current = containerRef.current?.scrollLeft || 0;
    setDragging(false);
    setIsPressed(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPressed || !containerRef.current) return;
    const deltaX = e.clientX - startX.current;
    if (Math.abs(deltaX) > 5) {
      isDragging.current = true;
      setDragging(true);
      containerRef.current.scrollLeft = startScroll.current - deltaX;
    }
  };

  const onPointerUp = () => {
    setIsPressed(false);
    if (isDragging.current) {
      setDragging(false);
    }
  };

  const handleEdit = (id?: string | number | null) => {
    if (!id) return;
    router.push(`/dashboard/cards/edit/${id}`);
  };

  const handleDelete = async (id?: string | number | null) => {
    if (!id) return;
    try {
      await cardService.deleteCard(String(id));
      if (id === selectedCardId) {
        setSelectedCardId(null);
      }
      window.dispatchEvent(new Event("refetchCards"));
    } catch {}
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={prev}
          aria-label={t("dashboard.cards.previous_card")}
          disabled={selectedIndex <= 0 || loading || fromCache}
          className={`flex items-center justify-center w-11 h-11 rounded-full border border-muted bg-card text-card-foreground hover: bg-muted hover:text-primary focus:outline-none transition-colors duration-300 ${
            selectedIndex <= 0 || loading || fromCache ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={next}
        aria-label={t("dashboard.cards.next_card")}
        disabled={selectedIndex >= cards.length - 1 || loading || fromCache}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full border border-muted bg-card text-card-foreground hover:bg-muted hover:text-primary focus:outline-none transition-colors duration-300 ${
          selectedIndex >= cards.length - 1 || loading || fromCache
            ? "opacity-40 pointer-events-none"
            : ""
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        className={`flex gap-4 overflow-x-auto pb-2 scroll-smooth items-center ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        } ${isPressed ? "select-none" : ""}`}
        style={{
          paddingLeft: 64,
          paddingRight: 56,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <CardAdd />

        {loading
          ? [0, 1, 2].map((i) => (
              <div
                key={i}
                className="min-w-[420px] h-64 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 bg-card text-card-foreground border-2 border-muted"
              >
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 6px)",
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="w-10 h-6 rounded-md" />
                        <Skeleton className="w-8 h-6 rounded-md" />
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                      <Skeleton className="h-8 w-64 rounded-md" />
                    </div>

                    <div>
                      <div className="flex items-end justify-between">
                        <div>
                          <Skeleton className="w-20 h-3 rounded-md mb-2" />
                          <Skeleton className="w-28 h-4 rounded-md" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="w-10 h-3 rounded-md mb-2" />
                          <Skeleton className="w-12 h-4 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : cards.map((it, idx) => (
              <CardItem
                key={it.id ?? idx}
                lastFour={it.lastFour}
                expiry={it.expiry}
                holderName={it.holderName}
                nickname={it.nickname}
                brand={it.brand}
                bank={it.bank}
                selected={idx === selectedIndex}
                isDragging={dragging}
                onClick={() => !isPressed && selectIndex(idx)}
                onEdit={() => handleEdit(it.id)}
                onDelete={() => handleDelete(it.id)}
                disabled={loading || fromCache}
                ref={(el) => {
                  itemRefs.current[idx + 1] = el;
                }}
              />
            ))}
      </div>
    </div>
  );
}
