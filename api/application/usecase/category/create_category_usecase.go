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

type CreateCategoryUseCase struct {
	categoryRepo repository.CategoryRepository
	validator    service.ValidationService
}

func NewCreateCategoryUseCase(categoryRepo repository.CategoryRepository, validator service.ValidationService) *CreateCategoryUseCase {
	return &CreateCategoryUseCase{
		categoryRepo: categoryRepo,
		validator:    validator,
	}
}

func (uc *CreateCategoryUseCase) Execute(userID int, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	if err := uc.validator.Validate(&req); err != nil {
		return nil, err
	}

	// Check if category with same name already exists for this user
	existing, err := uc.categoryRepo.FindByNameAndUserID(req.Name, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing category: %w", err)
	}
	if existing != nil {
		return nil, fmt.Errorf("CATEGORY_ALREADY_EXISTS")
	}

	categoryUUID := uuid.New().String()

	category := &model.Category{
		Uuid:        categoryUUID,
		UserID:      &userID,
		Name:        req.Name,
		Type:        req.Type,
		Description: req.Description,
		Color:       req.Color,
		Icon:        req.Icon,
		Image:       req.Image,
		IsDefault:   false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := uc.categoryRepo.Create(category); err != nil {
		return nil, fmt.Errorf("failed to create category: %w", err)
	}

	return &dto.CategoryResponse{
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
	}, nil
}
