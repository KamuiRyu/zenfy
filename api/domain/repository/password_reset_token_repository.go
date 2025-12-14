package repository

import "time"

type PasswordResetTokenRepository interface {
	Create(token string, userID int, expiresAt time.Time) error
	Consume(token string) (int, error)
	GetLatestCreatedAt(userID int) (time.Time, error)
}
