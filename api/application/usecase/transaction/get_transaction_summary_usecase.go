package usecase

import (
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type GetTransactionSummaryUseCase struct {
	transactionService service.TransactionService
}

func NewGetTransactionSummaryUseCase(transactionService service.TransactionService) *GetTransactionSummaryUseCase {
	return &GetTransactionSummaryUseCase{
		transactionService: transactionService,
	}
}

func (uc *GetTransactionSummaryUseCase) ExecuteByCard(userID int, cardID int, startDate, endDate *time.Time) ([]dto.TransactionSummaryResponse, error) {
	return uc.transactionService.GetTransactionSummaryByCard(userID, cardID, startDate, endDate)
}

func (uc *GetTransactionSummaryUseCase) ExecuteBalanceOverview(userID int, cardID *int) (*dto.BalanceOverviewResponse, error) {
	return uc.transactionService.GetBalanceOverview(userID, cardID)
}
