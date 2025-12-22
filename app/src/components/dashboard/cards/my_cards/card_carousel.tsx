"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CardItem from "./card_item";
import CardAdd from "./card_add";
import { Skeleton } from "@ui/skeleton";
import useCards from "@/hooks/use_cards";
import { useI18n } from "@/i18n/useI18n";

export default function CardCarousel() {
  const {
    items,
    loading,
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
  } = useCards();
    const { t } = useI18n();


  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={prev}
          aria-label={t('dashboard.cards.previous_card')}
          disabled={selectedIndex <= 0}
          className={`flex items-center justify-center w-11 h-11 rounded-full border border-muted bg-card text-card-foreground hover:bg-muted hover:text-primary focus:outline-none transition-colors duration-300 ${
            selectedIndex <= 0 ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={next}
        aria-label={t('dashboard.cards.next_card')}
        disabled={selectedIndex >= items.length - 1}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full border border-muted bg-card text-card-foreground hover:bg-muted hover:text-primary focus:outline-none transition-colors duration-300 ${
          selectedIndex >= items.length - 1
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
        className={`flex gap-4 overflow-x-auto pb-2 scroll-smooth items-center ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          paddingLeft: 64,
          paddingRight: 56,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <CardAdd  />

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
          : items.map((it, idx) => (
              <CardItem
                key={idx}
                lastFour={it.lastFour}
                expiry={it.expiry}
                holderName={it.holderName}
                nickname={it.nickname}
                brand={it.brand}
                bank={it.bank}
                selected={idx === selectedIndex}
                isDragging={dragging}
                onClick={() => selectIndex(idx)}
                onEdit={() => handleEdit(it.id)}
                onDelete={() => handleDelete(it.id)}
                ref={(el: any) => (itemRefs.current[idx + 1] = el)}
              />
            ))}
      </div>
    </div>
  );
}
