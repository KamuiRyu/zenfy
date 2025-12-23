"use client";

import { useState } from "react";
import transactionService from "@/services/transaction_service";
import { toast } from "sonner";

export function useTransactionActions() {
  const [loading, setLoading] = useState(false);

  const createTransaction = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        description: data.description,
        amount: Math.round(parseFloat(data.amount) * 100),
        category_id: parseInt(data.categoryId),
        card_uuid: data.cardId,
        occurred_at: data.date.toISOString(),
      };

      const response = await transactionService.createTransaction(payload);
      toast.success("Transação criada com sucesso");
      return response;
    } catch (error: any) {
      console.error("Failed to create transaction", error);
      toast.error("Erro ao criar transação");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, data: any) => {
    setLoading(true);
    try {
      const payload = {
        description: data.description,
        amount: Math.round(parseFloat(data.amount) * 100),
        category_id: parseInt(data.categoryId),
        card_uuid: data.cardId,
        occurred_at: data.date.toISOString(),
      };

      const response = await transactionService.updateTransaction(id, payload);
      toast.success("Transação atualizada com sucesso");
      return response;
    } catch (error: any) {
      console.error("Failed to update transaction", error);
      toast.error("Erro ao atualizar transação");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    try {
      await transactionService.deleteTransaction(id);
      toast.success("Transação excluída com sucesso");
      return true;
    } catch (error: any) {
      console.error("Failed to delete transaction", error);
      toast.error("Erro ao excluir transação");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
  };
}