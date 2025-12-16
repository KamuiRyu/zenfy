"use client";

import ChipIcon from "@assets/icons/chip_card_icon";
import { CardBrand } from "./card_brand";

export default function CardHeader({
  brand,
}: {
  brand?: string;
}) {
  return (
    <div className="flex justify-between items-start">
      <div className="relative w-24 h-12 opacity-90 flex items-center justify-start">
        {brand && <CardBrand brand={brand} />}
      </div>
      <div className="flex items-start gap-3">
        <div className="w-16 h-12 opacity-90 flex items-center justify-end">
          <ChipIcon className="w-full h-full text-current" />
        </div>
      </div>
    </div>
  );
}
