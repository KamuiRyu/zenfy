"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardItem from "./card_item";
import CardAdd from "./card_add";

export default function CardCarousel() {
  const items = [
    { lastFour: "4329", expiry: "09/28", brand: "MASTERCARD", bank: "nubank" },
    { lastFour: "8502", expiry: "12/29", brand: "VISA", bank: "bb" },
    { lastFour: "9285", expiry: "06/30" },
    { lastFour: "9285", expiry: "06/30" },
    { lastFour: "9285", expiry: "06/30" },
    { lastFour: "9285", expiry: "06/30" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = itemRefs.current[selectedIndex + 1];
    if (el && containerRef.current) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
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

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={prev}
          aria-label="Previous card"
          disabled={selectedIndex <= 0}
          className={`flex items-center justify-center w-11 h-11 rounded-full bg-white/90 text-gray-700 hover:bg-white focus:outline-none transition ${selectedIndex <= 0 ? "opacity-40 pointer-events-none" : ""}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={next}
        aria-label="Next card"
        disabled={selectedIndex >= items.length - 1}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full shadow-lg bg-white/90 text-gray-700 hover:bg-white focus:outline-none transition ${selectedIndex >= items.length - 1 ? "opacity-40 pointer-events-none" : ""}`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`flex gap-4 overflow-x-auto pb-2 scroll-smooth items-center ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ paddingLeft: 64, paddingRight: 56, msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <CardAdd onClick={() => alert("Add card")} />
        {items.map((it, idx) => (
          <CardItem
            key={idx}
            lastFour={it.lastFour}
            expiry={it.expiry}
            brand={it.brand}
            bank={it.bank}
            selected={idx === selectedIndex}
            isDragging={dragging}
            onClick={() => selectIndex(idx)}
            ref={(el: any) => (itemRefs.current[idx + 1] = el)}
          />
        ))}
      </div>
    </div>
  );
}
