"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Wallet,
  Tag,
  Settings,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Sidebar() {
  const [mounted] = useState(true);
  const pathname = usePathname() || "/";

  return (
    <aside className="fixed top-0 h-screen w-20 flex flex-col items-center py-6 bg-sidebar transition-colors duration-300 flex-shrink-0 z-50">
      <div className="flex flex-col items-center w-full">
        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 13.2 3 14.5 4.3C15.8 5.6 17 6.8 17 6.8C17 6.8 17 7 16 8C15 9 13.5 10 12 10C10.5 10 9 9 8 8C7 7 7 6.8 7 6.8C7 6.8 8.2 5.6 9.5 4.3C10.8 3 12 2 12 2Z"
              fill="white"
            />
          </svg>
        </div>

        <nav className="mt-6 flex flex-col items-center gap-4 w-full">
          {(() => {
            const items = [
              { href: "/dashboard", Icon: Home, label: "Home" },
              {
                href: "/dashboard/transactions",
                Icon: Receipt,
                label: "Transactions",
              },
              { href: "/dashboard/categories", Icon: Tag, label: "Categories" },
              {
                href: "/dashboard/analytics",
                Icon: BarChart3,
                label: "Analytics",
              },
              { href: "/dashboard/cards", Icon: Wallet, label: "Cards" },

              {
                href: "/dashboard/settings",
                Icon: Settings,
                label: "Settings",
              },
            ];

            return items.map(({ href, Icon, label }) => {
              const isActive =
                mounted &&
                (href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === href || pathname.startsWith(href + "/"));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isActive
                      ? "bg-primary/5 text-primary hover:bg-primary/10"
                      : "hover:bg-primary/5 text-muted-foreground"
                  )}
                >
                  <Icon size={20} />
                </Link>
              );
            });
          })()}
        </nav>
      </div>
    </aside>
  );
}
