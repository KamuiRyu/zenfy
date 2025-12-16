"use client";

import React from "react";

export default function CardAdd({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="min-w-[120px] h-48 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white/20 text-gray-500"
      aria-label="Add card"
    >
      <span className="text-4xl leading-none">+</span>
    </button>
  );
}
