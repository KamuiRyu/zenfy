"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/i18n/I18nProvider";
import { FlashMessageProvider } from "./flash_message_provider";

import { ThemeProvider } from "./theme_provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <I18nProvider defaultLocale="en">
        <SessionProvider>
          <FlashMessageProvider>{children}</FlashMessageProvider>
        </SessionProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
