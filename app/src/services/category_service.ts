import { request } from "@/services/service_base";
import { CategoriesType } from "@/types/categories";

const base = "/categories";

export async function getCategories(filters?: { type?: string; search?: string }) {
  let queryParams = "";
  if (filters) {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.search) params.append("search", filters.search);
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
  return request(base, "", { method: "POST", data: payload });
}

export async function updateCategory(id: string | number, payload: Partial<CategoriesType>) {
  const response = await request(base, `${id}`, {
    method: "PUT",
    data: payload,
  });
  return response;
}

export async function deleteCategory(id: string | number) {
  return request(base, `${id}`, { method: "DELETE" });
}

const categoryService = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
export default categoryService;