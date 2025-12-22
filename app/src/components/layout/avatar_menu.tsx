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
import { Skeleton } from "../ui/skeleton";
import { useI18n } from "@/i18n/useI18n";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../base/confirm_dialog";

export default function AvatarMenu({
  displayName,
  avatar,
}: {
  displayName: string | null;
  avatar: string | null;
}) {
  const { t } = useI18n();

  return (
    <DropdownMenu open={avatar !== null ? undefined : false}>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full p-0 bg-transparent hover:bg-transparent focus:outline-none focus:ring-0">
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <Skeleton className="w-10 h-10 rounded-full" />
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
              onSelect={(e: any) => {
                e.preventDefault();
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
