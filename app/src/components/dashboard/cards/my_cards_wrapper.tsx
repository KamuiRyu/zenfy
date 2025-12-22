"use client";

import dynamic from "next/dynamic";

const MyCards = dynamic(() => import("@/components/dashboard/cards/my_cards/card_carousel"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg"></div>,
});

export default function MyCardsWrapper() {
  return <MyCards />;
}