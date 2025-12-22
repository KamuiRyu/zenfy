package usecase

import (
	"fmt"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type UpdateCategoryUseCase struct {
	categoryRepo repository.CategoryRepository
	validator    service.ValidationService
}

func NewUpdateCategoryUseCase(categoryRepo repository.CategoryRepository, validator service.ValidationService) *UpdateCategoryUseCase {
	return &UpdateCategoryUseCase{
		categoryRepo: categoryRepo,
		validator:    validator,
	}
}

func (uc *UpdateCategoryUseCase) Execute(userID int, categoryUUID string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	if err := uc.validator.Validate(&req); err != nil {
		return nil, err
	}

	// Find the category
	category, err := uc.categoryRepo.FindByUUID(categoryUUID)
	if err != nil {
		return nil, fmt.Errorf("category not found: %w", err)
	}

	// Check ownership
	if category.UserID == nil || *category.UserID != userID {
		return nil, fmt.Errorf("unauthorized: category does not belong to user")
	}

	// Prevent updating default categories
	if category.IsDefault {
		return nil, fmt.Errorf("cannot update default categories")
	}

	// Update fields
	if req.Name != nil {
		category.Name = *req.Name
	}
	if req.Type != nil {
		category.Type = *req.Type
	}
	if req.Description != nil {
		category.Description = req.Description
	}
	if req.Color != nil {
		category.Color = req.Color
	}
	if req.Icon != nil {
		category.Icon = req.Icon
	}
	category.UpdatedAt = time.Now()

	// Update in database
	if err := uc.categoryRepo.Update(category); err != nil {
		return nil, fmt.Errorf("failed to update category: %w", err)
	}

	return &dto.CategoryResponse{
		Uuid:        category.Uuid,
		UserID:      category.UserID,
		Name:        category.Name,
		Type:        category.Type,
		Description: category.Description,
		Color:       category.Color,
		Icon:        category.Icon,
		IsDefault:   category.IsDefault,
		CreatedAt:   category.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   category.UpdatedAt.Format(time.RFC3339),
	}, nil
}
