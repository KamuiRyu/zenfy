package repositoryimpl

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/uptrace/bun"

	"zenfy-api/domain/repository"
)

type passwordResetTokenRepoImpl struct {
	db *bun.DB
}

func NewPasswordResetTokenRepository(db *bun.DB) repository.PasswordResetTokenRepository {
	return &passwordResetTokenRepoImpl{db: db}
}

func (r *passwordResetTokenRepoImpl) Create(token string, userID int, expiresAt time.Time) error {
	ctx := context.Background()
	_, err := r.db.ExecContext(ctx, "INSERT INTO password_reset_tokens(token, user_id, expires_at) VALUES(?, ?, ?)", token, userID, expiresAt)
	if err != nil {
		return fmt.Errorf("create password reset token: %w", err)
	}
	return nil
}

func (r *passwordResetTokenRepoImpl) Consume(token string) (int, error) {
	ctx := context.Background()
	var userID int
	row := r.db.QueryRowContext(ctx, `DELETE FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > now() RETURNING user_id`, token)
	if err := row.Scan(&userID); err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("invalid or expired token")
		}
		return 0, fmt.Errorf("consume password reset token: %w", err)
	}
	return userID, nil
}

func (r *passwordResetTokenRepoImpl) GetLatestCreatedAt(userID int) (time.Time, error) {
	ctx := context.Background()
	var createdAt time.Time
	row := r.db.QueryRowContext(ctx, "SELECT created_at FROM password_reset_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", userID)
	if err := row.Scan(&createdAt); err != nil {
		return time.Time{}, err
	}
	return createdAt, nil
}
