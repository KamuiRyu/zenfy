package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type GetTransactionUseCase struct {
	transactionService service.TransactionService
}

func NewGetTransactionUseCase(transactionService service.TransactionService) *GetTransactionUseCase {
	return &GetTransactionUseCase{
		transactionService: transactionService,
	}
}

func (uc *GetTransactionUseCase) Execute(userID int, transactionUUID string) (*dto.TransactionResponse, error) {
	return uc.transactionService.GetTransactionByUUID(userID, transactionUUID)
}
