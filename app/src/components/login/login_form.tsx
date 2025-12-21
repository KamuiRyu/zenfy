"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldInput } from "@/components/forms/field_input";
import { Form, FormField } from "@/components/ui/form";
import { AlertDanger } from "../forms/alert";
import { useI18n } from "@/i18n/useI18n";
import { translateFormMessage } from "@/lib/utils";

type LoginFormType = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  const LoginSchema = z.object({
    email: z.string().email(t("validation.EMAIL_FORMAT")),
    password: z.string().min(1, t("validation.REQUIRED_FIELD")),
  });

  const methods = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const { control, handleSubmit, formState } = methods;
  const { isValid, isSubmitting } = formState;

  async function onSubmit(data: LoginFormType) {
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      ...data,
    });

    if (res?.error) {
      try {
        const parsed = JSON.parse(res.error);
        if (
          parsed &&
          parsed.code === "VALIDATION_ERROR" &&
          Array.isArray(parsed.errors)
        ) {
          parsed.errors.forEach((err: any) => {
            if (err && err.field) {
              methods.setError(err.field, {
                type: "server",
                message: translateFormMessage(
                  t,
                  err.message ?? parsed.message ?? ""
                ),
              });
            }
          });
          return;
        }

        setError(
          translateFormMessage(t, parsed.code ?? res.error)
        );
        return;
      } catch (e) {
        setError(translateFormMessage(t, res.error));
        return;
      }
    }

    router.push("/dashboard");
  }

  return (
    <div className="rounded-2xl p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-lg font-bold">Zenfy</div>
            <div className="text-xs text-muted-foreground">{t("login.welcome")}</div>
          </div>
        </div>
      </div>

      {error && (
        <AlertDanger title={t("login.errorTitle")} description={error} className="mb-6" />
      )}

      <Form {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)();
          }}
          className="space-y-4"
        >
          <FormField
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <FieldInput
                label={t("field.email.label")}
                type="text"
                id="email"
                placeholder={t("field.email.placeholder")}
                {...field}
                error={fieldState.error?.message}
                className="rounded-lg p-5"
                disabled={isSubmitting}
              />
            )}
          />

          <FormField
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <FieldInput
                label={t("field.password.label")}
                id="password"
                placeholder={t("field.password.placeholder")}
                type="password"
                {...field}
                error={fieldState.error?.message}
                className="rounded-lg p-5"
                disabled={isSubmitting}
              />
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-full py-3 mt-2"
            disabled={!isValid || isSubmitting}
            aria-disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? t("login.loggingIn") : t("login.loginButton")}
          </Button>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-indigo-600 hover:underline">
              {t("login.forgot")}
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}
