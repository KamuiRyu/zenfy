import { request } from "@/services/service_base";

type Card = {
  id?: string | number;
  lastFour: string;
  expiry: string;
  holderName?: string;
  brand?: string;
  bank?: string;
};

const base = "/cards";

export async function getCards() {
  return request(base,"");
}

export async function getCard(id: string | number) {
  return request(base,`${id}`);
}

export async function createCard(payload: Partial<Card>) {
  return request(base,"", { method: "POST", data: payload });
}

export async function updateCard(id: string | number, payload: Partial<Card>) {
  return request(base,`${id}`, { method: "PUT", data: payload });
}

export async function deleteCard(id: string | number) {
  return request(base,`${id}`, { method: "DELETE" });
}

const cardService = { getCards, getCard, createCard, updateCard, deleteCard };
export default cardService;
