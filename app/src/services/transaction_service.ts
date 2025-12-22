import { request } from "@/services/service_base";

type Transaction = {
  uuid: string;
  card_uuid: string;
  user_uuid: string;
  category_uuid: string;
  category?: {
    uuid: string;
    user_id?: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };
  amount: number;
  currency: string;
  type: string;
  merchant?: string;
  description?: string;
  metadata?: Record<string, any>;
  occurred_at: string;
  created_at: string;
  updated_at: string;
  is_recurring: boolean;
  recurrence_type?: string;
  recurrence_interval?: number;
  recurrence_end_date?: string;
  is_installment: boolean;
  installment_number?: number;
  total_installments?: number;
  original_transaction_id?: number;
};

const base = "/transactions";

export async function getTransactions(limit?: number, offset?: number, cardUuid?: string, dateFrom?: string, dateTo?: string, categoryId?: number, type?: string, search?: string, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  if (offset) params.append("offset", offset.toString());
  if (cardUuid) params.append("card_uuid", cardUuid);
  if (dateFrom) params.append("date_from", dateFrom);
  if (dateTo) params.append("date_to", dateTo);
  if (categoryId) params.append("category_id", categoryId.toString());
  if (type) params.append("type", type);
  if (search) params.append("search", search);
  return request(base, `?${params.toString()}`, {}, signal);
}

export async function getTransactionsByCard(cardUuid: string, limit?: number, offset?: number) {
  return getTransactions(limit, offset, cardUuid);
}

export async function getTransaction(id: string) {
  const response = await request(base, `${id}`);
  if (response.data) {
    return response.data;
  } else {
    return response;
  }
}

export async function createTransaction(payload: Partial<Transaction>) {
  return request(base, "", { method: "POST", data: payload });
}

export async function updateTransaction(id: string, payload: Partial<Transaction>) {
  const response = await request(base, `${id}`, {
    method: "PUT",
    data: payload,
  });
  return response;
}

export async function deleteTransaction(id: string) {
  return request(base, `${id}`, { method: "DELETE" });
}

const transactionService = {
  getTransactions,
  getTransactionsByCard,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
};

export default transactionService;