"use client";

import React from "react";
import Link from "next/link";
import LogoutButton from "../auth/logout_button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export default function AvatarMenu({
  displayName,
  avatar,
}: {
  displayName: string;
  avatar: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <button className="rounded-full p-0 bg-transparent hover:bg-transparent focus:outline-none focus:ring-0">
            <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={6} align="end" className="w-48">
        <DropdownMenuLabel>
          <div className="text-sm font-semibold">{displayName}</div>
          <div className="text-xs text-muted-foreground">Account</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
