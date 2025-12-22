"use client";

import React from "react";
import { bankStylesFor } from "./bank_styles";
import CardHeader from "./card_header";
import CardNumber from "./card_number";
import CardFooter from "./card_footer";
import { Edit2, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/base/confirm_dialog";
import { useI18n } from "@/i18n/useI18n";

const CardItem = React.forwardRef<
  HTMLDivElement,
  {
    lastFour: string;
    expiry: string;
    holderName?: string;
    nickname?: string;
    brand?: string;
    bank?: string;
    selected?: boolean;
    onClick?: () => void;
    isDragging?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
  }
>(
  (
    {
      lastFour,
      expiry,
      holderName,
      nickname,
      brand,
      bank,
      selected = false,
      onClick,
      isDragging = false,
      onEdit,
      onDelete,
    },
    ref
  ) => {
    const coloredBaseDefault = "bg-gray-800 text-white";
    const { t } = useI18n();
    const selectedClasses = selected
      ? "ring-primary/40 shadow-lg"
      : "opacity-60";

    const bankStyles = bankStylesFor(bank);
    const base = bankStyles?.gradient ?? coloredBaseDefault;

    const name = holderName ?? t('dashboard.cards.card_holder');

    function handleEdit(e: React.MouseEvent) {
      e.stopPropagation();
      onEdit?.();
    }

    

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          onClick?.();
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isDragging) {
            e.preventDefault();
            onClick?.();
          }
        }}
        aria-pressed={selected}
        className={`min-w-[420px] h-64 rounded-2xl pb-8 px-8 flex flex-col justify-between transition-all duration-300 ring-4 ring-transparent cursor-pointer ${base} ${selectedClasses} ${
          selected ? "scale-100" : "scale-95"
        }`}
        style={
          selected
            ? undefined
            : {
                filter: "grayscale(100%) contrast(85%) brightness(70%)",
                WebkitFilter: "grayscale(100%) contrast(85%) brightness(70%)",
              }
        }
      >
        <div className="flex items-center gap-3 absolute z-10 top-2 left-4">
          {onEdit && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEdit(e as any);
                }
              }}
              aria-label={t("dashboard.cards.edit_card")}
              className="p-1 rounded-md hover:bg-white/20 focus:outline-none cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </span>
          )}
          {onDelete && (
            <ConfirmDialog
              onConfirm={() => onDelete?.()}
              title={t("dashboard.cards.confirm_delete")}
              description={t("dashboard.cards.delete_description")}
              trigger={
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={t("dashboard.cards.delete_card")}
                  className="p-1 rounded-md hover:bg-white/20 focus:outline-none cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </span>
              }
            />
          )}
          {nickname && (
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-sm font-medium">
              {nickname}
            </span>
          )}
        </div>
        <div className="relative w-full h-full mt-10">
          <div className="absolute inset-0 pointer-events-none rounded-2xl" />
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 6px)",
            }}
          />

          <div className="relative z-10 flex flex-col h-full">
            <div>
              <CardHeader brand={brand} />
            </div>

            <div className="flex-1 flex items-center justify-center">
              <CardNumber lastFour={lastFour} />
            </div>

            <div>
              <CardFooter holderName={name} expiry={expiry} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CardItem.displayName = "CardItem";

export default CardItem;
