"use client";

import cardService from "@/services/card_service";
import useApiData from "./use_api_data";

type CardData = {
  id: string;
  last_four: string;
  brand: string;
};

const mapCardData = (c: any): CardData => ({
  id: c.uuid ?? c.card_id ?? c.id ?? "",
  last_four: c.last_four ?? c.lastFour ?? "",
  brand: (c.brand ?? c.card_brand ?? "")?.toString() ?? "",
});

export default function useCardsData(autoFetch: boolean = true) {
  return useApiData<CardData>(cardService as Record<string, (...args: unknown[]) => Promise<unknown>>, "getCards", mapCardData, autoFetch);
}