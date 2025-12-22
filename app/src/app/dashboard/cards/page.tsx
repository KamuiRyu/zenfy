import { Metadata } from "next";
import RightSidebar from "@/components/dashboard/cards/right_sidebar";
import { SelectedCardProvider } from "@/providers/selected_card_provider";
import TransactionHistoryWrapper from "@/components/dashboard/cards/transaction_history_wrapper";
import MyCardsWrapper from "@/components/dashboard/cards/my_cards_wrapper";

export const metadata: Metadata = {
  title: "My cards - Zenfy",
  description: "Manage your cards",
};

export default function CardsPage() {
  return (
    <SelectedCardProvider>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Cards</h1>
          <p className="text-muted-foreground mt-1">Manage your payment cards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <main className="lg:col-span-8 space-y-6">
            <MyCardsWrapper />
            <TransactionHistoryWrapper />
          </main>

          <aside className="lg:col-span-4">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </SelectedCardProvider>
  );
}