package repository

import (
	"context"
	"time"

	"github.com/uptrace/bun"

	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type invalidTokenRepositoryImpl struct {
	db *bun.DB
}

func NewInvalidTokenRepository(db *bun.DB) repository.InvalidTokenRepository {
	return &invalidTokenRepositoryImpl{db: db}
}

func (r *invalidTokenRepositoryImpl) Create(token string, userID int, expiresAt time.Time) error {
	ctx := context.Background()
	invalidToken := model.NewInvalidToken(token, userID, expiresAt)
	_, err := r.db.NewInsert().
		Model(invalidToken).
		Exec(ctx)
	return err
}

func (r *invalidTokenRepositoryImpl) IsInvalid(token string) (bool, error) {
	ctx := context.Background()
	var count int
	count, err := r.db.NewSelect().
		Model((*model.InvalidToken)(nil)).
		Where("token = ? AND expires_at > ?", token, time.Now()).
		Count(ctx)
	return count > 0, err
}

func (r *invalidTokenRepositoryImpl) CleanupExpired() error {
	ctx := context.Background()
	_, err := r.db.NewDelete().
		Model((*model.InvalidToken)(nil)).
		Where("expires_at <= ?", time.Now()).
		Exec(ctx)
	return err
}
