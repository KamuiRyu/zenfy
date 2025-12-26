"use client";

import { useI18n } from "@/i18n/useI18n";
import { useEffect } from "react";
import { ejectAxiosInterceptor, setupAxiosInterceptors } from "@/services/service_base";
import { toast } from "sonner";

export function FlashMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();

  useEffect(() => {
    const checkFlash = () => checkAndShowFlashMessage(t);

    const interceptorId = setupAxiosInterceptors(checkFlash);

    checkFlash();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkFlash();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (interceptorId !== null) {
        ejectAxiosInterceptor(interceptorId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [t]);

  return <>{children}</>;
}


function translate(key: string, t: (k: string) => string) {
  return t("toast." + key);
}

export function checkAndShowFlashMessage(t: (k: string) => string) {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("flash="));
  
  if (cookie) {
    try {
      const value = cookie.split("=")[1];
      const decoded = atob(value);
      
      const flash = JSON.parse(decoded);
      

      const message = translate(flash.message, t);

      switch (flash.type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "warning":
          toast.warning(message);
          break;
        case "info":
          toast.info(message);
          break;
      }

      document.cookie = "flash=; path=/; max-age=0";
    } catch (e) {
      console.error("Failed to parse flash message:", e);
    }
  }
}