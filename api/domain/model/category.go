package model

import "time"

// Category represents a transaction category
type Category struct {
	ID          int       `json:"-" bun:"id,pk,autoincrement"`
	Uuid        string    `json:"uuid" bun:"uuid,unique,notnull"`
	UserID      *int      `json:"user_id" bun:"user_id"`
	Name        string    `json:"name" bun:"name,notnull"`
	Description *string   `json:"description" bun:"description"`
	Color       *string   `json:"color" bun:"color"`
	Icon        *string   `json:"icon" bun:"icon"`
	Image       *string   `json:"image" bun:"image"`                         // Image URL or path
	Type        string    `json:"type" bun:"type,notnull,default:'expense'"` // expense, income, investment, transfer
	IsDefault   bool      `json:"is_default" bun:"is_default,notnull,default:false"`
	CreatedAt   time.Time `json:"created_at" bun:"created_at,notnull,default:current_timestamp"`
	UpdatedAt   time.Time `json:"updated_at" bun:"updated_at,notnull,default:current_timestamp"`
}

// NewCategory creates a new category instance
func NewCategory(userID *int, uuid, name, categoryType string, description, color, icon, image *string, isDefault bool) *Category {
	return &Category{
		UserID:      userID,
		Uuid:        uuid,
		Name:        name,
		Type:        categoryType,
		Description: description,
		Color:       color,
		Icon:        icon,
		Image:       image,
		IsDefault:   isDefault,
	}
}
