package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type GetCategoriesUseCase struct {
	categoryService service.CategoryService
}

func NewGetCategoriesUseCase(categoryService service.CategoryService) *GetCategoriesUseCase {
	return &GetCategoriesUseCase{
		categoryService: categoryService,
	}
}

func (uc *GetCategoriesUseCase) Execute(userID int) ([]dto.CategoryResponse, error) {
	return uc.categoryService.GetCategoriesByUser(userID)
}
