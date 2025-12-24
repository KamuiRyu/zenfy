import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/useI18n";
import { RefreshCw, Plus } from "lucide-react";

interface TransactionHistoryHeaderProps {
  title: string;
  onRefresh?: () => void;
  onAdd?: () => void;
  countdown?: number | null;
  loading?: boolean;
}

export default function TransactionHistoryHeader({ title, onRefresh, onAdd, countdown, loading }: TransactionHistoryHeaderProps) {

  const { t } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
      <div className="flex gap-2">
        {onAdd && (
          loading ? (
            <div className="h-9 w-32 bg-muted animate-pulse rounded" />
          ) : (
            <Button variant="default" size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              {t("dashboard.transaction_history.add_transaction")}
            </Button>
          )
        )}
        {onRefresh && (
          loading ? (
            <div className="h-9 w-9 bg-muted animate-pulse rounded" />
          ) : (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              {countdown !== null ? countdown : <RefreshCw className="h-4 w-4" />}
            </Button>
          )
        )}
      </div>
    </div>
  );
}