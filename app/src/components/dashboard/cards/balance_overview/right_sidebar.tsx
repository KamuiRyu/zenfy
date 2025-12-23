import useBalanceOverview from "@/hooks/use_balance_overview";
import BalanceOverview from "@/components/dashboard/cards/balance_overview/balance_overview";
import Statistics from "@/components/dashboard/cards/balance_overview/statistics";
import { useSelectedCard } from "@/providers/selected_card_provider";

export default function RightSidebar() {
  const { selectedCardUuid } = useSelectedCard();
  const { balanceOverview, loading, error } = useBalanceOverview(selectedCardUuid ?? undefined);

  return (
    <aside className="lg:col-span-4 flex flex-col gap-4">
      <BalanceOverview
        balanceOverview={balanceOverview}
        loading={loading}
        error={error}
      />
      <Statistics
        balanceOverview={balanceOverview}
        loading={loading}
      />
    </aside>
  );
}