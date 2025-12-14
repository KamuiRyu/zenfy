package repositoryimpl

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/uptrace/bun"

	"zenfy-api/domain/repository"
)

type verificationTokenRepoImpl struct {
	db *bun.DB
}

func NewVerificationTokenRepository(db *bun.DB) repository.VerificationTokenRepository {
	return &verificationTokenRepoImpl{db: db}
}

func (r *verificationTokenRepoImpl) Create(token string, userID int, expiresAt time.Time) error {
	ctx := context.Background()
	_, err := r.db.ExecContext(ctx, "INSERT INTO verification_tokens(token, user_id, expires_at) VALUES(?, ?, ?)", token, userID, expiresAt)
	if err != nil {
		return fmt.Errorf("create verification token: %w", err)
	}
	return nil
}

func (r *verificationTokenRepoImpl) Consume(token string) (int, error) {
	ctx := context.Background()
	var userID int
	row := r.db.QueryRowContext(ctx, `DELETE FROM verification_tokens WHERE token = ? AND used = FALSE AND expires_at > now() RETURNING user_id`, token)
	if err := row.Scan(&userID); err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("invalid or expired token")
		}
		return 0, fmt.Errorf("consume verification token: %w", err)
	}
	return userID, nil
}

func (r *verificationTokenRepoImpl) GetLatestCreatedAt(userID int) (time.Time, error) {
	ctx := context.Background()
	var createdAt time.Time
	row := r.db.QueryRowContext(ctx, "SELECT created_at FROM verification_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", userID)
	if err := row.Scan(&createdAt); err != nil {
		return time.Time{}, err
	}
	return createdAt, nil
}
