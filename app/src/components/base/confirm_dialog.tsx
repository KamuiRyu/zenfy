import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import React from "react";
import { useI18n } from "@/i18n/useI18n";

type ConfirmDialogProps = {
  title?: string;
  description?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  trigger?: React.ReactNode;
};

export function ConfirmDialog({
  title = "Confirm",
  description,
  onConfirm,
  trigger,
}: ConfirmDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const { t } = useI18n();

  function handleOpenChange(v: boolean) {
    if (loading && v === false) return;
    setOpen(v);
  }

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          className="inline-flex items-center"
        >
          {trigger}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("action.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? t("action.loading") : t("action.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
