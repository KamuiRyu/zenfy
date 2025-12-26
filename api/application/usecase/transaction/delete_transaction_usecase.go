package usecase

import (
	"zenfy-api/application/service"
)

type DeleteTransactionUseCase struct {
	transactionService service.TransactionService
}

func NewDeleteTransactionUseCase(transactionService service.TransactionService) *DeleteTransactionUseCase {
	return &DeleteTransactionUseCase{
		transactionService: transactionService,
	}
}

func (uc *DeleteTransactionUseCase) Execute(userID int, transactionID int) error {
	return uc.transactionService.DeleteTransaction(userID, transactionID)
}

func (uc *DeleteTransactionUseCase) ExecuteByUUID(userID int, transactionUUID string) error {
	return uc.transactionService.DeleteTransactionUUID(userID, transactionUUID)
}
