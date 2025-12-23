import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface TransactionHistoryHeaderProps {
  title: string;
  onRefresh?: () => void;
  onAdd?: () => void;
  countdown?: number | null;
}

export default function TransactionHistoryHeader({ title, onRefresh, onAdd, countdown }: TransactionHistoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
      <div className="flex gap-2">
        {onAdd && (
          <Button variant="default" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        )}
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            {countdown !== null ? countdown : <RefreshCw className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}