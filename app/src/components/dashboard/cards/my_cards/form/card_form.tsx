"use client";
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardFormSchema } from "./card_form.schema";
import { UseFormReturn } from "react-hook-form";
import { useI18n } from "@/i18n/useI18n";
import { CardInfoTab } from "./tabs/card_info_tab";
import { CardDetailsTab } from "./tabs/card_details_tab";
import { CardSettingsTab } from "./tabs/card_settings_tab";

type CardFormProps = {
  control: UseFormReturn<CardFormSchema>["control"];
  handleSubmit: UseFormReturn<CardFormSchema>["handleSubmit"];
  setValue: UseFormReturn<CardFormSchema>["setValue"];
  watch: UseFormReturn<CardFormSchema>["watch"];
  formState: UseFormReturn<CardFormSchema>["formState"];
  loading?: boolean;
  onSubmit?: (values: CardFormSchema) => void;
  submitLabel?: string;
  renderPreview?: (values: Partial<CardFormSchema>) => React.ReactNode;
};

export const CardForm = React.memo(function CardForm({
  control,
  handleSubmit,
  setValue,
  watch,
  formState,
  loading = false,
  onSubmit,
  submitLabel = "Salvar",
  renderPreview,
}: CardFormProps) {
  const [openExpiry, setOpenExpiry] = useState(false);
  const [openBillingDay, setOpenBillingDay] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const errors = formState.errors;
  const { t } = useI18n();

  const values = watch();

  const getDefaultTab = () => {
    const basicFields = ['lastFour', 'brand', 'holderName'];
    const detailsFields = ['bank', 'cardType', 'nickname'];
    const settingsFields = ['expiryDate', 'billingDay', 'isDefault'];

    if (basicFields.some(field => errors[field as keyof CardFormSchema])) return 'basic';
    if (detailsFields.some(field => errors[field as keyof CardFormSchema])) return 'details';
    if (settingsFields.some(field => errors[field as keyof CardFormSchema])) return 'settings';
    return 'basic';
  };


  return (
    <>
      {renderPreview && renderPreview(values)}
      <form
        onSubmit={handleSubmit(onSubmit || (() => {}), () => {
          const tab = getDefaultTab();
          setActiveTab(tab);
        })}
        className="grid gap-4"
        autoComplete="off"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">{t("dashboard.cards.tabs.basic")}</TabsTrigger>
            <TabsTrigger value="details">{t("dashboard.cards.tabs.details")}</TabsTrigger>
            <TabsTrigger value="settings">{t("dashboard.cards.tabs.settings")}</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300">
            <CardInfoTab control={control} formState={formState} loading={loading} />
          </TabsContent>
          <TabsContent value="details" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300">
            <CardDetailsTab control={control} formState={formState} loading={loading} />
          </TabsContent>
          <TabsContent value="settings" className="mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300">
            <CardSettingsTab
              control={control}
              setValue={setValue}
              formState={formState}
              loading={loading}
              openExpiry={openExpiry}
              setOpenExpiry={setOpenExpiry}
              openBillingDay={openBillingDay}
              setOpenBillingDay={setOpenBillingDay}
            />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-4 gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? t("dashboard.cards.saving") : submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
});
