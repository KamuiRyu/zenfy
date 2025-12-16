import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/dashboard_header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1">
          <div className="p-6">
            <DashboardHeader />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
