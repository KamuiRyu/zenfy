package repository

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
	_, err := r.db.NewInsert().
		TableExpr("verification_tokens").
		Value("token", "?", token).
		Value("user_id", "?", userID).
		Value("expires_at", "?", expiresAt).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("create verification token: %w", err)
	}
	return nil
}

func (r *verificationTokenRepoImpl) Consume(token string) (int, error) {
	ctx := context.Background()
	var userID int
	err := r.db.NewRaw("DELETE FROM verification_tokens WHERE token = ? AND used = FALSE AND expires_at > now() RETURNING user_id", token).
		Scan(ctx, &userID)
	if err != nil {
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
	err := r.db.NewSelect().
		TableExpr("verification_tokens").
		Column("created_at").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(1).
		Scan(ctx, &createdAt)
	if err != nil {
		return time.Time{}, err
	}
	return createdAt, nil
}
