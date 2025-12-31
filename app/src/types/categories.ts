export type CategoryType = "expense" | "income";

export interface CategoriesType {
    uuid: string;
    name: string;
    type: CategoryType;
    description?: string;
    color?: string;
    icon?: string;
    is_default?: boolean;
    created_at: string;
    updated_at: string;
}