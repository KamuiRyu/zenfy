"use client";

import ChipIcon from "@assets/icons/chip_card_icon";
import { CardBrand } from "./card_brand";

export default function CardHeader({ brand, bank }: { brand?: string; bank?: string }) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-6">{brand && <CardBrand brand={brand} />}</div>
      </div>

      <div className="w-12 h-8 opacity-90 flex items-center justify-end">
        <ChipIcon className="w-full h-full text-current" />
      </div>
    </div>
  );
}
