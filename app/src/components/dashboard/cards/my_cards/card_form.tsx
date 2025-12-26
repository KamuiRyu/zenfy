"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/useI18n";

interface CardFormProps {
  mode: "add" | "edit";
  initialValues?: {
    holderName?: string;
    lastFour?: string;
    expiry?: string;
    brand?: string;
    bank?: string;
    nickname?: string;
  };
  onSuccess?: () => void;
}

export default function CardForm({ mode, initialValues, onSuccess }: CardFormProps) {
  const { t } = useI18n();
  const [holderName, setHolderName] = useState(initialValues?.holderName || "");
  const [lastFour, setLastFour] = useState(initialValues?.lastFour || "");
  const [expiry, setExpiry] = useState(initialValues?.expiry || "");
  const [brand, setBrand] = useState(initialValues?.brand || "");
  const [bank, setBank] = useState(initialValues?.bank || "");
  const [nickname, setNickname] = useState(initialValues?.nickname || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess?.();
    }, 800);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">
        {mode === "add" ? t("dashboard.cards.add_card") : t("dashboard.cards.edit_card")}
      </h2>
      <Input
        placeholder={t("dashboard.cards.holder_name")}
        value={holderName}
        onChange={e => setHolderName(e.target.value)}
        required
      />
      <Input
        placeholder={t("dashboard.cards.last_four")}
        value={lastFour}
        maxLength={4}
        onChange={e => setLastFour(e.target.value.replace(/\D/g, ""))}
        required
      />
      <Input
        placeholder={t("dashboard.cards.expiry")}
        value={expiry}
        onChange={e => setExpiry(e.target.value)}
        required
      />
      <Input
        placeholder={t("dashboard.cards.brand")}
        value={brand}
        onChange={e => setBrand(e.target.value)}
      />
      <Input
        placeholder={t("dashboard.cards.bank")}
        value={bank}
        onChange={e => setBank(e.target.value)}
      />
      <Input
        placeholder={t("dashboard.cards.nickname")}
        value={nickname}
        onChange={e => setNickname(e.target.value)}
      />
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? t("dashboard.cards.saving") : mode === "add" ? t("dashboard.cards.add") : t("dashboard.cards.save")}
      </Button>
    </form>
  );
}
