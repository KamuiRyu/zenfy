import React from "react";

export default function TransactionItem({
  title,
  subtitle,
  time,
  card,
  amount,
}: {
  title: string;
  subtitle?: string;
  time?: string;
  card?: string;
  amount: string;
}) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">•</div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{time}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">{card}</div>
        <div className="text-green-600 font-semibold">{amount}</div>
      </div>
    </li>
  );
}
