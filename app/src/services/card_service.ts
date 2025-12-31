import { request } from "@/services/service_base";
import { CardType } from "@/types/cards";


const base = "/cards";

export async function getCards() {
  return request(base, "");
}

export async function getCard(id: string | number) {
  const response = await request(base, `${id}`);
  if (response.data) {
    return response.data;
  } else {
    return response;
  }
}

export async function createCard(payload: Partial<CardType>) {
  const result = await request(base, "", { method: "POST", data: payload });
  // Dispatch event to invalidate cards cache
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cardCreated'));
  }
  return result;
}

export async function updateCard(id: string | number, payload: Partial<CardType>) {
  const result = await request(base, `${id}`, {
    method: "PUT",
    data: payload,
  });
  // Dispatch event to invalidate cards cache
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cardUpdated'));
  }
  return result;
}

export async function deleteCard(id: string | number) {
  const result = await request(base, `${id}`, { method: "DELETE" });
  // Dispatch event to invalidate cards cache
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cardDeleted'));
  }
  return result;
}

const cardService = { getCards, getCard, createCard, updateCard, deleteCard };
export default cardService;
