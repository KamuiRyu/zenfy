package usecase

import (
	"zenfy-api/application/service"
)

type DeleteCategoryUseCase struct {
	categoryService service.CategoryService
}

func NewDeleteCategoryUseCase(categoryService service.CategoryService) *DeleteCategoryUseCase {
	return &DeleteCategoryUseCase{
		categoryService: categoryService,
	}
}

func (uc *DeleteCategoryUseCase) Execute(userID int, categoryUUID string) error {
	return uc.categoryService.DeleteCategory(userID, categoryUUID)
}
