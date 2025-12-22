package usecase

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type CreateTransactionUseCase struct {
	transactionRepo repository.TransactionRepository
	userRepo        repository.UserRepository
	cardRepo        repository.CardRepository
	categoryRepo    repository.CategoryRepository
	validator       service.ValidationService
}

func NewCreateTransactionUseCase(
	transactionRepo repository.TransactionRepository,
	userRepo repository.UserRepository,
	cardRepo repository.CardRepository,
	categoryRepo repository.CategoryRepository,
	validator service.ValidationService,
) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{
		transactionRepo: transactionRepo,
		userRepo:        userRepo,
		cardRepo:        cardRepo,
		categoryRepo:    categoryRepo,
		validator:       validator,
	}
}

func (uc *CreateTransactionUseCase) Execute(userID int, input dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	var card *model.Card
	var err error
	if input.CardUUID != "" {
		card, err = uc.cardRepo.FindByUUID(input.CardUUID)
	} else {
		return nil, fmt.Errorf("CARD_UUID_REQUIRED")
	}
	if err != nil {
		return nil, fmt.Errorf("FAILED_TO_FIND_CARD")
	}
	if card == nil {
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}
	if card.UserID != userID {
		return nil, fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
	}

	var category *model.Category
	if input.CategoryUUID != "" {
		category, err = uc.categoryRepo.FindByUUID(input.CategoryUUID)
	} else {
		return nil, fmt.Errorf("CATEGORY_UUID_REQUIRED")
	}
	if err != nil {
		return nil, fmt.Errorf("FAILED_TO_FIND_CATEGORY")
	}
	if category == nil {
		return nil, fmt.Errorf("CATEGORY_NOT_FOUND")
	}
	if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
		return nil, fmt.Errorf("CATEGORY_DOES_NOT_BELONG_TO_USER")
	}

	if input.IsRecurring {
		if input.RecurrenceType == nil || *input.RecurrenceType == "" {
			return nil, fmt.Errorf("RECURRENCE_TYPE_REQUIRED_FOR_RECURRING")
		}
		if input.RecurrenceInterval <= 0 {
			input.RecurrenceInterval = 1
		}
	}

	if input.IsInstallment {
		if input.TotalInstallments == nil || *input.TotalInstallments < 2 {
			return nil, fmt.Errorf("TOTAL_INSTALLMENTS_MUST_BE_AT_LEAST_2")
		}
	}

	if input.Currency == "" {
		input.Currency = "BRL"
	}

	occurredAt := time.Now()
	if input.OccurredAt != nil {
		occurredAt = *input.OccurredAt
	}

	transactionUUID := uuid.New().String()

	transaction := model.NewTransaction(
		userID,
		card.ID,
		category.ID,
		transactionUUID,
		input.Amount,
		input.Currency,
		model.TransactionKind(input.Kind),
		input.Merchant,
		input.Description,
		input.Metadata,
		occurredAt,
		input.IsRecurring,
		(*model.RecurrenceType)(input.RecurrenceType),
		input.RecurrenceInterval,
		input.RecurrenceEndDate,
		input.IsInstallment,
		nil,
		input.TotalInstallments,
		nil,
	)

	if err := uc.transactionRepo.Create(transaction); err != nil {
		return nil, fmt.Errorf("FAILED_TO_CREATE_TRANSACTION")
	}

	// Handle installments
	if input.IsInstallment && input.TotalInstallments != nil {
		for i := 1; i < *input.TotalInstallments; i++ {
			installmentUUID := uuid.New().String()
			installmentOccurredAt := occurredAt.AddDate(0, i, 0)

			installment := model.NewTransaction(
				userID,
				card.ID,
				category.ID,
				installmentUUID,
				input.Amount,
				input.Currency,
				model.TransactionKind(input.Kind),
				input.Merchant,
				input.Description,
				input.Metadata,
				installmentOccurredAt,
				false,
				nil,
				0,
				nil,
				true,
				&i,
				input.TotalInstallments,
				&transaction.ID,
			)

			if err := uc.transactionRepo.Create(installment); err != nil {
				return nil, fmt.Errorf("FAILED_TO_CREATE_INSTALLMENT_%d", i+1)
			}
		}
	}

	return uc.toResponse(transaction), nil
}

func (uc *CreateTransactionUseCase) toResponse(transaction *model.Transaction) *dto.TransactionResponse {
	response := &dto.TransactionResponse{
		Uuid:                  transaction.Uuid,
		CardUuid:              "", // Will be set below
		UserUuid:              "", // Will be set below
		CategoryUuid:          "", // Will be set below
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

	// Get card UUID
	if card, err := uc.cardRepo.FindByID(transaction.CardID); err == nil {
		response.CardUuid = card.Uuid
	}

	// Get category UUID
	if category, err := uc.categoryRepo.FindByID(transaction.CategoryID); err == nil {
		response.CategoryUuid = category.Uuid
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
