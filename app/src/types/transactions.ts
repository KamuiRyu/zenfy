import { CardType } from "./cards";
import { CategoriesType } from "./categories";
import { Filter } from "./base";

export type TransactionKind = "credit" | "debit" | "withdrawal" | "deposit" | "transfer";
export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly" | undefined;

export interface TransactionType {
  uuid: string;
  description?: string;
  merchant?: string;
  category_uuid?: string;
  card_uuid?: string;
  kind: TransactionKind;
  category?: CategoriesType;
  card?: CardType;
  occurred_at: string;
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


export interface TransactionData {
  description?: string;
  merchant?: string;
  category_uuid: string;
  card_uuid: string;
  kind: TransactionKind;
  occurred_at: Date;
  amount: number;
  isInstallment?: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceStartDate?: Date;
  recurrenceEndDate?: Date;
}

export interface TransactionFiltersAPI extends Filter{
  date_from?: string;
  date_to?: string;
  category_id?: number;
  type?: string;
  kind?: string;
  search?: string;
  card_uuid?: string;
}