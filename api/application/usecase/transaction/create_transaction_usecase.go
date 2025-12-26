package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type CreateTransactionUseCase struct {
	transactionService service.TransactionService
	validator          service.ValidationService
}

func NewCreateTransactionUseCase(
	transactionService service.TransactionService,
	validator service.ValidationService,
) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{
		transactionService: transactionService,
		validator:          validator,
	}
}

func (uc *CreateTransactionUseCase) Execute(userID int, input dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	return uc.transactionService.CreateTransaction(userID, input)
}
