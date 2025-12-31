package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/uptrace/bun"

	"zenfy-api/domain/model"
)

type transactionRepositoryImpl struct {
	db *bun.DB
}

func NewTransactionRepository(db *bun.DB) *transactionRepositoryImpl {
	return &transactionRepositoryImpl{db: db}
}

func (r *transactionRepositoryImpl) Create(tx *model.Transaction) error {
	ctx := context.Background()
	_, err := r.db.NewInsert().
		Model(tx).
		Returning("*").
		Exec(ctx)
	fmt.Print(err)
	return err
}

func (r *transactionRepositoryImpl) FindByID(id int) (*model.Transaction, error) {
	ctx := context.Background()
	transaction := &model.Transaction{}
	err := r.db.NewSelect().
		Model(transaction).
		Relation("Category").
		Relation("Card").
		Where("transactions.id = ?", id).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("transaction not found")
	}

	return transaction, err
}

func (r *transactionRepositoryImpl) FindByUUID(uuid string) (*model.Transaction, error) {
	ctx := context.Background()
	transaction := &model.Transaction{}
	err := r.db.NewSelect().
		Model(transaction).
		ModelTableExpr("transactions as transaction").
		Relation("Category").
		Relation("Card").
		Where("transaction.uuid = ?", uuid).
		Scan(ctx)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("transaction not found")
	}

	return transaction, err
}

func (r *transactionRepositoryImpl) ListByCard(cardID int, limit, offset int) ([]*model.Transaction, error) {
	ctx := context.Background()
	var transactions []*model.Transaction
	err := r.db.NewSelect().
		Model(&transactions).
		Relation("Category").
		Relation("Card").
		Where("card_id = ?", cardID).
		Order("occurred_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(ctx)

	return transactions, err
}

func (r *transactionRepositoryImpl) ListByUser(userID int, limit, offset int, dateFrom, dateTo *time.Time, categoryID *string, kind *string, recurring *bool, search *string, cardID *int, typeStr *string) ([]*model.Transaction, error) {
	ctx := context.Background()
	var transactions []*model.Transaction
	query := r.db.NewSelect().
		Model(&transactions).
		ModelTableExpr("transactions as transaction").
		Relation("Category").
		Relation("Card").
		Where("transaction.user_id = ?", userID)

	if dateFrom != nil {
		query = query.Where("transaction.occurred_at >= ?", *dateFrom)
	}
	if dateTo != nil {
		query = query.Where("transaction.occurred_at <= ?", *dateTo)
	}
	if categoryID != nil {
		query = query.Where("transaction.category_id = ?", *categoryID)
	}
	if kind != nil {
		query = query.Where("transaction.kind = ?", *kind)
	}
	if search != nil {
		query = query.Where("transaction.description ILIKE ? OR transaction.merchant ILIKE ?", "%"+*search+"%", "%"+*search+"%")
	}

	if cardID != nil {
		query = query.Where("transaction.card_id = ?", *cardID)
	}
	if typeStr != nil {
		query = query.Where("category.type = ?", *typeStr)
	}

	if recurring != nil {
		query = query.Where("transaction.is_recurring = ?", *recurring)
	}

	err := query.
		Order("transaction.occurred_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(ctx)

	return transactions, err
}

func (r *transactionRepositoryImpl) SummaryByCategory(cardID int, from, to time.Time) (map[int]int64, error) {
	ctx := context.Background()
	var results []struct {
		CategoryID int   `bun:"category_id"`
		Total      int64 `bun:"total"`
	}

	err := r.db.NewSelect().
		Model((*model.Transaction)(nil)).
		ColumnExpr("category_id, SUM(CASE WHEN kind = 'debit' THEN amount ELSE -amount END) as total").
		Where("card_id = ?", cardID).
		Where("occurred_at >= ?", from).
		Where("occurred_at <= ?", to).
		Group("category_id").
		Scan(ctx, &results)

	if err != nil {
		return nil, err
	}

	summary := make(map[int]int64)
	for _, result := range results {
		summary[result.CategoryID] = result.Total
	}

	return summary, nil
}

func (r *transactionRepositoryImpl) Update(tx *model.Transaction) error {
	ctx := context.Background()
	result, err := r.db.NewUpdate().
		Model(tx).
		Column("amount", "currency", "category_id", "kind", "merchant", "description", "metadata", "occurred_at", "updated_at",
			"is_recurring", "recurrence_type", "recurrence_end_date",
			"is_installment", "installment_number", "total_installments").
		Where("id = ?", tx.ID).
		Exec(ctx)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("transaction not found")
	}

	return nil
}

func (r *transactionRepositoryImpl) Delete(id int) error {
	ctx := context.Background()
	result, err := r.db.NewDelete().
		Model((*model.Transaction)(nil)).
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
		return fmt.Errorf("transaction not found")
	}

	return nil
}

func (r *transactionRepositoryImpl) DeleteByUUID(uuid string) error {
	ctx := context.Background()
	result, err := r.db.NewDelete().
		Model((*model.Transaction)(nil)).
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
		return fmt.Errorf("transaction not found")
	}

	return nil
}

func (r *transactionRepositoryImpl) ListRecurring(userID int) ([]*model.Transaction, error) {
	ctx := context.Background()
	var transactions []*model.Transaction
	err := r.db.NewSelect().
		Model(&transactions).
		Where("user_id = ?", userID).
		Where("is_recurring = ?", true).
		Order("occurred_at DESC").
		Scan(ctx)

	return transactions, err
}

func (r *transactionRepositoryImpl) ListInstallments(originalTransactionID int) ([]*model.Transaction, error) {
	ctx := context.Background()
	var transactions []*model.Transaction
	err := r.db.NewSelect().
		Model(&transactions).
		Order("installment_number ASC").
		Scan(ctx)

	return transactions, err
}
