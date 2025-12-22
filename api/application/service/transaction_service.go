package service

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"zenfy-api/application/dto"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type TransactionService interface {
	CreateTransaction(userID int, req dto.CreateTransactionRequest) (*dto.TransactionResponse, error)
	GetTransactionByID(userID int, transactionID int) (*dto.TransactionResponse, error)
	GetTransactionByUUID(userID int, transactionUUID string) (*dto.TransactionResponse, error)
	UpdateTransaction(userID int, transactionID int, req dto.UpdateTransactionRequest) (*dto.TransactionResponse, error)
	DeleteTransaction(userID int, transactionID int) error
	ListTransactionsByCard(userID int, cardID int, limit, offset int) ([]dto.TransactionResponse, error)
	ListTransactionsByUser(userID int, limit, offset int) ([]dto.TransactionResponse, error)
	GetTransactionSummaryByCard(userID int, cardID int, startDate, endDate *time.Time) ([]dto.TransactionSummaryResponse, error)
	GetBalanceOverview(userID int, cardID *int) (*dto.BalanceOverviewResponse, error)
}

type transactionService struct {
	transactionRepo repository.TransactionRepository
	userRepo        repository.UserRepository
	cardRepo        repository.CardRepository
	categoryRepo    repository.CategoryRepository
}

func NewTransactionService(transactionRepo repository.TransactionRepository, userRepo repository.UserRepository, cardRepo repository.CardRepository, categoryRepo repository.CategoryRepository) TransactionService {
	return &transactionService{
		transactionRepo: transactionRepo,
		userRepo:        userRepo,
		cardRepo:        cardRepo,
		categoryRepo:    categoryRepo,
	}
}

func (s *transactionService) CreateTransaction(userID int, req dto.CreateTransactionRequest) (*dto.TransactionResponse, error) {
	// Find card by UUID
	var card *model.Card
	var err error
	if req.CardUUID != "" {
		card, err = s.cardRepo.FindByUUID(req.CardUUID)
	} else {
		return nil, fmt.Errorf("card_uuid is required")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find card: %w", err)
	}
	if card == nil {
		return nil, fmt.Errorf("card not found")
	}
	if card.UserID != userID {
		return nil, fmt.Errorf("card does not belong to user")
	}

	// Find category by UUID
	var category *model.Category
	if req.CategoryUUID != "" {
		category, err = s.categoryRepo.FindByUUID(req.CategoryUUID)
	} else {
		return nil, fmt.Errorf("category_uuid is required")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find category: %w", err)
	}
	if category == nil {
		return nil, fmt.Errorf("category not found")
	}
	// Allow both user categories and default categories
	if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
		return nil, fmt.Errorf("category does not belong to user")
	}

	// Validate recurring fields
	if req.IsRecurring {
		if req.RecurrenceType == nil || *req.RecurrenceType == "" {
			return nil, fmt.Errorf("recurrence_type is required for recurring transactions")
		}
		if req.RecurrenceInterval <= 0 {
			req.RecurrenceInterval = 1
		}
	}

	// Validate installment fields
	if req.IsInstallment {
		if req.TotalInstallments == nil || *req.TotalInstallments < 2 {
			return nil, fmt.Errorf("total_installments must be at least 2 for installment transactions")
		}
	}

	// Set default currency if not provided
	if req.Currency == "" {
		req.Currency = "BRL"
	}

	// Set occurred_at to now if not provided
	occurredAt := time.Now()
	if req.OccurredAt != nil {
		occurredAt = *req.OccurredAt
	}

	// Generate UUID
	transactionUUID := uuid.New().String()

	transaction := model.NewTransaction(
		userID,
		card.ID,
		category.ID,
		transactionUUID,
		req.Amount,
		req.Currency,
		model.TransactionKind(req.Kind),
		req.Merchant,
		req.Description,
		req.Metadata,
		occurredAt,
		req.IsRecurring,
		(*model.RecurrenceType)(req.RecurrenceType),
		req.RecurrenceInterval,
		req.RecurrenceEndDate,
		req.IsInstallment,
		nil, // installment_number
		req.TotalInstallments,
		nil, // original_transaction_id
	)

	if err := s.transactionRepo.Create(transaction); err != nil {
		return nil, fmt.Errorf("failed to create transaction: %w", err)
	}

	// Handle installments
	if req.IsInstallment && req.TotalInstallments != nil {
		for i := 1; i < *req.TotalInstallments; i++ {
			installmentUUID := uuid.New().String()
			installmentOccurredAt := occurredAt.AddDate(0, i, 0) // Monthly installments

			installment := model.NewTransaction(
				userID,
				card.ID,
				category.ID,
				installmentUUID,
				req.Amount,
				req.Currency,
				model.TransactionKind(req.Kind),
				req.Merchant,
				req.Description,
				req.Metadata,
				installmentOccurredAt,
				false, // not recurring
				nil,
				0,
				nil,
				true, // is installment
				&i,   // installment_number
				req.TotalInstallments,
				&transaction.ID,
			)

			if err := s.transactionRepo.Create(installment); err != nil {
				return nil, fmt.Errorf("failed to create installment %d: %w", i+1, err)
			}
		}
	}

	return s.toResponse(transaction), nil
}

func (s *transactionService) GetTransactionByID(userID int, transactionID int) (*dto.TransactionResponse, error) {
	transaction, err := s.transactionRepo.FindByID(transactionID)
	if err != nil {
		return nil, err
	}
	if transaction == nil {
		return nil, fmt.Errorf("transaction not found")
	}
	if transaction.UserID != userID {
		return nil, fmt.Errorf("transaction does not belong to user")
	}

	return s.toResponse(transaction), nil
}

func (s *transactionService) GetTransactionByUUID(userID int, transactionUUID string) (*dto.TransactionResponse, error) {
	transaction, err := s.transactionRepo.FindByUUID(transactionUUID)
	if err != nil {
		return nil, err
	}
	if transaction == nil {
		return nil, fmt.Errorf("transaction not found")
	}
	if transaction.UserID != userID {
		return nil, fmt.Errorf("transaction does not belong to user")
	}

	return s.toResponse(transaction), nil
}

func (s *transactionService) UpdateTransaction(userID int, transactionID int, req dto.UpdateTransactionRequest) (*dto.TransactionResponse, error) {
	transaction, err := s.transactionRepo.FindByID(transactionID)
	if err != nil {
		return nil, err
	}
	if transaction == nil {
		return nil, fmt.Errorf("transaction not found")
	}
	if transaction.UserID != userID {
		return nil, fmt.Errorf("transaction does not belong to user")
	}

	// Update fields if provided
	if req.CategoryUUID != nil {
		category, err := s.categoryRepo.FindByUUID(*req.CategoryUUID)
		if err != nil {
			return nil, fmt.Errorf("failed to find category: %w", err)
		}
		if category == nil {
			return nil, fmt.Errorf("category not found")
		}
		if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
			return nil, fmt.Errorf("category does not belong to user")
		}
		transaction.CategoryID = category.ID
	}
	if req.Amount != nil {
		transaction.Amount = *req.Amount
	}
	if req.Currency != nil {
		transaction.Currency = *req.Currency
	}
	if req.Kind != nil {
		transaction.Kind = model.TransactionKind(*req.Kind)
	}
	if req.Merchant != nil {
		transaction.Merchant = req.Merchant
	}
	if req.Description != nil {
		transaction.Description = req.Description
	}
	if req.Metadata != nil {
		transaction.Metadata = req.Metadata
	}
	if req.OccurredAt != nil {
		transaction.OccurredAt = *req.OccurredAt
	}
	if req.IsRecurring != nil {
		transaction.IsRecurring = *req.IsRecurring
	}
	if req.RecurrenceType != nil {
		transaction.RecurrenceType = (*model.RecurrenceType)(req.RecurrenceType)
	}
	if req.RecurrenceInterval != nil {
		transaction.RecurrenceInterval = *req.RecurrenceInterval
	}
	if req.RecurrenceEndDate != nil {
		transaction.RecurrenceEndDate = req.RecurrenceEndDate
	}

	transaction.UpdatedAt = time.Now()

	if err := s.transactionRepo.Update(transaction); err != nil {
		return nil, fmt.Errorf("failed to update transaction: %w", err)
	}

	return s.toResponse(transaction), nil
}

func (s *transactionService) DeleteTransaction(userID int, transactionID int) error {
	transaction, err := s.transactionRepo.FindByID(transactionID)
	if err != nil {
		return err
	}
	if transaction == nil {
		return fmt.Errorf("transaction not found")
	}
	if transaction.UserID != userID {
		return fmt.Errorf("transaction does not belong to user")
	}

	return s.transactionRepo.Delete(transactionID)
}

func (s *transactionService) ListTransactionsByCard(userID int, cardID int, limit, offset int) ([]dto.TransactionResponse, error) {
	// Verify card belongs to user
	card, err := s.cardRepo.FindByID(cardID)
	if err != nil {
		return nil, err
	}
	if card == nil {
		return nil, fmt.Errorf("card not found")
	}
	if card.UserID != userID {
		return nil, fmt.Errorf("card does not belong to user")
	}

	transactions, err := s.transactionRepo.ListByCard(cardID, limit, offset)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionResponse, len(transactions))
	for i, transaction := range transactions {
		responses[i] = *s.toResponse(transaction)
	}

	return responses, nil
}

func (s *transactionService) ListTransactionsByUser(userID int, limit, offset int) ([]dto.TransactionResponse, error) {
	transactions, err := s.transactionRepo.ListByUser(userID, limit, offset, nil, nil, nil, nil, nil, nil, nil)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionResponse, len(transactions))
	for i, transaction := range transactions {
		responses[i] = *s.toResponse(transaction)
	}

	return responses, nil
}

func (s *transactionService) GetTransactionSummaryByCard(userID int, cardID int, startDate, endDate *time.Time) ([]dto.TransactionSummaryResponse, error) {
	card, err := s.cardRepo.FindByID(cardID)
	if err != nil {
		return nil, err
	}
	if card == nil {
		return nil, fmt.Errorf("card not found")
	}
	if card.UserID != userID {
		return nil, fmt.Errorf("card does not belong to user")
	}

	from := time.Now().AddDate(0, -1, 0)
	to := time.Now()
	if startDate != nil {
		from = *startDate
	}
	if endDate != nil {
		to = *endDate
	}

	summaries, err := s.transactionRepo.SummaryByCategory(cardID, from, to)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionSummaryResponse, 0, len(summaries))

	return responses, nil
}

func (s *transactionService) GetBalanceOverview(userID int, cardID *int) (*dto.BalanceOverviewResponse, error) {
	if cardID != nil {
		card, err := s.cardRepo.FindByID(*cardID)

		if err != nil {
			return nil, err
		}
		if card == nil {
			return nil, fmt.Errorf("card not found")
		}
		if card.UserID != userID {
			return nil, fmt.Errorf("card does not belong to user")
		}
	}

	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Second)

	transactions, err := s.transactionRepo.ListByUser(userID, 0, 0, &startOfMonth, &endOfMonth, nil, nil, nil, cardID, nil)
	if err != nil {
		return nil, err
	}

	var totalIncome, totalExpense int64
	for _, transaction := range transactions {
		switch transaction.Category.Type {
		case "income":
			totalIncome += transaction.Amount
		case "expense":
			totalExpense += transaction.Amount
		case "investment", "transfer":
			totalExpense += transaction.Amount
		}
	}

	balance := totalIncome - totalExpense

	return &dto.BalanceOverviewResponse{
		TotalIncome:  totalIncome,
		TotalExpense: totalExpense,
		Balance:      balance,
	}, nil
}

func (s *transactionService) toResponse(transaction *model.Transaction) *dto.TransactionResponse {
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
	if user, err := s.userRepo.GetByID(transaction.UserID); err == nil {
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
