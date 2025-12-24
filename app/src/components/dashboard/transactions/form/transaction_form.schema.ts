import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "validation.required"),
  amount: z.string().min(1, "validation.required"),
  category_uuid: z.string().min(1, "validation.select_option"),
  card_uuid: z.string().min(1, "validation.select_option"),
  date: z.date(),
  type: z.enum(["income", "expense", "investment"]),
  kind: z.enum(["credit", "debit"], { message: "validation.select_option" }),
  isInstallment: z.boolean().optional(),
  installmentNumber: z.number().optional(),
  totalInstallments: z.number().optional(),
  isRecurring: z.boolean().optional(),
  recurrenceType: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  recurrenceStartDate: z.date().optional(),
  recurrenceEndDate: z.date().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;