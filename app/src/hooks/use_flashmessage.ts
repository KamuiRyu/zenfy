"use client";

import { useEffect, useState } from "react";
import { FlashMessage } from "@/lib/flash-message";

export function useFlashMessage() {
  const [flash, setFlash] = useState<FlashMessage | null>(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("flash="));
    
    if (cookie) {
      try {
        const value = cookie.split("=")[1];
        const decoded = atob(value);
        const message = JSON.parse(decoded) as FlashMessage;
        setFlash(message);
        
        document.cookie = "flash=; path=/; max-age=0";
        
        setTimeout(() => setFlash(null), 5000);
      } catch {}
    }
  }, []);

  return flash;
}