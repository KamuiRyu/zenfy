package usecase

import (
	"fmt"

	"zenfy-api/domain/repository"
)

type DeleteCategoryUseCase struct {
	categoryRepo repository.CategoryRepository
}

func NewDeleteCategoryUseCase(categoryRepo repository.CategoryRepository) *DeleteCategoryUseCase {
	return &DeleteCategoryUseCase{
		categoryRepo: categoryRepo,
	}
}

func (uc *DeleteCategoryUseCase) Execute(userID int, categoryUUID string) error {
	// Find the category
	category, err := uc.categoryRepo.FindByUUID(categoryUUID)
	if err != nil {
		return fmt.Errorf("category not found: %w", err)
	}

	// Check ownership
	if category.UserID == nil || *category.UserID != userID {
		return fmt.Errorf("unauthorized: category does not belong to user")
	}

	// Prevent deleting default categories
	if category.IsDefault {
		return fmt.Errorf("cannot delete default categories")
	}

	// Delete the category
	if err := uc.categoryRepo.Delete(category.ID); err != nil {
		return fmt.Errorf("failed to delete category: %w", err)
	}

	return nil
}
