import { Metadata } from "next";

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
      
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">No cards added yet.</p>
        </div>
      </div>
    </div>
  );
}