package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/uptrace/bun"

	"zenfy-api/domain/model"
)

type categoryRepositoryImpl struct {
	db *bun.DB
}

func NewCategoryRepository(db *bun.DB) *categoryRepositoryImpl {
	return &categoryRepositoryImpl{db: db}
}

func (r *categoryRepositoryImpl) Create(category *model.Category) error {
	ctx := context.Background()
	_, err := r.db.NewInsert().
		Model(category).
		Returning("*").
		Exec(ctx)
	return err
}

func (r *categoryRepositoryImpl) FindByID(id int) (*model.Category, error) {
	ctx := context.Background()
	category := &model.Category{}
	err := r.db.NewSelect().
		Model(category).
		Where("id = ?", id).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("category not found")
	}

	return category, err
}

func (r *categoryRepositoryImpl) FindByUUID(uuid string) (*model.Category, error) {
	ctx := context.Background()
	category := &model.Category{}
	err := r.db.NewSelect().
		Model(category).
		Where("uuid = ?", uuid).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("category not found")
	}

	return category, err
}

func (r *categoryRepositoryImpl) FindByNameAndUserID(name string, userID int) (*model.Category, error) {
	ctx := context.Background()
	category := &model.Category{}
	err := r.db.NewSelect().
		Model(category).
		Where("name = ? AND user_id = ?", name, userID).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	return category, err
}

func (r *categoryRepositoryImpl) ListByUser(userID int) ([]*model.Category, error) {
	ctx := context.Background()
	var categories []*model.Category
	err := r.db.NewSelect().
		Model(&categories).
		Where("user_id = ? OR user_id IS NULL", userID).
		Order("is_default DESC, name ASC").
		Scan(ctx)

	return categories, err
}

func (r *categoryRepositoryImpl) Update(category *model.Category) error {
	ctx := context.Background()
	result, err := r.db.NewUpdate().
		Model(category).
		Column("name", "type", "description", "color", "icon", "updated_at").
		Where("id = ?", category.ID).
		Exec(ctx)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("category not found")
	}

	return nil
}

func (r *categoryRepositoryImpl) Delete(id int) error {
	ctx := context.Background()
	result, err := r.db.NewDelete().
		Model((*model.Category)(nil)).
		Where("id = ?", id).
		Exec(ctx)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("category not found")
	}

	return nil
}

func (r *categoryRepositoryImpl) FindDefaultCategories() ([]*model.Category, error) {
	ctx := context.Background()
	var categories []*model.Category
	err := r.db.NewSelect().
		Model(&categories).
		Where("is_default = TRUE").
		Order("name ASC").
		Scan(ctx)

	return categories, err
}
