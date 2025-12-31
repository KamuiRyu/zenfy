import { request } from "@/services/service_base";
import { CategoriesType } from "@/types/categories";

const base = "/categories";

export async function getCategories(filters?: { type?: string; search?: string; limit?: number; offset?: number }) {
  let queryParams = "";
  if (filters) {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
    queryParams = `?${params.toString()}`;
  }
  return request(base, queryParams);
}

export async function getCategory(id: string | number) {
  const response = await request(base, `${id}`);
  if (response.data) {
    return response.data;
  } else {
    return response;
  }
}

export async function createCategory(payload: Partial<CategoriesType>) {
  const result = await request(base, "", { method: "POST", data: payload });
  // Dispatch event to invalidate categories cache
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('categoryCreated'));
  }
  return result;
}

export async function updateCategory(id: string | number, payload: Partial<CategoriesType>) {
  const result = await request(base, `${id}`, {
    method: "PUT",
    data: payload,
  });
  // Dispatch event to invalidate categories cache
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('categoryUpdated'));
  }
  return result;
}

export async function deleteCategory(id: string | number) {
  const result = await request(base, `${id}`, { method: "DELETE" });
  // Dispatch event to invalidate categories cache
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('categoryDeleted'));
  }
  return result;
}

const categoryService = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
export default categoryService;