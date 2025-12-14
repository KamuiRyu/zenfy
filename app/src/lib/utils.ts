import { useI18n } from "@/i18n/useI18n";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface TranslateFunction {
  (key: string, ...params: (string | number)[]): string;
}

export const translateFormMessage = (t: TranslateFunction, msg?: string): string => {
   
    if (!msg) return "";
    const parts: string[] = msg.split(",").map((s) => s.trim());
    const code: string = parts[0];
    const params: (string | number)[] = parts.slice(1).map((p) => {
      const n: number = Number(p);
      return Number.isNaN(n) ? p : n;
    });

    const valKey: string = `validation.${code}`;
    const srvKey: string = `server.${code}`;

    const translatedVal: string = t(valKey, ...params);
    if (translatedVal !== valKey) return translatedVal;

    const translatedSrv: string = t(srvKey, ...params);
    if (translatedSrv !== srvKey) return translatedSrv;

    if (params.length) {
      let out: string = code;
      for (const p of params) out = out.replace(/%[ds]/, String(p));
      return out;
    }

    return code;
  };