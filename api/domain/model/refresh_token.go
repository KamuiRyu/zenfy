package model

import "time"

type RefreshToken struct {
	Token     string    `json:"token" bun:"token,pk"`
	UserID    int       `json:"user_id" bun:"user_id,notnull"`
	ExpiresAt time.Time `json:"expires_at" bun:"expires_at,notnull"`
	CreatedAt time.Time `json:"created_at" bun:"created_at,notnull,default:current_timestamp"`
}
