"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useI18n } from "@/i18n/useI18n";
import { ConfirmDialog } from "../base/confirm_dialog";
import Image from "next/image";

export default function AvatarMenu({
  displayName,
  avatar,
}: {
  displayName: string | null;
  avatar: string | null;
}) {
  const { t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full p-0 bg-transparent hover:bg-transparent focus:outline-none focus:ring-0">
          {avatar ? (
            <Image
              src={avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
              {displayName?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={6} align="end" className="w-48">
        <DropdownMenuLabel>
          <div className="text-sm font-semibold">{displayName}</div>
          <div className="text-xs text-muted-foreground">
            {t("dashboard.account")}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">{t("dashboard.profile")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">{t("dashboard.settings")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConfirmDialog
          title={t("dashboard.logout.confirmation")}
          description={t("dashboard.logout.description")}
          onConfirm={() => signOut({ callbackUrl: "/" })}
          trigger={
            <DropdownMenuItem
              asChild
              className="w-full p-0"
              onSelect={(event: Event) => {
                event.preventDefault();
              }}
            >
              <button className="w-full text-left px-3 py-2">{t("dashboard.logout.title")}</button>
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
