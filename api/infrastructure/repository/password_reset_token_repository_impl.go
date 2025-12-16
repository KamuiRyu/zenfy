package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/uptrace/bun"

	"zenfy-api/domain/model"
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
	passwordResetToken := &model.PasswordResetToken{
		Token:     token,
		UserID:    userID,
		ExpiresAt: expiresAt,
	}
	_, err := r.db.NewInsert().
		Model(passwordResetToken).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("create password reset token: %w", err)
	}
	return nil
}

func (r *passwordResetTokenRepoImpl) Consume(token string) (int, error) {
	ctx := context.Background()
	var userID int
	err := r.db.NewRaw("DELETE FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > now() RETURNING user_id", token).
		Scan(ctx, &userID)
	if err != nil {
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
	err := r.db.NewSelect().
		TableExpr("password_reset_tokens").
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
