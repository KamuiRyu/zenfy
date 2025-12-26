"use client";

import { useState } from "react";
import transactionService from "@/services/transaction_service";
import { TransactionData, TransactionType } from "@/types/transactions";

export function useTransactionActions() {
  const [loading, setLoading] = useState(false);

  const createTransaction = async (data: TransactionData) => {
    setLoading(true);
    try {
      const payload = {
        description: data.description,
        merchant: data.merchant,
        amount: Math.round(parseFloat(data.amount.toString()) * 100),
        category_uuid: data.category_uuid,
        card_uuid: data.card_uuid,
        occurred_at: data.occurred_at,
        kind: data.kind,
        is_installment: data.isInstallment,
        installment_number: data.installmentNumber,
        total_installments: data.totalInstallments,
        is_recurring: data.isRecurring,
        recurrence_type: data.recurrenceType,
        recurrence_start_date: data.recurrenceStartDate,
        recurrence_end_date: data.recurrenceEndDate,
      };

      const response = await transactionService.createTransaction(payload);
      return response;
    } catch (error: unknown) {
      console.error("Failed to create transaction", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, data: TransactionData) => {
    setLoading(true);
    try {
      const payload = {
        description: data.description,
        merchant: data.merchant,
        amount: Math.round(parseFloat(data.amount.toString()) * 100),
        category_uuid: data.category_uuid,
        card_uuid: data.card_uuid,
        occurred_at: data.occurred_at,
        kind: data.kind,
        is_installment: data.isInstallment,
        installment_number: data.installmentNumber,
        total_installments: data.totalInstallments,
        is_recurring: data.isRecurring,
        recurrence_type: data.recurrenceType,
        recurrence_start_date: data.recurrenceStartDate,
        recurrence_end_date: data.recurrenceEndDate,
      };
      const response = await transactionService.updateTransaction(id, payload);
      return response;
    } catch (error: any) {
      console.error("Failed to update transaction", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    try {
      await transactionService.deleteTransaction(id);
      return true;
    } catch (error: any) {
      console.error("Failed to delete transaction", error);
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