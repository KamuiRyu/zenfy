package dto

type CreateCategoryRequest struct {
	Name        string  `json:"name" validate:"required,min=2,max=100"`
	Type        string  `json:"type" validate:"required,oneof=expense income investment transfer"`
	Description *string `json:"description" validate:"omitempty,max=500"`
	Color       *string `json:"color" validate:"omitempty,len=7"` // Hex color like #FF5733
	Icon        *string `json:"icon" validate:"omitempty,max=50"` // Icon name or emoji
}

type UpdateCategoryRequest struct {
	Name        *string `json:"name" validate:"omitempty,min=2,max=100"`
	Type        *string `json:"type" validate:"omitempty,oneof=expense income investment transfer"`
	Description *string `json:"description" validate:"omitempty,max=500"`
	Color       *string `json:"color" validate:"omitempty,len=7"`
	Icon        *string `json:"icon" validate:"omitempty,max=50"`
}

type CategoryResponse struct {
	ID          int     `json:"id"`
	Uuid        string  `json:"uuid"`
	UserID      *int    `json:"user_id"`
	Name        string  `json:"name"`
	Type        string  `json:"type"`
	Description *string `json:"description"`
	Color       *string `json:"color"`
	Icon        *string `json:"icon"`
	IsDefault   bool    `json:"is_default"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}
