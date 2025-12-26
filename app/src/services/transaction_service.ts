import { request } from "@/services/service_base";
import { TransactionType } from "@/types/transactions";

const base = "/transactions";

export async function getTransactions(limit?: number, offset?: number, cardUuid?: string, dateFrom?: string, dateTo?: string, categoryId?: number, type?: string, search?: string, kind?: string, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  if (offset) params.append("offset", offset.toString());
  if (cardUuid) params.append("card_uuid", cardUuid);
  if (dateFrom) params.append("date_from", dateFrom);
  if (dateTo) params.append("date_to", dateTo);
  if (categoryId) params.append("category_id", categoryId.toString());
  if (type) params.append("type", type);
  if (search) params.append("search", search);
  if (kind) params.append("kind", kind);
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

export async function createTransaction(payload: Partial<TransactionType>) {
  return request(base, "", { method: "POST", data: payload });
}

export async function updateTransaction(id: string, payload: Partial<TransactionType>) {
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