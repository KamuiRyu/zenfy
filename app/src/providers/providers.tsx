"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider defaultLocale="en">
      <SessionProvider>{children}</SessionProvider>
    </I18nProvider>
  );
}
