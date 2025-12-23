import { request } from "@/services/service_base";

type Category = {
  id?: number;
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
};

const base = "/categories";

export async function getCategories() {
  return request(base, "");
}

export async function getCategory(id: string | number) {
  const response = await request(base, `${id}`);
  if (response.data) {
    return response.data;
  } else {
    return response;
  }
}

export async function createCategory(payload: Partial<Category>) {
  return request(base, "", { method: "POST", data: payload });
}

export async function updateCategory(id: string | number, payload: Partial<Category>) {
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