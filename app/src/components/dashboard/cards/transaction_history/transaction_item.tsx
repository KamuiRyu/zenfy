import * as React from "react";
import * as FaIcons from "react-icons/fa";
import { CardBrand } from "../my_cards/card_brand";

const TransactionItem = React.memo(function TransactionItem({
  title,
  subtitle,
  time,
  amount,
  categoryType,
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
  categoryType?: string;
  icon?: string;
  categoryColor?: string;
  selectedCardLastFour?: string | null;
  selectedCardBrand?: string | null;
}) {
  const isIncome = categoryType == "income";
  const amountColor = isIncome ? "text-green-600" : "text-red-600";



  const transactionIcon = React.useMemo(() => {
    if (icon) {
      const iconName = `Fa${icon.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
      const IconComponent = (FaIcons as any)[iconName];
      if (IconComponent) {
        return <IconComponent className="w-6 h-6 text-white" />;
      }
    }
    return <FaIcons.FaCreditCard className="w-6 h-6 text-white" />;
  }, [icon]);

  return (
    <div className="group grid grid-cols-[7fr_1fr_1fr_1fr] items-center gap-4 p-4 hover:bg-muted/80 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0" style={{ backgroundColor: categoryColor || '#f3f4f6' }}>
          {transactionIcon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-card-foreground truncate text-lg">{title}</div>
          <div className="text-base text-muted-foreground mt-0.5 font-medium">{time}</div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-2 py-1 flex-shrink-0">
        <div className="relative w-12 h-7 flex items-center justify-center font-bold text-card-foreground border border-border rounded-sm shadow-sm">
          <CardBrand brand={selectedCardBrand || "visa"} />
        </div>
        <span className="text-md font-medium text-muted-foreground">****{selectedCardLastFour || "4329"}</span>
      </div>

      <div className="hidden lg:flex justify-center flex-shrink-0">
        <span 
          className="px-3 py-1 rounded-full text-sm font-medium border truncate w-[120px] text-center ">
          {subtitle || "General"}
        </span>
      </div>

      <div className={`font-bold text-md flex-shrink-0 text-center ${amountColor}`}>
        {isIncome ? "+" : "-"} {amount}
      </div>
    </div>
  );
});

export default TransactionItem;
