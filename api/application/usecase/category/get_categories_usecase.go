package usecase

import (
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/domain/repository"
)

type GetCategoriesUseCase struct {
	categoryRepo repository.CategoryRepository
}

func NewGetCategoriesUseCase(categoryRepo repository.CategoryRepository) *GetCategoriesUseCase {
	return &GetCategoriesUseCase{
		categoryRepo: categoryRepo,
	}
}

func (uc *GetCategoriesUseCase) Execute(userID int) ([]dto.CategoryResponse, error) {
	categories, err := uc.categoryRepo.ListByUser(userID)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.CategoryResponse, len(categories))
	for i, category := range categories {
		responses[i] = dto.CategoryResponse{
			Uuid:        category.Uuid,
			UserID:      category.UserID,
			Name:        category.Name,
			Type:        category.Type,
			Description: category.Description,
			Color:       category.Color,
			Icon:        category.Icon,
			Image:       category.Image,
			IsDefault:   category.IsDefault,
			CreatedAt:   category.CreatedAt.Format(time.RFC3339),
			UpdatedAt:   category.UpdatedAt.Format(time.RFC3339),
		}
	}

	return responses, nil
}
