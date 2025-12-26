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
  return request(base, "", { method: "POST", data: payload });
}

export async function updateCard(id: string | number, payload: Partial<CardType>) {
  const response = await request(base, `${id}`, {
    method: "PUT",
    data: payload,
  });
  return response;
}

export async function deleteCard(id: string | number) {
  return request(base, `${id}`, { method: "DELETE" });
}

const cardService = { getCards, getCard, createCard, updateCard, deleteCard };
export default cardService;
