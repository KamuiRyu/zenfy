"use client";
import AddTransactionDialog from "@/components/dashboard/transactions/add/add_transaction_dialog";
import { useSelectedCard } from "@/providers/selected_card_provider";

export default function AddTransactionModal() {
  const { selectedCardUuid } = useSelectedCard()

  return <AddTransactionDialog preSelectedCard={selectedCardUuid || undefined} />;
}