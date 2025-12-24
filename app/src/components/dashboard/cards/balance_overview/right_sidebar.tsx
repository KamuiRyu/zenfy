import useBalanceOverview from "@/hooks/use_balance_overview";
import BalanceOverview from "@/components/dashboard/cards/balance_overview/balance_overview";
import Statistics from "@/components/dashboard/cards/balance_overview/statistics";
import { useSelectedCard } from "@/providers/selected_card_provider";
import useCards from "@/hooks/use_cards";
import { useI18n } from "@/i18n/useI18n";

export default function RightSidebar() {
  const { t } = useI18n();
  const { selectedCardUuid } = useSelectedCard();
  const { cards, loading: cardsLoading } = useCards();
  const { balanceOverview, loading, error } = useBalanceOverview(selectedCardUuid ?? undefined);

  if (cardsLoading) {
    return (
      <aside className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-md font-medium uppercase tracking-wide">
                {t('dashboard.balance_overview.title')}
              </h3>
            </div>
            <div className="text-center text-muted-foreground">
              {t('dashboard.cards.loading_cards')}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (cards.length === 0) {
    return (
      <aside className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-md font-medium uppercase tracking-wide">
                {t('dashboard.balance_overview.title')}
              </h3>
            </div>
            <div className="text-center text-muted-foreground">
              {t('dashboard.balance_overview.no_cards')}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (!selectedCardUuid) {
    return (
      <aside className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-md font-medium uppercase tracking-wide">
                {t('dashboard.balance_overview.title')}
              </h3>
            </div>
            <div className="text-center text-muted-foreground">
              {t('dashboard.balance_overview.select_card')}
            </div>
          </div>
        </div>
      </aside>
    );
  }

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