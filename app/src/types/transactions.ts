export interface TransactionType {
  uuid: string;
  description?: string;
  merchant?: string;
  category?: {
    name: string;
    type?: string;
    icon?: string;
    color?: string;
  };
  occurred_at: string;
  card_uuid?: string;
  amount: number;
  currency: string;
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
  id: number;
  name: string;
}