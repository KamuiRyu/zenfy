package model

import (
	"time"
)

// InvalidToken represents a blacklisted/invalidated token
type InvalidToken struct {
	ID        int       `bun:"id,pk,autoincrement"`
	Token     string    `bun:"token,unique"`
	UserID    int       `bun:"user_id"`
	CreatedAt time.Time `bun:"created_at"`
	ExpiresAt time.Time `bun:"expires_at"`
}

func NewInvalidToken(token string, userID int, expiresAt time.Time) *InvalidToken {
	return &InvalidToken{
		Token:     token,
		UserID:    userID,
		ExpiresAt: expiresAt,
	}
}
