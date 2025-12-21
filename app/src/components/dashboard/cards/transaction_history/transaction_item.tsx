import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import { CardBrand } from "../my_cards/card_brand";

const TransactionItem = React.memo(function TransactionItem({
  title,
  subtitle,
  time,
  amount,
  kind,
  status = "Success",
  icon,
  categoryColor,
  selectedCardLastFour,
  selectedCardBrand,
}: {
  title: string;
  subtitle?: string;
  time?: string;
  card?: string;
  amount: string;
  kind?: string;
  status?: "Success" | "Failed" | "Pending";
  icon?: string;
  categoryColor?: string;
  selectedCardLastFour?: string | null;
  selectedCardBrand?: string | null;
}) {
  const isIncome = kind === "income";
  const amountColor = isIncome ? "text-green-600" : "text-card-foreground";

  const transactionIcon = React.useMemo(() => {
    if (icon) {
      const iconName = `fa${icon.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
      const IconComponent = (SolidIcons as any)[iconName];
      if (IconComponent) {
        return <FontAwesomeIcon icon={IconComponent} className="w-6 h-6" />;
      }
    }
    return <FontAwesomeIcon icon={SolidIcons.faCreditCard} className="w-6 h-6" />;
  }, [icon]);

  return (
    <div className="group flex items-center justify-between p-4 hover:bg-muted/80 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          {transactionIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-card-foreground truncate text-base">{title}</div>
          <div className="text-sm text-muted-foreground mt-0.5 font-medium">{time}</div>
        </div>
      </div>

      <div className="flex items-center gap-8 sm:gap-12">
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-muted rounded-lg border border-border">
          <div className="relative w-10 h-6 rounded flex items-center justify-center text-[8px] font-bold text-card-foreground">
            <CardBrand brand={selectedCardBrand || "visa"} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">****{selectedCardLastFour || "4329"}</span>
        </div>

        <div className="hidden lg:block">
          <span 
            className="px-4 py-1.5 rounded-full text-sm font-medium text-white border"
            style={{ backgroundColor: categoryColor || '#6b7280' }}
          >
            {subtitle || "General"}
          </span>
        </div>

        <div className={`font-bold text-lg min-w-[100px] text-right ${amountColor}`}>
          {isIncome ? "+" : ""}{amount}
        </div>
      </div>
    </div>
  );
});

export default TransactionItem;
