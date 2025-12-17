import Link from "next/link";
import { Plus } from "lucide-react";

export default function CardAdd() {
  return (
    <Link
      role="button"
      href="/dashboard/cards/add"
      scroll={false}
      tabIndex={0}
      className="min-w-[100px] h-64 rounded-2xl p-4 flex flex-col items-center justify-center transition-all duration-300 bg-card text-card-foreground hover:bg-muted hover:text-primary cursor-pointer border-2 border-dashed border-muted"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Plus className="w-7 h-7 text-primary" />
        </div>
      </div>
    </Link>
  );
}