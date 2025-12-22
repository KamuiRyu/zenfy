import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TransactionHistoryHeaderProps {
  title: string;
  onRefresh?: () => void;
  countdown?: number | null;
}

export default function TransactionHistoryHeader({ title, onRefresh, countdown }: TransactionHistoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
      {onRefresh && (
        <Button variant="outline" size="sm" onClick={onRefresh}>
          {countdown !== null ? countdown : <RefreshCw className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}