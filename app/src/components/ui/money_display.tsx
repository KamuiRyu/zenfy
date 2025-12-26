interface MoneyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

export default function MoneyDisplay({
  amount,
  currency = "BRL",
  className = "",
  size = "md"
}: MoneyDisplayProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value / 100);
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {formatCurrency(amount)}
    </span>
  );
}