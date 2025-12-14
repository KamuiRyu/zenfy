import React from "react";

export default function StatCard({ title, value, accent = "blue", children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="w-20 h-16 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
