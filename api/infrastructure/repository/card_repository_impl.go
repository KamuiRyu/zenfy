package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/uptrace/bun"

	"zenfy-api/domain/model"
)

type cardRepositoryImpl struct {
	db *bun.DB
}

func NewCardRepository(db *bun.DB) *cardRepositoryImpl {
	return &cardRepositoryImpl{db: db}
}

func (r *cardRepositoryImpl) Create(card *model.Card) error {
	ctx := context.Background()
	_, err := r.db.NewInsert().
		Model(card).
		Returning("*").
		Exec(ctx)
	fmt.Print(err)
	return err
}

func (r *cardRepositoryImpl) FindByID(id int) (*model.Card, error) {
	ctx := context.Background()
	card := &model.Card{}
	err := r.db.NewSelect().
		Model(card).
		Where("id = ?", id).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("card not found")
	}

	return card, err
}

func (r *cardRepositoryImpl) FindByUUID(uuid string) (*model.Card, error) {
	ctx := context.Background()
	card := &model.Card{}
	err := r.db.NewSelect().
		Model(card).
		Where("uuid = ?", uuid).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("card not found")
	}

	return card, err
}

func (r *cardRepositoryImpl) FindByUserID(userID int) ([]*model.Card, error) {
	ctx := context.Background()
	var cards []*model.Card
	err := r.db.NewSelect().
		Model(&cards).
		Where("user_id = ?", userID).
		Order("is_default DESC", "created_at DESC").
		Scan(ctx)

	return cards, err
}

func (r *cardRepositoryImpl) FindDefaultByUserID(userID int) (*model.Card, error) {
	ctx := context.Background()
	card := &model.Card{}
	err := r.db.NewSelect().
		Model(card).
		Where("user_id = ?", userID).
		Where("is_default = ?", true).
		Limit(1).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, nil // No default card
	}

	return card, err
}

func (r *cardRepositoryImpl) Update(card *model.Card) error {
	ctx := context.Background()
	result, err := r.db.NewUpdate().
		Model(card).
		Column("last_four", "brand", "bank", "card_type", "holder_name", "nickname", "expiry_month", "expiry_year", "billing_day", "is_default", "updated_at").
		Where("id = ?", card.ID).
		Exec(ctx)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("card not found")
	}

	return nil
}

func (r *cardRepositoryImpl) DeleteByUUID(uuid string) error {
	ctx := context.Background()
	result, err := r.db.NewDelete().
		Model((*model.Card)(nil)).
		Where("uuid = ?", uuid).
		Exec(ctx)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("card not found")
	}

	return nil
}

func (r *cardRepositoryImpl) Delete(id int) error {
	ctx := context.Background()
	result, err := r.db.NewDelete().
		Model((*model.Card)(nil)).
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
		return fmt.Errorf("card not found")
	}

	return nil
}

func (r *cardRepositoryImpl) SetDefault(userID, cardID int) error {
	ctx := context.Background()

	return r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		// Unset all default cards for this user
		_, err := tx.NewUpdate().
			Model((*model.Card)(nil)).
			Set("is_default = ?", false).
			Where("user_id = ?", userID).
			Exec(ctx)
		if err != nil {
			return err
		}

		// Set the new default card
		result, err := tx.NewUpdate().
			Model((*model.Card)(nil)).
			Set("is_default = ?", true).
			Where("id = ?", cardID).
			Where("user_id = ?", userID).
			Exec(ctx)
		if err != nil {
			return err
		}

		rows, err := result.RowsAffected()
		if err != nil {
			return err
		}

		if rows == 0 {
			return fmt.Errorf("card not found or doesn't belong to user")
		}

		return nil
	})
}
