import React from "react";

export default function ActivityCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Activity</h3>
        <div className="text-sm text-muted-foreground">...</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 rounded-full bg-blue-400 flex items-center justify-center text-white">$4,509</div>
        <div className="flex flex-col gap-2">
          <div className="w-36 h-12 rounded-lg bg-pink-200 flex items-center justify-center">$4.50</div>
          <div className="w-36 h-12 rounded-lg bg-yellow-200 flex items-center justify-center">$4.50</div>
        </div>
      </div>
    </div>
  );
}
