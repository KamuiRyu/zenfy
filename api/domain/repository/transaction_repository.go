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
	ListByUser(userID int, limit, offset int, dateFrom, dateTo *time.Time, categoryID *int, kind *string, search *string, cardID *int, typeStr *string) ([]*model.Transaction, error)
	SummaryByCategory(cardID int, from, to time.Time) (map[int]int64, error)
	Update(tx *model.Transaction) error
	Delete(id int) error
	DeleteByUUID(uuid string) error
	ListRecurring(userID int) ([]*model.Transaction, error)
	ListInstallments(originalTransactionID int) ([]*model.Transaction, error)
}
