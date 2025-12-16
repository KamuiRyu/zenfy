"use client";

import React, { useEffect, useRef, useState } from "react";
import CardItem from "./card_item";

export default function CardCarousel() {
  const items = [
    { lastFour: "4329", expiry: "09/28", brand: "MASTERCARD", bank: "nubank" },
    { lastFour: "8502", expiry: "12/29", brand: "VISA", bank: "bb" },
    { lastFour: "9285", expiry: "06/30" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el && containerRef.current) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedIndex]);

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
      <div className="absolute right-0 top-0 flex gap-2 -translate-y-3">
        <button onClick={prev} aria-label="Previous card" className="p-2 bg-white rounded-md shadow">‹</button>
        <button onClick={next} aria-label="Next card" className="p-2 bg-white rounded-md shadow">›</button>
      </div>

      <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
        {items.map((it, idx) => (
          <CardItem
            key={idx}
            lastFour={it.lastFour}
            expiry={it.expiry}
            brand={it.brand}
            bank={it.bank}
            selected={idx === selectedIndex}
            onClick={() => selectIndex(idx)}
            ref={(el: any) => (itemRefs.current[idx] = el)}
          />
        ))}
      </div>
    </div>
  );
}
