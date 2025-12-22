package usecase

import (
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
