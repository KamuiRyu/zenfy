"use client";

import React from "react";
import { bankStylesFor } from "./bank_styles";
import CardHeader from "./card_header";
import CardNumber from "./card_number";
import CardFooter from "./card_footer";

const CardItem = React.forwardRef<
  HTMLButtonElement,
  {
    lastFour: string;
    expiry: string;
    holderName?: string;
    brand?: string;
    bank?: string;
    selected?: boolean;
    onClick?: () => void;
    isDragging?: boolean;
  }
>(
  (
    {
      lastFour,
      expiry,
      holderName,
      brand,
      bank,
      selected = false,
      onClick,
      isDragging = false,
    },
    ref
  ) => {
    const coloredBaseDefault = "bg-gray-800 text-white";

    const selectedClasses = selected ? "ring-primary/40 shadow-lg" : "opacity-60";

    const bankStyles = bankStylesFor(bank);
    const base = bankStyles?.gradient ?? coloredBaseDefault;

    const name = holderName ?? "CARD HOLDER";

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onClick?.();
        }}
        aria-pressed={selected}
        className={`min-w-[420px] h-64 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ring-4 ring-transparent ${base} ${selectedClasses} ${selected ? "scale-100" : "scale-95"}`}
        style={
          selected
            ? undefined
            : { filter: "grayscale(100%) contrast(85%) brightness(70%)", WebkitFilter: "grayscale(100%) contrast(85%) brightness(70%)" }
        }
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 pointer-events-none rounded-2xl" />
          <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 6px)" }} />

              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <CardHeader brand={brand} />
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <CardNumber lastFour={lastFour} />
                </div>

                <div>
                  <CardFooter holderName={name} expiry={expiry} />
                </div>
              </div>
        </div>
      </button>
    );
  }
);

export default CardItem;

