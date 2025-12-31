package usecase

import (
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type ListTransactionsUseCase struct {
	transactionService service.TransactionService
}

type TransactionFilters struct {
	DateFrom   *time.Time
	DateTo     *time.Time
	CategoryID *string
	Kind       *string
	Recurring  *bool
	Search     *string
	CardID     *int
	Type       *string
}

func NewListTransactionsUseCase(transactionService service.TransactionService) *ListTransactionsUseCase {
	return &ListTransactionsUseCase{
		transactionService: transactionService,
	}
}

func (uc *ListTransactionsUseCase) ExecuteByCard(userID int, cardID int, limit, offset int) ([]dto.TransactionResponse, error) {
	return uc.transactionService.ListTransactionsByCard(userID, cardID, limit, offset)
}

func (uc *ListTransactionsUseCase) ExecuteByUser(userID int, limit, offset int, filters *TransactionFilters) ([]dto.TransactionResponse, error) {
	var dateFrom, dateTo *time.Time
	var kind *string
	var search *string
	var cardID *int
	var typeStr *string
	var recurring *bool
	var categoryUuid *string
	if filters != nil {
		dateFrom = filters.DateFrom
		dateTo = filters.DateTo
		categoryUuid = filters.CategoryID
		kind = filters.Kind
		recurring = filters.Recurring
		search = filters.Search
		cardID = filters.CardID
		typeStr = filters.Type
	}
	return uc.transactionService.ListTransactionsByUserWithFilters(userID, limit, offset, dateFrom, dateTo, categoryUuid, kind, recurring, search, cardID, typeStr)
}

func (uc *ListTransactionsUseCase) ExecuteByUserAndCard(userID int, cardUUID string, limit, offset int) ([]dto.TransactionResponse, error) {
	return uc.transactionService.ListTransactionsByCardUUID(userID, cardUUID, limit, offset)
}
