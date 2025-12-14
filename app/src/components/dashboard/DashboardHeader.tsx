import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function DashboardHeader({ name = "Shahin Alam" }: { name?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl md:text-4xl font-semibold">
          Hi, <span className="font-extrabold">{name}</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Here is the update from your payment channels, that is really important for you to catch up.</p>
      </div>

      <div className="flex items-center gap-4">
        <button aria-label="Search" className="p-3 bg-white/60 rounded-lg shadow-sm hover:bg-white">
          <Search size={18} />
        </button>

        <button aria-label="Notifications" className="relative p-3 bg-white/60 rounded-lg shadow-sm hover:bg-white">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pink-500 text-white text-[10px]">1</span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/avatar.png" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
}
