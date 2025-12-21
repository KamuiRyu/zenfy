import { Metadata } from "next";
import dynamic from "next/dynamic";
import CardCarousel from "@/components/dashboard/cards/my_cards/card_carousel";
import RightSidebar from "@/components/dashboard/cards/right_sidebar";
import { SelectedCardProvider } from "@/providers/selected_card_provider";

const TransactionHistory = dynamic(() => import("@/components/dashboard/cards/transaction_history/transaction_history"), {
  loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg"></div>,
});

export const metadata: Metadata = {
  title: "Cards | Dashboard",
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
            <CardCarousel />
            <TransactionHistory />
          </main>

          <aside className="lg:col-span-4">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </SelectedCardProvider>
  );
}