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
	UpdateTransaction(userID int, transactionUUID string, req dto.UpdateTransactionRequest) (*dto.TransactionResponse, error)
	DeleteTransaction(userID int, transactionID int) error
	DeleteTransactionUUID(userID int, transactionUUID string) error
	ListTransactionsByCard(userID int, cardID int, limit, offset int) ([]dto.TransactionResponse, error)
	ListTransactionsByUser(userID int, limit, offset int) ([]dto.TransactionResponse, error)
	ListTransactionsByUserWithFilters(userID int, limit, offset int, dateFrom, dateTo *time.Time, categoryID *string, kind *string, recurring *bool, search *string, cardID *int, typeStr *string) ([]dto.TransactionResponse, error)
	ListTransactionsByCardUUID(userID int, cardUUID string, limit, offset int) ([]dto.TransactionResponse, error)
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

	// Find category by UUID
	var category *model.Category
	if req.CategoryUUID != "" {
		category, err = s.categoryRepo.FindByUUID(req.CategoryUUID)
	} else {
		return nil, fmt.Errorf("CATEGORY_UUID_REQUIRED")
	}
	if err != nil {
		return nil, fmt.Errorf("FAILED_TO_FIND_CATEGORY")
	}
	if category == nil {
		return nil, fmt.Errorf("CATEGORY_NOT_FOUND")
	}
	// Allow both user categories and default categories
	if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
		return nil, fmt.Errorf("CATEGORY_DOES_NOT_BELONG_TO_USER")
	}

	// Validate recurring fields
	if req.IsRecurring {
		if req.RecurrenceType == nil || *req.RecurrenceType == "" {
			return nil, fmt.Errorf("RECURRENCE_TYPE_REQUIRED_FOR_RECURRING_TRANSACTIONS")
		}
	}

	// Validate installment fields
	if req.IsInstallment {
		if req.TotalInstallments == nil || *req.TotalInstallments < 2 {
			return nil, fmt.Errorf("TOTAL_INSTALLMENTS_MUST_BE_AT_LEAST_2_FOR_INSTALLMENT_TRANSACTIONS")
		}
	}

	if req.Currency == "" {
		req.Currency = "BRL"
	}

	occurredAt := time.Now()
	if req.OccurredAt != nil {
		occurredAt = *req.OccurredAt
	}

	if req.IsInstallment && req.TotalInstallments != nil {
		var firstInstallment *model.Transaction
		installmentAmount := req.Amount / int64(*req.TotalInstallments)
		remainder := req.Amount % int64(*req.TotalInstallments)

		for i := 1; i < *req.TotalInstallments; i++ {
			installmentUUID := uuid.New().String()
			installmentOccurredAt := occurredAt.AddDate(0, i, 0)

			amount := installmentAmount
			if i == *req.TotalInstallments-1 {
				amount += remainder
			}

			installment := model.NewTransaction(
				userID,
				card.ID,
				category.ID,
				installmentUUID,
				amount,
				req.Currency,
				model.TransactionKind(req.Kind),
				req.Merchant,
				req.Description,
				req.Metadata,
				installmentOccurredAt,
				false,
				nil,
				nil,
				nil,
				true,
				&i,
				req.TotalInstallments,
			)

			if err := s.transactionRepo.Create(installment); err != nil {
				return nil, fmt.Errorf("failed to create installment %d: %w", i+1, err)
			}

			if i == 0 {
				firstInstallment = installment
			}
		}
		return s.toResponse(firstInstallment), nil
	} else {
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
			req.RecurrenceStartDate,
			req.RecurrenceEndDate,
			req.IsInstallment,
			nil,
			nil,
		)

		if err := s.transactionRepo.Create(transaction); err != nil {
			return nil, fmt.Errorf("FAILED_TO_CREATE_TRANSACTION")
		}

		return s.toResponse(transaction), nil
	}
}

func (s *transactionService) GetTransactionByID(userID int, transactionID int) (*dto.TransactionResponse, error) {
	transaction, err := s.transactionRepo.FindByID(transactionID)
	if err != nil {
		return nil, err
	}
	if transaction == nil {
		return nil, fmt.Errorf("TRANSACTION_NOT_FOUND")
	}
	if transaction.UserID != userID {
		return nil, fmt.Errorf("TRANSACTION_DOES_NOT_BELONG_TO_USER")
	}

	return s.toResponse(transaction), nil
}

func (s *transactionService) GetTransactionByUUID(userID int, transactionUUID string) (*dto.TransactionResponse, error) {
	transaction, err := s.transactionRepo.FindByUUID(transactionUUID)
	if err != nil {
		return nil, err
	}
	if transaction == nil {
		return nil, fmt.Errorf("TRANSACTION_NOT_FOUND")
	}
	if transaction.UserID != userID {
		return nil, fmt.Errorf("TRANSACTION_DOES_NOT_BELONG_TO_USER")
	}

	return s.toResponse(transaction), nil
}

func (s *transactionService) UpdateTransaction(userID int, transactionUUID string, req dto.UpdateTransactionRequest) (*dto.TransactionResponse, error) {
	transaction, err := s.transactionRepo.FindByUUID(transactionUUID)
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
	if req.CategoryUUID != nil {
		category, err := s.categoryRepo.FindByUUID(*req.CategoryUUID)
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
	if req.RecurrenceStartDate != nil {
		transaction.RecurrenceStartDate = req.RecurrenceStartDate
	}
	if req.RecurrenceEndDate != nil {
		transaction.RecurrenceEndDate = req.RecurrenceEndDate
	}

	transaction.UpdatedAt = time.Now()

	if err := s.transactionRepo.Update(transaction); err != nil {
		fmt.Println("Error: ", err)
		return nil, fmt.Errorf("FAILED_TO_UPDATE_TRANSACTION")
	}

	return s.toResponse(transaction), nil
}

func (s *transactionService) DeleteTransaction(userID int, transactionID int) error {
	transaction, err := s.transactionRepo.FindByID(transactionID)
	if err != nil {
		return err
	}
	if transaction == nil {
		return fmt.Errorf("TRANSACTION_NOT_FOUND")
	}
	if transaction.UserID != userID {
		return fmt.Errorf("TRANSACTION_DOES_NOT_BELONG_TO_USER")
	}

	return s.transactionRepo.Delete(transactionID)
}

func (s *transactionService) DeleteTransactionUUID(userID int, transactionUUID string) error {
	transaction, err := s.transactionRepo.FindByUUID(transactionUUID)
	if err != nil {
		return err
	}
	if transaction == nil {
		return fmt.Errorf("TRANSACTION_NOT_FOUND")
	}
	if transaction.UserID != userID {
		return fmt.Errorf("TRANSACTION_DOES_NOT_BELONG_TO_USER")
	}

	return s.transactionRepo.DeleteByUUID(transactionUUID)
}

func (s *transactionService) ListTransactionsByCard(userID int, cardID int, limit, offset int) ([]dto.TransactionResponse, error) {
	// Verify card belongs to user
	card, err := s.cardRepo.FindByID(cardID)
	if err != nil {
		return nil, err
	}
	if card == nil {
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}
	if card.UserID != userID {
		return nil, fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
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

func (s *transactionService) ListTransactionsByCardUUID(userID int, cardUUID string, limit, offset int) ([]dto.TransactionResponse, error) {
	// Find card by UUID and verify ownership
	card, err := s.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		return nil, err
	}
	if card == nil {
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}
	if card.UserID != userID {
		return nil, fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
	}

	return s.ListTransactionsByCard(userID, card.ID, limit, offset)
}

func (s *transactionService) ListTransactionsByUser(userID int, limit, offset int) ([]dto.TransactionResponse, error) {
	transactions, err := s.transactionRepo.ListByUser(userID, limit, offset, nil, nil, nil, nil, nil, nil, nil, nil)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionResponse, len(transactions))
	for i, transaction := range transactions {
		responses[i] = *s.toResponse(transaction)
	}

	return responses, nil
}

func (s *transactionService) ListTransactionsByUserWithFilters(userID int, limit, offset int, dateFrom, dateTo *time.Time, categoryID *string, kind *string, recurring *bool, search *string, cardID *int, typeStr *string) ([]dto.TransactionResponse, error) {
	var categoryIDInt *int
	if categoryID != nil && *categoryID != "" {
		category, err := s.categoryRepo.FindByUUID(*categoryID)
		if err != nil {
			return nil, fmt.Errorf("invalid category UUID: %w", err)
		}
		if category.UserID != nil && *category.UserID != userID {
			return nil, fmt.Errorf("category not found or access denied")
		}
		categoryIDInt = &category.ID
	}

	transactions, err := s.transactionRepo.ListByUser(userID, limit, offset, dateFrom, dateTo, categoryIDInt, kind, recurring, search, cardID, typeStr)
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
		return nil, fmt.Errorf("CARD_NOT_FOUND")
	}
	if card.UserID != userID {
		return nil, fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
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
			return nil, fmt.Errorf("CARD_NOT_FOUND")
		}
		if card.UserID != userID {
			return nil, fmt.Errorf("CARD_DOES_NOT_BELONG_TO_USER")
		}
	}

	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	transactions, err := s.transactionRepo.ListByUser(userID, 10000, 0, &startOfMonth, &endOfMonth, nil, nil, nil, nil, cardID, nil)
	if err != nil {
		return nil, err
	}

	var totalIncome int64
	var totalExpense int64
	var lastPaymentAmount *int64
	var lastPaymentDate *time.Time

	for _, tx := range transactions {
		if tx.Category != nil {
			switch tx.Category.Type {
			case "income":
				totalIncome += tx.Amount
			case "expense":
				totalExpense += tx.Amount
				if lastPaymentDate == nil || tx.OccurredAt.After(*lastPaymentDate) {
					lastPaymentAmount = &tx.Amount
					lastPaymentDate = &tx.OccurredAt
				}
			case "investment", "transfer":
				totalExpense += tx.Amount
			}
		} else {
			switch tx.Kind {
			case "income":
				totalIncome += tx.Amount
			case "expense":
				totalExpense += tx.Amount
				if lastPaymentDate == nil || tx.OccurredAt.After(*lastPaymentDate) {
					lastPaymentAmount = &tx.Amount
					lastPaymentDate = &tx.OccurredAt
				}
			}
		}
	}

	balance := totalIncome - totalExpense

	var lastPaymentDateStr *string
	if lastPaymentDate != nil {
		dateStr := lastPaymentDate.Format(time.RFC3339)
		lastPaymentDateStr = &dateStr
	}

	monthlyStats := make([]dto.MonthlyStats, 0, 12)
	for i := 11; i >= 0; i-- {
		monthStart := time.Date(now.Year(), now.Month()-time.Month(i), 1, 0, 0, 0, 0, now.Location())
		monthEnd := monthStart.AddDate(0, 1, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)

		monthTransactions, err := s.transactionRepo.ListByUser(userID, 10000, 0, &monthStart, &monthEnd, nil, nil, nil, nil, cardID, nil)
		if err != nil {
			continue
		}

		var monthIncome int64
		var monthExpense int64

		for _, tx := range monthTransactions {
			if tx.Category != nil {
				switch tx.Category.Type {
				case "income":
					monthIncome += tx.Amount
				case "expense":
					monthExpense += tx.Amount
				case "investment", "transfer":
					monthExpense += tx.Amount
				}
			} else {
				switch tx.Kind {
				case "income":
					monthIncome += tx.Amount
				case "expense":
					monthExpense += tx.Amount
				}
			}
		}

		monthlyStats = append(monthlyStats, dto.MonthlyStats{
			Month:        monthStart.Format("January"),
			Year:         monthStart.Year(),
			TotalIncome:  monthIncome,
			TotalExpense: monthExpense,
		})
	}

	return &dto.BalanceOverviewResponse{
		Balance:           balance,
		TotalIncome:       totalIncome,
		TotalExpense:      totalExpense,
		LastPaymentAmount: lastPaymentAmount,
		LastPaymentDate:   lastPaymentDateStr,
		MonthlyStats:      monthlyStats,
	}, nil
}

func (s *transactionService) toResponse(transaction *model.Transaction) *dto.TransactionResponse {
	response := &dto.TransactionResponse{
		Uuid:              transaction.Uuid,
		CardUuid:          "", // Will be set below
		UserUuid:          "", // Will be set below
		CategoryUuid:      "", // Will be set below
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
	if user, err := s.userRepo.GetByID(transaction.UserID); err == nil {
		response.UserUuid = user.Uuid
	}

	// Get card UUID
	if card, err := s.cardRepo.FindByID(transaction.CardID); err == nil {
		response.CardUuid = card.Uuid
	}

	// Get category UUID
	if category, err := s.categoryRepo.FindByID(transaction.CategoryID); err == nil {
		response.CategoryUuid = category.Uuid
	}

	// Include category info if loaded
	if transaction.Category != nil {
		response.Category = &dto.CategoryResponse{
			Uuid:        transaction.Category.Uuid,
			Name:        transaction.Category.Name,
			Type:        transaction.Category.Type,
			Description: transaction.Category.Description,
			Color:       transaction.Category.Color,
			Icon:        transaction.Category.Icon,
			IsDefault:   transaction.Category.IsDefault,
			CreatedAt:   transaction.Category.CreatedAt.Format(time.RFC3339),
			UpdatedAt:   transaction.Category.UpdatedAt.Format(time.RFC3339),
		}
	}

	// Include card info if loaded
	if transaction.Card != nil {
		response.Card = &dto.CardResponse{
			Uuid:        transaction.Card.Uuid,
			LastFour:    transaction.Card.LastFour,
			Brand:       transaction.Card.Brand,
			CardType:    string(transaction.Card.CardType),
			HolderName:  transaction.Card.HolderName,
			Nickname:    transaction.Card.Nickname,
			ExpiryMonth: transaction.Card.ExpiryMonth,
			ExpiryYear:  transaction.Card.ExpiryYear,
			BillingDay:  transaction.Card.BillingDay,
			IsDefault:   transaction.Card.IsDefault,
			CreatedAt:   transaction.Card.CreatedAt.Format(time.RFC3339),
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
