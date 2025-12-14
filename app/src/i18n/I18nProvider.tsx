"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/locales/en.json";
import pt from "@/locales/pt.json";

type Messages = Record<string, any>;

const MESSAGES: Record<string, Messages> = { en, pt };

 type I18nContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, ...params: any[]) => string;
 };

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, defaultLocale = "en" }: { children: React.ReactNode; defaultLocale?: string }) {
  const [locale, setLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    if (!defaultLocale && typeof navigator !== "undefined") {
      const nav = navigator.language?.split("-")[0];
      if (nav && MESSAGES[nav]) setLocale(nav);
    }
  }, [defaultLocale]);

  const t = (key: string, ...params: any[]) => {
    const parts = key.split(".");
    const msgs = MESSAGES[locale] ?? MESSAGES.en;
    let cur: any = msgs;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur == null) return key;
    }
    if (typeof cur === "string") {
      let out = cur;
      if (params && params.length) {
        for (const param of params) {
          out = out.replace(/%[ds]/, String(param));
        }
      }
      return out;
    }
    return key;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18nContext must be used within I18nProvider");
  return ctx;
}
