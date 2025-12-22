import React from "react";
import Sidebar from "@/components/layout/sidebar";
import DashboardHeader from "@/components/layout/dashboard_header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <Sidebar />
      <div className="ml-20 flex flex-col min-h-screen">
        <div className="pt-6 flex-shrink-0 px-6">
          <DashboardHeader />
        </div>
        <div className="flex-1 overflow-y-auto pb-6 px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
