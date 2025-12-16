import { Metadata } from "next";
import CardCarousel from "@/components/dashboard/cards/my_cards/card_carousel";
import TransactionHistory from "@/components/dashboard/cards/transaction_history";
import RightSidebar from "@/components/dashboard/cards/right_sidebar";

export const metadata: Metadata = {
  title: "Cards | Dashboard",
  description: "Manage your cards",
};

export default function CardsPage() {
  return (
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
  );
}