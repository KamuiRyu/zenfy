package repositoryimpl

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

// NewUserRepository constructs a new repository implementation using the provided bun DB.
func NewUserRepository(db *bun.DB) repository.UserRepository {
	return &userRepoImpl{db: db}
}

func (r *userRepoImpl) GetByID(id int) (*model.User, error) {
	ctx := context.Background()
	u := &model.User{}
	row := r.db.QueryRowContext(ctx, "SELECT id, uuid, name, email, password, created_at, verified FROM users WHERE id = ?", id)
	if err := row.Scan(&u.ID, &u.Uuid, &u.Name, &u.Email, &u.Password, &u.CreatedAt, &u.Verified); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query user: %w", err)
	}
	return u, nil
}

func (r *userRepoImpl) Create(u *model.User) error {
	ctx := context.Background()
	row := r.db.QueryRowContext(ctx, "INSERT INTO users(name,email,password,uuid) VALUES(?, ?, ?, ?) RETURNING id", u.Name, u.Email, u.Password, u.Uuid)
	if err := row.Scan(&u.ID); err != nil {
		return fmt.Errorf("insert user: %w", err)
	}
	return nil
}

func (r *userRepoImpl) GetByEmail(email string) (*model.User, error) {
	ctx := context.Background()
	u := &model.User{}
	row := r.db.QueryRowContext(ctx, "SELECT id, uuid, name, email, password, created_at, verified FROM users WHERE email = ?", email)
	if err := row.Scan(&u.ID, &u.Uuid, &u.Name, &u.Email, &u.Password, &u.CreatedAt, &u.Verified); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("query user by email: %w", err)
	}
	return u, nil
}

func (r *userRepoImpl) SetVerified(id int) error {
	ctx := context.Background()
	if _, err := r.db.ExecContext(ctx, "UPDATE users SET verified = TRUE WHERE id = ?", id); err != nil {
		return fmt.Errorf("set verified: %w", err)
	}
	return nil
}

func (r *userRepoImpl) UpdatePassword(userID int, newHashedPassword string) error {
	ctx := context.Background()
	if _, err := r.db.ExecContext(ctx, "UPDATE users SET password = ? WHERE id = ?", newHashedPassword, userID); err != nil {
		return fmt.Errorf("update password: %w", err)
	}
	return nil
}
