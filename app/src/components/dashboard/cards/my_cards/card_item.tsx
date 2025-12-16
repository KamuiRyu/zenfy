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
        onClick={onClick}
        aria-pressed={selected}
        className={`min-w-[300px] h-48 rounded-2xl p-6 flex flex-col justify-between transition-all duration-150 ring-4 ring-transparent ${base} ${selectedClasses}`}
        style={
          selected
            ? undefined
            : { filter: "grayscale(100%) contrast(85%) brightness(80%)", WebkitFilter: "grayscale(100%) contrast(85%) brightness(80%)" }
        }
      >
        <CardHeader brand={brand} bank={bank} />
        <CardNumber lastFour={lastFour} />
        <CardFooter holderName={name} expiry={expiry} />
      </button>
    );
  }
);

export default CardItem;

