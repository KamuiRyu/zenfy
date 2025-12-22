package usecase

import (
	"fmt"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/domain/repository"
)

type GetTransactionSummaryUseCase struct {
	transactionRepo repository.TransactionRepository
	categoryRepo    repository.CategoryRepository
}

func NewGetTransactionSummaryUseCase(transactionRepo repository.TransactionRepository, categoryRepo repository.CategoryRepository) *GetTransactionSummaryUseCase {
	return &GetTransactionSummaryUseCase{
		transactionRepo: transactionRepo,
		categoryRepo:    categoryRepo,
	}
}

func (uc *GetTransactionSummaryUseCase) ExecuteByCard(userID int, cardID int, startDate, endDate *time.Time) ([]dto.TransactionSummaryResponse, error) {
	// Note: Card ownership verification should be done in service layer
	from := time.Now().AddDate(0, -1, 0) // Default to last month
	to := time.Now()
	if startDate != nil {
		from = *startDate
	}
	if endDate != nil {
		to = *endDate
	}

	summaries, err := uc.transactionRepo.SummaryByCategory(cardID, from, to)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TransactionSummaryResponse, 0, len(summaries))
	for categoryID, total := range summaries {
		// Get category UUID
		categoryUuid := ""
		if category, err := uc.categoryRepo.FindByID(categoryID); err == nil {
			categoryUuid = category.Uuid
		}
		responses = append(responses, dto.TransactionSummaryResponse{
			CategoryUuid: categoryUuid,
			Total:        total,
		})
	}

	return responses, nil
}

func (uc *GetTransactionSummaryUseCase) ExecuteBalanceOverview(userID int, cardID *int) (*dto.BalanceOverviewResponse, error) {
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, -1).Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	transactions, err := uc.transactionRepo.ListByUser(userID, 10000, 0, &startOfMonth, &endOfMonth, nil, nil, nil, cardID, nil)
	if err != nil {
		return nil, err
	}

	var totalIncome int64
	var totalExpense int64
	var lastPaymentAmount *int64
	var lastPaymentDate *time.Time

	for _, tx := range transactions {
		fmt.Println(tx.Category.Type)
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

	return &dto.BalanceOverviewResponse{
		Balance:           balance,
		TotalIncome:       totalIncome,
		TotalExpense:      totalExpense,
		LastPaymentAmount: lastPaymentAmount,
		LastPaymentDate:   lastPaymentDateStr,
	}, nil
}
