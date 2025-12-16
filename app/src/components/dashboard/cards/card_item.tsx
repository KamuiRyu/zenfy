"use client";

import React from "react";
import ChipIcon from "../../../assets/icons/chip_card_icon";
import VisaIcon from "@/assets/icons/visa_icon";
import MastercardIcon from "@/assets/icons/mastercard_icon";
import AlipayIcon from "@/assets/icons/alipay_icon";
import AmexIcon from "@/assets/icons/amex_icon";
import DinersIcon from "@/assets/icons/diners_icon";
import DiscoverIcon from "@/assets/icons/discover_icon";
import EloIcon from "@/assets/icons/elo_icon";
import HipercardIcon from "@/assets/icons/hipercard_icon";
import JcbIcon from "@/assets/icons/jcb_icon";
import MaestroIcon from "@/assets/icons/maestro_icon";
import MirIcon from "@/assets/icons/mir_icon";
import PayPalIcon from "@/assets/icons/paypal_icon";
import UnionPayIcon from "@/assets/icons/unionpay_icon";

const CardItem = React.forwardRef<
  HTMLButtonElement,
  {
    variant?: "default" | "light" | "dark";
    lastFour: string;
    expiry: string;
    holderName?: string;
    brand?: string;
    selected?: boolean;
    onClick?: () => void;
  }
>(
  (
    {
      variant = "default",
      lastFour,
      expiry,
      holderName,
      brand,
      selected = false,
      onClick,
    },
    ref
  ) => {
    const coloredBase =
      variant === "default"
        ? "bg-gradient-to-br from-purple-600 to-purple-400 text-white"
        : variant === "dark"
        ? "bg-gray-800 text-white"
        : "bg-gray-100 text-gray-900";

    const neutralBase = "bg-gray-100 text-gray-700/90 border border-gray-200";

    const selectedClasses = selected
      ? "ring-primary/40 shadow-lg"
      : "opacity-90";

    const base = selected ? coloredBase : neutralBase;

    const name = holderName ?? "CARD HOLDER";

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={`min-w-[300px] h-44 rounded-2xl p-6 flex flex-col justify-between transition-all duration-150 ring-4 ring-transparent ${base} ${selectedClasses}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-6">
              {brand &&
                (() => {
                  switch (brand.toLowerCase()) {
                    case "visa":
                      return (
                        <VisaIcon className="absolute w-full h-full object-contain" />
                      );
                    case "mastercard":
                    case "mc":
                      return (
                        <MastercardIcon className="absolute w-full h-full object-contain" />
                      );
                    case "alipay":
                      return (
                        <AlipayIcon className="absolute w-full h-full object-contain" />
                      );
                    case "amex":
                      return (
                        <AmexIcon className="absolute w-full h-full object-contain" />
                      );
                    case "diners":
                      return (
                        <DinersIcon className="absolute w-full h-full object-contain" />
                      );
                    case "discover":
                      return (
                        <DiscoverIcon className="absolute w-full h-full object-contain" />
                      );
                    case "elo":
                      return (
                        <EloIcon className="absolute w-full h-full object-contain" />
                      );
                    case "hipercard":
                      return (
                        <HipercardIcon className="absolute w-full h-full object-contain" />
                      );
                    case "jcb":
                      return (
                        <JcbIcon className="absolute w-full h-full object-contain" />
                      );
                    case "maestro":
                      return (
                        <MaestroIcon className="absolute w-full h-full object-contain" />
                      );
                    case "mir":
                      return (
                        <MirIcon className="absolute w-full h-full object-contain" />
                      );
                    case "paypal":
                      return (
                        <PayPalIcon className="absolute w-full h-full object-contain" />
                      );
                    case "unionpay":
                      return (
                        <UnionPayIcon className="absolute w-full h-full object-contain" />
                      );
                    default:
                      return null;
                  }
                })()}
            </div>
          </div>

          <div className="w-12 h-8 opacity-90 flex items-center justify-end">
            <ChipIcon className="w-full h-full text-current" />
          </div>
        </div>

        <div className="mt-3 flex items-start gap-4">
          <div className="flex-1">
            <div className="text-xl font-semibold tracking-widest">
              {formatCardNumber(lastFour)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col items-start">
            <span className="text-[10px] opacity-80">CARD HOLDER</span>
            <span className="text-sm font-semibold mt-1 uppercase leading-tight">
              {name}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] opacity-80">VALID</span>
            <span className="text-sm font-semibold mt-1">{expiry}</span>
          </div>
        </div>
      </button>
    );
  }
);

export default CardItem;

// Helper to create masked groups: show three groups of 4 as **** and last group with lastFour
function formatCardNumber(lastFour: string) {
  return `**** **** **** ${lastFour}`;
}
