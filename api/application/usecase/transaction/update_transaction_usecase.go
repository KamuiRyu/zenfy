package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type UpdateTransactionUseCase struct {
	transactionService service.TransactionService
	validator          service.ValidationService
}

func NewUpdateTransactionUseCase(
	transactionService service.TransactionService,
	validator service.ValidationService,
) *UpdateTransactionUseCase {
	return &UpdateTransactionUseCase{
		transactionService: transactionService,
		validator:          validator,
	}
}

func (uc *UpdateTransactionUseCase) Execute(userID int, transactionID int, input dto.UpdateTransactionRequest) (*dto.TransactionResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	return uc.transactionService.UpdateTransaction(userID, transactionID, input)
}
