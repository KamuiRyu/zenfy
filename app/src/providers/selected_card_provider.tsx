"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

type SelectedCardState = {
  selectedCardUuid: string | null;
  selectedCardLastFour: string | null;
  selectedCardBrand: string | null;
};

type SelectedCardAction = {
  type: 'SET_CARD';
  payload: {
    uuid: string | null;
    lastFour?: string | null;
    brand?: string | null;
  };
};

const initialState: SelectedCardState = {
  selectedCardUuid: null,
  selectedCardLastFour: null,
  selectedCardBrand: null,
};

function selectedCardReducer(state: SelectedCardState, action: SelectedCardAction): SelectedCardState {
  switch (action.type) {
    case 'SET_CARD':
      return {
        selectedCardUuid: action.payload.uuid,
        selectedCardLastFour: action.payload.lastFour ?? null,
        selectedCardBrand: action.payload.brand ?? null,
      };
    default:
      return state;
  }
}

type SelectedCardContextType = SelectedCardState & {
  setSelectedCard: (uuid: string | null, lastFour?: string | null, brand?: string | null) => void;
};

const SelectedCardContext = createContext<SelectedCardContextType | undefined>(undefined);

export function SelectedCardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(selectedCardReducer, initialState);

  const setSelectedCard = (uuid: string | null, lastFour?: string | null, brand?: string | null) => {
    dispatch({
      type: 'SET_CARD',
      payload: { uuid, lastFour, brand },
    });
  };

  const contextValue: SelectedCardContextType = {
    ...state,
    setSelectedCard,
  };

  return (
    <SelectedCardContext.Provider value={contextValue}>
      {children}
    </SelectedCardContext.Provider>
  );
}

export function useSelectedCard() {
  const context = useContext(SelectedCardContext);
  if (context === undefined) {
    throw new Error("useSelectedCard must be used within a SelectedCardProvider");
  }
  return context;
}