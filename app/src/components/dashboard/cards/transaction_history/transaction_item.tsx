import * as React from "react";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import { CardBrand } from "../my_cards/card_brand";
import { useI18n } from "@/i18n/useI18n";
import { TransactionKind } from "@/types/transactions";

interface IconComponentProps {
  className?: string;
}

type IconComponent = React.ComponentType<IconComponentProps>;

const TransactionItem = React.memo(function TransactionItem({
  title,
  subtitle,
  merchant,
  time,
  amount,
  categoryType,
  icon,
  kind,
  categoryColor,
  selectedCardLastFour,
  selectedCardBrand,
  isInstallment,
  installmentNumber,
  totalInstallments,
}: {
  title: string;
  subtitle?: string;
  merchant?: string;
  time?: string;
  card?: string;
  amount: string;
  categoryType?: string;
  icon?: string;
  kind: TransactionKind;
  categoryColor?: string;
  selectedCardLastFour?: string | null;
  selectedCardBrand?: string | null;
  isInstallment?: boolean;
  installmentNumber?: number;
  totalInstallments?: number;

}) {
  const { t } = useI18n();
  const isIncome = categoryType == "income" || categoryType == "refund" || categoryType == "cashback";
  const amountColor = isIncome ? "text-green-600" : "text-red-600";

  const transactionIcon = React.useMemo(() => {
      if (icon) {
        const SiIconComponent: IconComponent | undefined = (
          SiIcons as Record<string, IconComponent>
        )[icon];
        if (SiIconComponent) {
          return <SiIconComponent className="w-6 h-6 text-white" />;
        }
  
        const BsIconComponent: IconComponent | undefined = (
          BsIcons as Record<string, IconComponent>
        )[icon];
        if (BsIconComponent) {
          return <BsIconComponent className="w-6 h-6 text-white" />;
        }
      }
      return <BsIcons.BsCreditCardFill className="w-6 h-6 text-white" />;
    }, [icon]);

      const formatKind = (kind: TransactionKind) => {
        const kindLabels = {
          credit: t("filter.kind.credit"),
          debit: t("filter.kind.debit"),
          withdrawal: t("filter.kind.withdrawal"),
          deposit: t("filter.kind.deposit"),
          transfer: t("filter.kind.transfer"),
        };
        return kindLabels[kind] || kind;
      };
    
      // Format installment info
      const installmentInfo = isInstallment && installmentNumber && totalInstallments
        ? `${t("dashboard.transactions.installment")} ${installmentNumber}/${totalInstallments}`
        : null;

  return (
    <div className="group grid grid-cols-[5fr_1fr_1fr_1fr] items-center gap-4 p-4 hover:bg-muted/80 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
          style={{ backgroundColor: categoryColor || "#f3f4f6" }}
        >
          {transactionIcon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-card-foreground truncate text-lg">
            {title}
          </div>
          {merchant && (
            <div className="text-sm text-muted-foreground truncate mt-0.5">
              {merchant}
            </div>
          )}
           <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{formatKind(kind)}</span>
              {installmentInfo && (
                <>
                  <span>•</span>
                  <span>{installmentInfo}</span>
                </>
              )}
            </div>
          <div className="text-base text-muted-foreground mt-0.5 font-medium">
            {time}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-2 py-1 flex-shrink-0">
        <div className="relative w-12 h-7 flex items-center justify-center font-bold text-card-foreground border border-border rounded-sm shadow-sm">
          <CardBrand brand={selectedCardBrand || "visa"} />
        </div>
        <span className="text-md font-medium text-muted-foreground">
          ****{selectedCardLastFour || "4329"}
        </span>
      </div>

      <div className="hidden lg:flex justify-center flex-shrink-0">
        <span 
          className="px-3 py-1 rounded-full text-sm font-medium border truncate w-[120px] text-center"
          title={subtitle || t("dashboard.transaction_history.general")}
        >
          {subtitle || t("dashboard.transaction_history.general")}
        </span>
      </div>

      <div
        className={`font-medium text-md flex-shrink-0 text-center ${amountColor}`}
      >
        {isIncome ? "+" : "-"} {amount}
      </div>
    </div>
  );
});

export default TransactionItem;
