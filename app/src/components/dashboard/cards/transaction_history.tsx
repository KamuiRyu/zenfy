import React from "react";
import TransactionItem from "./transaction_item";

export default function TransactionHistory() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Transaction History</h2>
        <div className="flex items-center gap-3">
          <input placeholder="Search..." className="px-3 py-2 border rounded-full text-sm w-52" />
          <button className="px-3 py-2 border rounded-md text-sm">Filters</button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-xs text-muted-foreground mb-2">Today</div>
          <ul className="space-y-3">
            <TransactionItem title="iPhone 17 Purchase" time="11:37 AM" card="VISA • ****4329" amount="$1,020.00" />
            <TransactionItem title="Starbucks Coffee" time="11:37 AM" card="MC • ****4329" amount="$8.50" />
          </ul>
        </div>

        <div>
          <div className="text-xs text-muted-foreground mb-2">Yesterday</div>
          <ul className="space-y-3">
            <TransactionItem title="Spotify Premium" time="11:37 AM" card="MC • ****4329" amount="$9.99" />
            <TransactionItem title="Uber Ride" time="11:37 AM" card="VISA • ****4329" amount="$24.00" />
            <TransactionItem title="Gym Membership" time="11:37 AM" card="VISA • ****4329" amount="$45.00" />
          </ul>
        </div>
      </div>
    </div>
  );
}
