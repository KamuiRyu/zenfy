import React from "react";

export default function RightSidebar() {
  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-muted-foreground">Balance Overview</h3>
        <div className="text-3xl font-bold mt-3">$102,489.00</div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="text-sm">Total incomes this month</div>
            <div className="text-sm font-semibold">$412,489.00</div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="text-sm">Total expenses this month</div>
            <div className="text-sm font-semibold">$135,801.00</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-muted-foreground">Last Payment Details</h3>
        <div className="mt-4 text-sm">
          <div>Amount Paid</div>
          <div className="font-semibold mt-1">$320.00</div>
          <div className="text-muted-foreground mt-2">Mon, Oct 6 2025</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-muted-foreground">Statistics</h3>
        <div className="mt-4 text-sm">(Chart placeholder)</div>
      </div>
    </aside>
  );
}
