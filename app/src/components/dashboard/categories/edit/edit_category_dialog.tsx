"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useParams } from "next/navigation";
import CategoryForm from "../form/category_form";
import { useI18n } from "@/i18n/useI18n";
import categoryService from "@/services/category_service";
import { CategoriesType } from "@/types/categories";

export default function EditCategoryDialog() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [category, setCategory] = useState<CategoriesType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const resp = await categoryService.getCategory(id);
        setCategory(resp);
      } catch (error) {
        console.error("Failed to fetch category", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <Dialog defaultOpen={true} open={true} onOpenChange={handleClose}>
        <DialogContent className="!max-w-[50rem]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {t("dashboard.categories.edit_category")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
              <div className="h-24 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex justify-end space-x-2">
              <div className="h-10 bg-muted rounded animate-pulse w-20"></div>
              <div className="h-10 bg-muted rounded animate-pulse w-20"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
            {t("dashboard.categories.edit_category")}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm category={category} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}