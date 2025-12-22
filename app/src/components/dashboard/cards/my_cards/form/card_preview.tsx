"use client";
import { format } from "date-fns";
import CardItem from "../card_item";

export default function CardPreview({
  lastFour = "",
  brand = "",
  bank = "",
  holderName = "",
  nickname = "",
  expiryDate,
}: {
  lastFour?: string;
  brand?: string;
  bank?: string;
  holderName?: string;
  nickname?: string;
  expiryDate?: Date;
}) {
  return (
    <div className="flex justify-center mb-6">
      <CardItem
        lastFour={lastFour}
        expiry={expiryDate ? format(expiryDate, "MM/yy") : ""}
        holderName={holderName}
        nickname={nickname}
        brand={brand}
        bank={bank}
        selected={true}
      />
    </div>
  );
}
