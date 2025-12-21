"use client";

import { useEffect, useReducer } from "react";
import { FlashMessage } from "@/lib/flash-message";

type State = {
  flash: FlashMessage | null;
};

type Action = { type: "SET_FLASH"; payload: FlashMessage | null } | { type: "CLEAR_FLASH" };

function flashReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FLASH":
      return { flash: action.payload };
    case "CLEAR_FLASH":
      return { flash: null };
    default:
      return state;
  }
}

export function useFlashMessage() {
  const [state, dispatch] = useReducer(flashReducer, { flash: null });

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("flash="));
    
    if (cookie) {
      try {
        const value = cookie.split("=")[1];
        const decoded = atob(value);
        const message = JSON.parse(decoded) as FlashMessage;
        dispatch({ type: "SET_FLASH", payload: message });
        
        document.cookie = "flash=; path=/; max-age=0";
        
        setTimeout(() => dispatch({ type: "CLEAR_FLASH" }), 5000);
      } catch {}
    }
  }, []);

  return state.flash;
}