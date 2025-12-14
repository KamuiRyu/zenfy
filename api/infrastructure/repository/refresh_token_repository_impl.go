package repositoryimpl

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
	_, err := r.db.ExecContext(ctx, "INSERT INTO refresh_tokens(token, user_id, expires_at) VALUES(?, ?, ?)", token, userID, expiresAt)
	if err != nil {
		return fmt.Errorf("create refresh token: %w", err)
	}
	return nil
}

func (r *refreshTokenRepoImpl) Consume(token string) (int, error) {
	ctx := context.Background()
	var userID int
	row := r.db.QueryRowContext(ctx, `DELETE FROM refresh_tokens WHERE token = ? AND expires_at > now() RETURNING user_id`, token)
	if err := row.Scan(&userID); err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("invalid or expired token")
		}
		return 0, fmt.Errorf("consume refresh token: %w", err)
	}
	return userID, nil
}
