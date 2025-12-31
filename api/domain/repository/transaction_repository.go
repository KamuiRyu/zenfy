package repository

import (
	"time"

	"zenfy-api/domain/model"
)

type TransactionRepository interface {
	Create(tx *model.Transaction) error
	FindByID(id int) (*model.Transaction, error)
	FindByUUID(uuid string) (*model.Transaction, error)
	ListByCard(cardID int, limit, offset int) ([]*model.Transaction, error)
	CountByCard(cardID int) (int64, error)
	ListByUser(userID int, limit, offset int, dateFrom, dateTo *time.Time, categoryID *int, kind *string, recurring *bool, search *string, cardID *int, typeStr *string) ([]*model.Transaction, error)
	CountByUser(userID int, dateFrom, dateTo *time.Time, categoryID *int, kind *string, recurring *bool, search *string, cardID *int, typeStr *string) (int64, error)
	SummaryByCategory(cardID int, from, to time.Time) (map[int]int64, error)
	Update(tx *model.Transaction) error
	Delete(id int) error
	DeleteByUUID(uuid string) error
	ListRecurring(userID int) ([]*model.Transaction, error)
	ListInstallments(originalTransactionID int) ([]*model.Transaction, error)
}
