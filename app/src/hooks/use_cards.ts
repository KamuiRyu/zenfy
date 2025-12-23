"use client";

import { useCards as useCardsContext } from "@/providers/cards_provider";

export default function useCards() {
  return useCardsContext();
}
