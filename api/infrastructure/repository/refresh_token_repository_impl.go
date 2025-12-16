package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/uptrace/bun"

	"zenfy-api/domain/repository"
)

type refreshTokenRepoImpl struct {
	db *bun.DB
}

func NewRefreshTokenRepository(db *bun.DB) repository.RefreshTokenRepository {
	return &refreshTokenRepoImpl{db: db}
}

func (r *refreshTokenRepoImpl) Create(token string, userID int, expiresAt time.Time) error {
	ctx := context.Background()
	_, err := r.db.NewInsert().
		TableExpr("refresh_tokens").
		Value("token", "?", token).
		Value("user_id", "?", userID).
		Value("expires_at", "?", expiresAt).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("create refresh token: %w", err)
	}
	return nil
}

func (r *refreshTokenRepoImpl) Consume(token string) (int, error) {
	ctx := context.Background()
	var userID int
	err := r.db.NewRaw("DELETE FROM refresh_tokens WHERE token = ? AND expires_at > now() RETURNING user_id", token).
		Scan(ctx, &userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("invalid or expired token")
		}
		return 0, fmt.Errorf("consume refresh token: %w", err)
	}
	return userID, nil
}
