"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/i18n/useI18n";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import categoryService from "@/services/category_service";
import { CategoriesType } from "@/types/categories";
import { useState } from "react";
import { Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryInfoForm from "./tabs/category_info_form";
import CategoryStyleForm from "./tabs/category_style_form";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import React from "react";

interface CategoryFormProps {
  category?: CategoriesType | null;
  onClose: () => void;
}

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
  color: z.string().min(1, "Cor é obrigatória"),
  icon: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      type: category?.type || "expense",
      description: category?.description || "",
      color: category?.color || "#FF6B6B",
      icon: category?.icon || "",
    },
  });

  const watchedName = useWatch({ control: form.control, name: "name" });
  const watchedColor = useWatch({ control: form.control, name: "color" });
  const watchedIcon = useWatch({ control: form.control, name: "icon" });

  const categoryIcon = React.useMemo(() => {
    if (!watchedIcon)
      return <BsIcons.BsCreditCardFill className="w-4 h-4 text-white" />;
    const SiIconComponent = (
      SiIcons as Record<string, React.ComponentType<{ className?: string }>>
    )[watchedIcon];
    if (SiIconComponent) {
      return <SiIconComponent className="w-4 h-4 text-white" />;
    }
    const BsIconComponent = (
      BsIcons as Record<string, React.ComponentType<{ className?: string }>>
    )[watchedIcon];
    if (BsIconComponent) {
      return <BsIconComponent className="w-4 h-4 text-white" />;
    }
    return <BsIcons.BsCreditCardFill className="w-4 h-4 text-white" />;
  }, [watchedIcon]);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      let result;
      if (category) {
        result = await categoryService.updateCategory(category.uuid, data);
      } else {
        result = await categoryService.createCategory(data);
      }

      if (result?.type === "error") {
        if (
          result.code === "CREATE_CATEGORY_FAILED" &&
          result.message?.includes("ALREADY_EXISTS")
        ) {
          form.setError("name", {
            message: t("dashboard.categories.error.name_already_exists"),
          });
          setActiveTab("info");
          
        }
        setLoading(false);
        return;
      }

      window.dispatchEvent(new Event("categoryUpdated"));
      onClose();
    } catch (error: unknown) {
      console.error("Failed to save category", error);
    }
  };

  return (
      <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Tag className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {category ? t("dashboard.categories.edit_category") : t("dashboard.categories.add_category")}
        </h2>
        <p className="text-muted-foreground">
          {category ? t("dashboard.categories.edit_description") : t("dashboard.categories.add_description")}
        </p>
      </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {(watchedName || watchedColor || watchedIcon) && (
          <div className="p-4 rounded-lg bg-muted/20">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: watchedColor || "#f3f4f6" }}
              >
                {categoryIcon}
              </div>
              <span className="text-sm">
                {watchedName || "Nome da Categoria"}
              </span>
            </div>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          <TabsContent
            value="info"
            className="space-y-6 mt-6 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300"
          >
            <CategoryInfoForm control={form.control} />
          </TabsContent>
          <TabsContent
            value="style"
            className="space-y-6 mt-6 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300"
          >
            <CategoryStyleForm control={form.control} category={category ?? undefined} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-8 border-t border-border/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 h-12"
              disabled={loading}
            >
              {t("action.cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              {loading ? t("action.loading") : category ? t("dashboard.categories.save") : t("dashboard.categories.create")}
            </Button>
          </div>
      </form>
    </Form>
    </div>
  );
}
