package usecase

import (
	"fmt"

	"zenfy-api/domain/repository"
)

type DeleteTransactionUseCase struct {
	transactionRepo repository.TransactionRepository
}

func NewDeleteTransactionUseCase(transactionRepo repository.TransactionRepository) *DeleteTransactionUseCase {
	return &DeleteTransactionUseCase{
		transactionRepo: transactionRepo,
	}
}

func (uc *DeleteTransactionUseCase) Execute(userID int, transactionID int) error {
	transaction, err := uc.transactionRepo.FindByID(transactionID)
	if err != nil {
		return err
	}
	if transaction == nil {
		return fmt.Errorf("TRANSACTION_NOT_FOUND")
	}
	if transaction.UserID != userID {
		return fmt.Errorf("TRANSACTION_DOES_NOT_BELONG_TO_USER")
	}

	return uc.transactionRepo.Delete(transactionID)
}
