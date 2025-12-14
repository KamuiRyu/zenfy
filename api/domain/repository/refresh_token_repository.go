package repository

import "time"

type RefreshTokenRepository interface {
	Create(token string, userID int, expiresAt time.Time) error
	Consume(token string) (int, error)
}
