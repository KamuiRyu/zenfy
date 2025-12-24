package usecase

import (
	"fmt"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type UpdateTransactionUseCase struct {
	transactionRepo repository.TransactionRepository
	userRepo        repository.UserRepository
	categoryRepo    repository.CategoryRepository
	cardRepo        repository.CardRepository
	validator       service.ValidationService
}

func NewUpdateTransactionUseCase(
	transactionRepo repository.TransactionRepository,
	userRepo repository.UserRepository,
	categoryRepo repository.CategoryRepository,
	cardRepo repository.CardRepository,
	validator service.ValidationService,
) *UpdateTransactionUseCase {
	return &UpdateTransactionUseCase{
		transactionRepo: transactionRepo,
		userRepo:        userRepo,
		categoryRepo:    categoryRepo,
		cardRepo:        cardRepo,
		validator:       validator,
	}
}

func (uc *UpdateTransactionUseCase) Execute(userID int, transactionID int, input dto.UpdateTransactionRequest) (*dto.TransactionResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	transaction, err := uc.transactionRepo.FindByID(transactionID)
	if err != nil {
		return nil, err
	}
	if transaction == nil {
		return nil, fmt.Errorf("TRANSACTION_NOT_FOUND")
	}
	if transaction.UserID != userID {
		return nil, fmt.Errorf("TRANSACTION_DOES_NOT_BELONG_TO_USER")
	}

	// Update fields if provided
	if input.CategoryUUID != nil {
		category, err := uc.categoryRepo.FindByUUID(*input.CategoryUUID)
		if err != nil {
			return nil, fmt.Errorf("FAILED_TO_FIND_CATEGORY")
		}
		if category == nil {
			return nil, fmt.Errorf("CATEGORY_NOT_FOUND")
		}
		if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
			return nil, fmt.Errorf("CATEGORY_DOES_NOT_BELONG_TO_USER")
		}
		transaction.CategoryID = category.ID
	}
	if input.Amount != nil {
		transaction.Amount = *input.Amount
	}
	if input.Currency != nil {
		transaction.Currency = *input.Currency
	}
	if input.Kind != nil {
		transaction.Kind = model.TransactionKind(*input.Kind)
	}
	if input.Merchant != nil {
		transaction.Merchant = input.Merchant
	}
	if input.Description != nil {
		transaction.Description = input.Description
	}
	if input.Metadata != nil {
		transaction.Metadata = input.Metadata
	}
	if input.OccurredAt != nil {
		transaction.OccurredAt = *input.OccurredAt
	}
	if input.IsRecurring != nil {
		transaction.IsRecurring = *input.IsRecurring
	}
	if input.RecurrenceType != nil {
		transaction.RecurrenceType = (*model.RecurrenceType)(input.RecurrenceType)
	}

	if input.RecurrenceStartDate != nil {
		transaction.RecurrenceStartDate = input.RecurrenceStartDate
	}
	if input.RecurrenceEndDate != nil {
		transaction.RecurrenceEndDate = input.RecurrenceEndDate
	}

	transaction.UpdatedAt = time.Now()

	if err := uc.transactionRepo.Update(transaction); err != nil {
		return nil, fmt.Errorf("FAILED_TO_UPDATE_TRANSACTION")
	}

	return uc.toResponse(transaction), nil
}

func (uc *UpdateTransactionUseCase) toResponse(transaction *model.Transaction) *dto.TransactionResponse {

	response := &dto.TransactionResponse{
		Uuid:              transaction.Uuid,
		CardUuid:          transaction.Card.Uuid,
		UserUuid:          "", // Will be set below
		CategoryUuid:      transaction.Category.Uuid,
		Amount:            transaction.Amount,
		Currency:          transaction.Currency,
		Kind:              string(transaction.Kind),
		Merchant:          transaction.Merchant,
		Description:       transaction.Description,
		Metadata:          transaction.Metadata,
		OccurredAt:        transaction.OccurredAt.Format(time.RFC3339),
		CreatedAt:         transaction.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         transaction.UpdatedAt.Format(time.RFC3339),
		IsRecurring:       transaction.IsRecurring,
		RecurrenceType:    (*string)(transaction.RecurrenceType),
		IsInstallment:     transaction.IsInstallment,
		InstallmentNumber: transaction.InstallmentNumber,
		TotalInstallments: transaction.TotalInstallments,
	}

	// Get user UUID
	if user, err := uc.userRepo.GetByID(transaction.UserID); err == nil {
		response.UserUuid = user.Uuid
	}

	// Include category info if loaded
	if transaction.Category != nil {
		response.Category = &dto.CategoryResponse{
			Uuid:        transaction.Category.Uuid,
			UserID:      transaction.Category.UserID,
			Name:        transaction.Category.Name,
			Description: transaction.Category.Description,
			Color:       transaction.Category.Color,
			Icon:        transaction.Category.Icon,
			IsDefault:   transaction.Category.IsDefault,
			CreatedAt:   transaction.Category.CreatedAt.Format(time.RFC3339),
			UpdatedAt:   transaction.Category.UpdatedAt.Format(time.RFC3339),
		}
	}

	if transaction.RecurrenceStartDate != nil {
		startDateStr := transaction.RecurrenceStartDate.Format(time.RFC3339)
		response.RecurrenceStartDate = &startDateStr
	}

	if transaction.RecurrenceEndDate != nil {
		endDateStr := transaction.RecurrenceEndDate.Format(time.RFC3339)
		response.RecurrenceEndDate = &endDateStr
	}

	return response
}
