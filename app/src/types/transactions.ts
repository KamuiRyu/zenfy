import { CardType } from "./cards";
import { CategoriesType } from "./categories";

export type TransactionKind = "credit" | "debit" | "withdrawal" | "deposit" | "transfer";
export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly" | undefined;

export interface TransactionType {
  uuid: string;
  description?: string;
  merchant?: string;
  kind: TransactionKind;
  category?: CategoriesType;
  card?: CardType;
  occurred_at: string;
  card_uuid?: string;
  amount: number;
  currency: string;
  ocurred_date: string;
  is_installment: boolean;
  installment_number?: number;
  total_installments?: number;
  is_recurring: boolean;
  recurrence_type?: RecurrenceType;
  recurrence_start_date?: string;
  recurrence_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionFiltersType {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
  type?: string;
  kind?: string;
  search?: string;
  cardUuid?: string;
}

export interface CategoryType {
  id?: number;
  uuid: string;
  name: string;
}
