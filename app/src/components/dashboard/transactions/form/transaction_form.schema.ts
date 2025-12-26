import { z } from "zod";

export const transactionSchema = z
  .object({
    description: z.string().min(1, "validation.required"),
    amount: z.number().min(1, "validation.required"),
    category_uuid: z.string().min(1, "validation.select_option"),
    card_uuid: z.string().min(1, "validation.select_option"),
    date: z.date(),
    type: z.enum(["income", "expense"]),
    kind: z.enum(["credit", "debit", "deposit", "withdrawal", "transfer"], { message: "validation.select_option" }),
    merchant: z.string().optional(),
    isInstallment: z.boolean().optional(),
    installmentNumber: z.number().optional(),
    totalInstallments: z.number().optional(),
    isRecurring: z.boolean().optional(),
    recurrenceType: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
    recurrenceStartDate: z.date().optional(),
    recurrenceEndDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isInstallment && data.isRecurring) {
      ctx.addIssue({
        code: "custom",
        message: "validation.installment_recurring_mutual_exclusive",
        path: ["isInstallment"],
      });
      ctx.addIssue({
        code: "custom",
        message: "validation.installment_recurring_mutual_exclusive",
        path: ["isRecurring"],
      });
    }

    if (data.isInstallment) {
      if (!data.installmentNumber) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["installmentNumber"],
        });
      }
      if (!data.totalInstallments) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
          path: ["totalInstallments"],
        });
      }
    }

    if (data.isRecurring) {
      if (!data.recurrenceType) {
        ctx.addIssue({
          code: "custom",
          message: "validation.select_option",
        });
      }

      if (!data.recurrenceStartDate) {
        ctx.addIssue({
          code: "custom",
          message: "validation.required",
        });
      }
    }
  });

export type TransactionFormData = z.infer<typeof transactionSchema>;
