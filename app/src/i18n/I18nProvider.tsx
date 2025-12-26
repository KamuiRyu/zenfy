"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import en from "@/locales/en.json";
import pt from "@/locales/pt.json";

type Messages = Record<string, unknown>;

const MESSAGES: Record<string, Messages> = { en, pt };

 type I18nContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, ...params: unknown[]) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  numberFormatLocale: string;
  setNumberFormatLocale: (l: string) => void;
 };

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, defaultLocale = "en" }: { children: React.ReactNode; defaultLocale?: string }) {
  const getInitialLocale = () => {
    if (defaultLocale) return defaultLocale;
    if (typeof navigator !== "undefined") {
      const nav = navigator.language?.split("-")[0];
      if (nav && MESSAGES[nav]) return nav;
    }
    return "en";
  };

  const [locale, setLocale] = useState<string>(getInitialLocale);
  const [numberFormatLocale, setNumberFormatLocale] = useState<string>('pt-BR');

  const t = useCallback((key: string, ...params: unknown[]) => {
    const parts = key.split(".");
    const msgs = MESSAGES[locale] ?? MESSAGES.en;
    let cur: unknown = msgs;
    for (const p of parts) {
      cur = (cur as Record<string, unknown>)?.[p];
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
  }, [locale]);

  const formatNumber = useCallback((value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(numberFormatLocale, options).format(value);
  }, [numberFormatLocale]);

  const value = useMemo(() => ({ locale, setLocale, t, formatNumber, numberFormatLocale, setNumberFormatLocale }), [locale, numberFormatLocale, t, formatNumber]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18nContext must be used within I18nProvider");
  return ctx;
}
