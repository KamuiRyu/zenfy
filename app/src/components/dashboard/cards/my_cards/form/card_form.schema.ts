import { z } from "zod";

export const cardFormSchema = z.object({
  lastFour: z.string().length(4, "Informe os 4 dígitos finais"),
  brand: z.string().min(1, "Selecione a bandeira"),
  holderName: z.string().min(1, "Informe o nome do titular"),
  bank: z.string().min(1, "Selecione o banco"),
  expiryDate: z.date({ message: "Selecione a data de vencimento" }),
  cardType: z.string().min(1, "Selecione o tipo do cartão"),
  billingDay: z.string().min(1, "Selecione o dia de fechamento"),
  billingDayDate: z.date().optional(),
  nickname: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type CardFormSchema = z.infer<typeof cardFormSchema>;
