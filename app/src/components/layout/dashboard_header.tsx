"use client";

import { Search, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import AvatarMenu from "./avatar_menu";
import { Skeleton } from "../ui/skeleton";
import { ThemeToggleButton } from "./theme_toggle_button";

export default function DashboardHeader({ name }: { name?: string }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const displayName = name || session?.user?.name || null;
  const avatar = session?.user?.image || null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-5">
        <button
          aria-label="Search"
          className="p-3 rounded-lg transition-colors duration-200  text-card-foreground hover:bg-muted hover:text-primary"
        >
          <Search size={20} className="transition-colors duration-200 hover:text-primary" />
        </button>
        <ThemeToggleButton />
        <button
          aria-label="Notifications"
          className="relative p-3 rounded-lg transition-colors duration-200  text-card-foreground hover:bg-muted hover:text-primary"
        >
          <Bell size={20} className="transition-colors duration-200 hover:text-primary"/>
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pink-500 text-white text-[10px]">
            1
          </span>
        </button>

        {isLoading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <AvatarMenu
            displayName={displayName ?? ""}
            avatar={avatar ?? "/avatar.png"}
          />
        )}
      </div>
    </div>
  );
}
