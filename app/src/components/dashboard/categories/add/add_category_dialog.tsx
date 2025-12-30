"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import CategoryForm from "../form/category_form";
import { useI18n } from "@/i18n/useI18n";

export default function AddCategoryDialog() {
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
      <DialogContent className="!max-w-[50rem]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.categories.add_category")}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}