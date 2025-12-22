package repository

import "time"

// InvalidTokenRepository defines methods for managing invalid tokens
type InvalidTokenRepository interface {
	Create(token string, userID int, expiresAt time.Time) error
	IsInvalid(token string) (bool, error)
	CleanupExpired() error
}
