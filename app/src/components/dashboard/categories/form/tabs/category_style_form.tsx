"use client";

import { Control } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import {
  FormField,

} from "@/components/ui/form";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import { FieldColorPicker } from "@/components/forms/field_colorpicker";
import { FieldCombobox } from "@/components/forms/field_combobox";

type CategoryFormData = {
  name: string;
  type: "income" | "expense";
  description?: string;
  color: string;
  icon?: string;
};

interface CategoryStyleFormProps {
  control: Control<CategoryFormData>;
  category?: {
    icon?: string;
  };
}

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#AED6F1",
  "#A3E4D7",
  "#F9E79F",
  "#D7BDE2",
  "#A9DFBF",
  "#FAD7A0",
  "#ABEBC6",
  "#FF9FF3",
  "#54A0FF",
  "#5F27CD",
  "#00D2D3",
  "#FF9F43",
  "#EE5A24",
  "#0ABDE3",
  "#10AC84",
  "#C44569",
  "#F368E0",
  "#FD79A8",
  "#6C5CE7",
  "#A29BFE",
  "#FD79A8",
  "#E17055",
  "#FDCB6E",
  "#E84393",
  "#00B894",
  "#00CEC9",
  "#0984E3",
  "#6C5CE7",
  "#A29BFE",
  "#FD79A8",
  "#E17055",
  "#FDCB6E",
  "#E84393",
  "#00B894",
  "#00CEC9",
  "#0984E3",
  "#6C5CE7",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#C00000",
  "#00C000",
  "#0000C0",
  "#C0C000",
  "#C000C0",
  "#00C0C0",
  "#FF6347",
  "#32CD32",
  "#1E90FF",
  "#FFD700",
  "#DA70D6",
  "#40E0D0",
  "#FF69B4",
  "#20B2AA",
  "#87CEEB",
  "#DDA0DD",
  "#98FB98",
  "#F0E68C",
  "#FFA07A",
  "#20B2AA",
  "#87CEFA",
  "#778899",
  "#B0C4DE",
  "#FFFFE0",
  "#00FFFF",
  "#ADFF2F",
  "#FF6347",
  "#FF4500",
  "#DC143C",
  "#00CED1",
  "#FF1493",
  "#00BFFF",
  "#696969",
  "#808080",
  "#A9A9A9",
  "#C0C0C0",
  "#D3D3D3",
  "#DCDCDC",
  "#F5F5F5",
  "#FFFFFF",
  "#000000",
  "#2F4F4F",
  "#556B2F",
  "#8B4513",
  "#A0522D",
  "#B8860B",
  "#CD853F",
  "#D2691E",
  "#DEB887",
  "#F4A460",
  "#FFDEAD",
  "#FFE4B5",
  "#FFE4E1",
  "#FFF8DC",
  "#FFFACD",
  "#FFFFF0",
  "#FAF0E6",
  "#FDF5E6",
  "#F5DEB3",
  "#FFEFD5",
  "#FFDAB9",
  "#FFE4B5",
];

const siIconOptions = Object.keys(SiIcons).map((key) => ({
  name: key,
  component: SiIcons[key as keyof typeof SiIcons],
}));
const selectedBsIcons = [
  "BsHouse",
  "BsCar",
  "BsCreditCard",
  "BsCash",
  "BsBank",
  "BsWallet",
  "BsPiggyBank",
  "BsGraphUp",
  "BsGraphDown",
  "BsShop",
  "BsBag",
  "BsHeart",
  "BsStar",
  "BsTrophy",
  "BsGear",
];
const bsIconOptions = selectedBsIcons
  .filter((key) => BsIcons[key as keyof typeof BsIcons])
  .map((key) => ({
    name: key,
    component: BsIcons[key as keyof typeof BsIcons],
  }));
const iconOptions = [...siIconOptions, ...bsIconOptions];

export default function CategoryStyleForm({ control, category }: CategoryStyleFormProps) {
  const { t } = useI18n();

  const finalIconOptions = [...iconOptions];
  if (category?.icon && !iconOptions.some(opt => opt.name === category.icon)) {
    let component = null;
    if (SiIcons[category.icon as keyof typeof SiIcons]) {
      component = SiIcons[category.icon as keyof typeof SiIcons];
    } else if (BsIcons[category.icon as keyof typeof BsIcons]) {
      component = BsIcons[category.icon as keyof typeof BsIcons];
    }
    if (component) {
      finalIconOptions.unshift({ name: category.icon, component });
    }
  }

  const comboboxOptions = finalIconOptions.map((option) => ({
    value: option.name,
    label: (
      <>
        <option.component className="inline mr-2 h-4 w-4" />
        {option.name}
      </>
    ),
  }));

  return (
    <>
      <FormField
        control={control}
        name="color"
        render={({ field, fieldState }) => (
          <FieldColorPicker
            label={t("dashboard.categories.color")}
            colors={colors}
            color={field.value}
            value={field.value}
            onChange={(color) => field.onChange(color.hex)}
            className="rounded-lg"
            error={fieldState.error?.message}
          />
        )}
      />

      <FormField
        control={control}
        name="icon"
        render={({ field }) => (
          <FieldCombobox
            label={t("dashboard.categories.icon")}
            options={comboboxOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder={t("dashboard.categories.icon_placeholder")}
            className="rounded-lg w-full"
          />
        )}
      />
    </>
  );
}