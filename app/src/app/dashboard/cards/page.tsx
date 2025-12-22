import { Metadata } from "next";
import CardsWrapper from "@/components/dashboard/cards/my_cards/cards_wrapper";

export const metadata: Metadata = {
  title: "My cards - Zenfy",
  description: "Manage your cards",
};

export default function CardsPage() {
  return (
    <CardsWrapper/>
  );
}