"use client";

import React from "react";

export default function CardNumber({ lastFour }: { lastFour: string }) {
  return (
    <div className="mt-3 flex items-start gap-4">
      <div className="flex-1">
        <div className="text-xl font-semibold tracking-widest">{`**** **** **** ${lastFour}`}</div>
      </div>
    </div>
  );
}
