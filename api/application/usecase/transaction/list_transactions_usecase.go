package usecase

import (
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type ListTransactionsUseCase struct {
	transactionRepo repository.TransactionRepository
	userRepo        repository.UserRepository
	categoryRepo    repository.CategoryRepository
	cardRepo        repository.CardRepository
}

func NewListTransactionsUseCase(transactionRepo repository.TransactionRepository, userRepo repository.UserRepository, categoryRepo repository.CategoryRepository, cardRepo repository.CardRepository) *ListTransactionsUseCase {
	return &ListTransactionsUseCase{
		transactionRepo: transactionRepo,
		userRepo:        userRepo,
		categoryRepo:    categoryRepo,
		cardRepo:        cardRepo,
	}
}

func (uc *ListTransactionsUseCase) ExecuteByCard(userID int, cardID int, limit, offset int) ([]dto.TransactionResponse, error) {
	// Note: Card ownership verification should be done in service layer
	transactions, err := uc.transactionRepo.ListByCard(cardID, limit, offset)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionResponse, len(transactions))
	for i, transaction := range transactions {
		responses[i] = *uc.toResponse(transaction)
	}

	return responses, nil
}

func (uc *ListTransactionsUseCase) ExecuteByUser(userID int, limit, offset int) ([]dto.TransactionResponse, error) {
	transactions, err := uc.transactionRepo.ListByUser(userID, limit, offset)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionResponse, len(transactions))
	for i, transaction := range transactions {
		responses[i] = *uc.toResponse(transaction)
	}

	return responses, nil
}

func (uc *ListTransactionsUseCase) toResponse(transaction *model.Transaction) *dto.TransactionResponse {
	response := &dto.TransactionResponse{
		Uuid:                  transaction.Uuid,
		CardUuid:              transaction.Card.Uuid,
		UserUuid:              "", // Will be set below
		CategoryUuid:          transaction.Category.Uuid,
		Amount:                transaction.Amount,
		Currency:              transaction.Currency,
		Kind:                  string(transaction.Kind),
		Merchant:              transaction.Merchant,
		Description:           transaction.Description,
		Metadata:              transaction.Metadata,
		OccurredAt:            transaction.OccurredAt.Format(time.RFC3339),
		CreatedAt:             transaction.CreatedAt.Format(time.RFC3339),
		UpdatedAt:             transaction.UpdatedAt.Format(time.RFC3339),
		IsRecurring:           transaction.IsRecurring,
		RecurrenceType:        (*string)(transaction.RecurrenceType),
		RecurrenceInterval:    transaction.RecurrenceInterval,
		IsInstallment:         transaction.IsInstallment,
		InstallmentNumber:     transaction.InstallmentNumber,
		TotalInstallments:     transaction.TotalInstallments,
		OriginalTransactionID: transaction.OriginalTransactionID,
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

	if transaction.RecurrenceEndDate != nil {
		endDateStr := transaction.RecurrenceEndDate.Format(time.RFC3339)
		response.RecurrenceEndDate = &endDateStr
	}

	return response
}
