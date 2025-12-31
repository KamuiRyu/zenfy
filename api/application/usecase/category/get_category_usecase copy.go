package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type GetCategoriyUseCase struct {
	categoryService service.CategoryService
}

func NewGetCategoriyUseCase(categoryService service.CategoryService) *GetCategoriyUseCase {
	return &GetCategoriyUseCase{
		categoryService: categoryService,
	}
}

func (uc *GetCategoriyUseCase) Execute(userID int, categoryUUID string) (dto.CategoryResponse, error) {
	cat, err := uc.categoryService.GetCategoryByUUID(userID, categoryUUID)
	return *cat, err
}
