package usecase

import (
	"fmt"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type GetTransactionUseCase struct {
	transactionRepo repository.TransactionRepository
	userRepo        repository.UserRepository
	categoryRepo    repository.CategoryRepository
	cardRepo        repository.CardRepository
}

func NewGetTransactionUseCase(transactionRepo repository.TransactionRepository, userRepo repository.UserRepository, categoryRepo repository.CategoryRepository, cardRepo repository.CardRepository) *GetTransactionUseCase {
	return &GetTransactionUseCase{
		transactionRepo: transactionRepo,
		userRepo:        userRepo,
		categoryRepo:    categoryRepo,
		cardRepo:        cardRepo,
	}
}

func (uc *GetTransactionUseCase) Execute(userID int, transactionID int) (*dto.TransactionResponse, error) {
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

	return uc.toResponse(transaction), nil
}

func (uc *GetTransactionUseCase) toResponse(transaction *model.Transaction) *dto.TransactionResponse {
	response := &dto.TransactionResponse{
		Uuid:              transaction.Uuid,
		CardUuid:          transaction.Card.Uuid, // Will be set below
		UserUuid:          "",                    // Will be set below
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

	// Get card UUID
	if card, err := uc.cardRepo.FindByID(transaction.CardID); err == nil {
		response.CardUuid = card.Uuid
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
