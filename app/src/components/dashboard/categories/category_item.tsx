"use client";

import React, { use } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoriesType } from "@/types/categories";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import { ConfirmDialog } from "@/components/base/confirm_dialog";
import { useI18n } from "@/i18n/useI18n";

interface IconComponentProps {
  className?: string;
}

type IconComponent = React.ComponentType<IconComponentProps>;

interface CategoryItemProps {
  category: CategoriesType;
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
}

export default function CategoryItem({
  category,
  onDelete,
  onEdit,
}: CategoryItemProps) {
  const { t } = useI18n();

  const deleteCategory = async (uuid: string) => {
    await fetch(`/api/categories/${uuid}`, {
      method: "DELETE",
    });
  };

  const categoryIcon = React.useMemo(() => {
    const icon: string | undefined = category?.icon;
    if (icon) {
      const SiIconComponent: IconComponent | undefined = (
        SiIcons as Record<string, IconComponent>
      )[icon];
      if (SiIconComponent) {
        return <SiIconComponent className="w-6 h-6 text-white" />;
      }

      const BsIconComponent: IconComponent | undefined = (
        BsIcons as Record<string, IconComponent>
      )[icon];
      if (BsIconComponent) {
        return <BsIconComponent className="w-6 h-6 text-white" />;
      }
    }
    return <BsIcons.BsCreditCardFill className="w-6 h-6 text-white" />;
  }, [category?.icon]);

  return (
    <div className="group flex justify-between items-center gap-4 p-4 hover:bg-muted/80 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
          style={{ backgroundColor: category?.color || "#f3f4f6" }}
        >
          {categoryIcon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-card-foreground truncate text-lg">
            {category.name}
          </div>
          {category.description && (
            <div className="text-sm text-muted-foreground truncate mt-0.5">
              {category.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!category.is_default && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category.uuid)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <ConfirmDialog
              title={t("dashboard.categories.confirm_delete")}
              description={t("dashboard.categories.delete_description")}
              onConfirm={async () => {
                try {
                  await deleteCategory(category.uuid);
                  onDelete(category.uuid);
                } catch {}
              }}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
