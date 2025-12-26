"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useParams } from "next/navigation";
import TransactionForm from "../form/transaction_form";
import { useI18n } from "@/i18n/useI18n";
import transactionService from "@/services/transaction_service";

export default function EditTransactionDialog() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const resp = await transactionService.getTransaction(id);
        setTransaction(resp);
      } catch (error) {
        console.error("Failed to fetch transaction", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <Dialog defaultOpen={true} open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("dashboard.transactions.edit_transaction")}</DialogTitle>
        </DialogHeader>
        <TransactionForm transaction={transaction} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}