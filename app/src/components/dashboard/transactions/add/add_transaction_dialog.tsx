"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import TransactionForm from "../transaction_form";
import { useI18n } from "@/i18n/useI18n";

export default function AddTransactionDialog() {
  const { t } = useI18n();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.transactions.add_transaction")}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
