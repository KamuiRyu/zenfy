package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/uptrace/bun"

	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type userRepoImpl struct {
	db *bun.DB
}

func NewUserRepository(db *bun.DB) repository.UserRepository {
	return &userRepoImpl{db: db}
}

func (r *userRepoImpl) GetByID(id int) (*model.User, error) {
	ctx := context.Background()
	u := &model.User{}
	err := r.db.NewSelect().
		Model(u).
		Where("id = ?", id).
		Scan(ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query user: %w", err)
	}
	return u, nil
}

func (r *userRepoImpl) Create(u *model.User) error {
	ctx := context.Background()
	_, err := r.db.NewInsert().
		Model(u).
		Returning("*").
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("insert user: %w", err)
	}
	return nil
}

func (r *userRepoImpl) GetByEmail(email string) (*model.User, error) {
	ctx := context.Background()
	u := &model.User{}
	err := r.db.NewSelect().
		Model(u).
		Where("email = ?", email).
		Scan(ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query user by email: %w", err)
	}
	return u, nil
}

func (r *userRepoImpl) SetVerified(id int) error {
	ctx := context.Background()
	_, err := r.db.NewUpdate().
		Model((*model.User)(nil)).
		Set("verified = ?", true).
		Where("id = ?", id).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("set verified: %w", err)
	}
	return nil
}

func (r *userRepoImpl) UpdatePassword(userID int, newHashedPassword string) error {
	ctx := context.Background()
	_, err := r.db.NewUpdate().
		Model((*model.User)(nil)).
		Set("password = ?", newHashedPassword).
		Where("id = ?", userID).
		Exec(ctx)
	if err != nil {
		return fmt.Errorf("update password: %w", err)
	}
	return nil
}
