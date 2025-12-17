"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CardFormProps {
  mode: "add" | "edit";
  cardId?: string | string[];
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

export default function CardForm({ mode, cardId, initialValues, onSuccess }: CardFormProps) {
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
        {mode === "add" ? "Adicionar Cartão" : "Editar Cartão"}
      </h2>
      <Input
        placeholder="Nome do titular"
        value={holderName}
        onChange={e => setHolderName(e.target.value)}
        required
      />
      <Input
        placeholder="Últimos 4 dígitos"
        value={lastFour}
        maxLength={4}
        onChange={e => setLastFour(e.target.value.replace(/\D/g, ""))}
        required
      />
      <Input
        placeholder="Validade (MM/AA)"
        value={expiry}
        onChange={e => setExpiry(e.target.value)}
        required
      />
      <Input
        placeholder="Bandeira (Visa, Mastercard...)"
        value={brand}
        onChange={e => setBrand(e.target.value)}
      />
      <Input
        placeholder="Banco"
        value={bank}
        onChange={e => setBank(e.target.value)}
      />
      <Input
        placeholder="Apelido (opcional)"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
      />
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Salvando..." : mode === "add" ? "Adicionar" : "Salvar"}
      </Button>
    </form>
  );
}
