"use client";

import { Search, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import AvatarMenu from "./avatar_menu";
import { Skeleton } from "../ui/skeleton";
import { useI18n } from "@/i18n/useI18n";

export default function DashboardHeader({ name }: { name?: string }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const displayName = name || session?.user?.name || null;
  const avatar = session?.user?.image || null;
  const { t } = useI18n();

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-5">
        <button
          aria-label="Search"
          className="p-3 bg-white/60 rounded-lg  hover:bg-white"
        >
          <Search size={20} />
        </button>

        <button
          aria-label="Notifications"
          className="relative p-3 bg-white/60 rounded-lg hover:bg-white"
        >
          <Bell size={20} />
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
