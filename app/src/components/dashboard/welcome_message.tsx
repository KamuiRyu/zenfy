"use client";

import { useI18n } from "@/i18n/useI18n";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

export function WelcomeMessage() {
  const { data: session } = useSession();
  const displayName = session?.user?.name || null;
  const { t } = useI18n();
  return (
    <div>
      <h2 className="flex items-center text-3xl md:text-4xl font-semibold gap-3">
        <span>{t("dashboard.greeting")}, </span>
        {displayName ? (
          <span className="font-extrabold">{displayName}</span>
        ) : (
          <Skeleton className="h-8 w-48 inline-block align-middle" />
        )}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {t("dashboard.welcome_message")}
      </p>
    </div>
  );
}
