package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type CreateCategoryUseCase struct {
	categoryService service.CategoryService
	validator       service.ValidationService
}

func NewCreateCategoryUseCase(categoryService service.CategoryService, validator service.ValidationService) *CreateCategoryUseCase {
	return &CreateCategoryUseCase{
		categoryService: categoryService,
		validator:       validator,
	}
}

func (uc *CreateCategoryUseCase) Execute(userID int, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	if err := uc.validator.Validate(&req); err != nil {
		return nil, err
	}

	return uc.categoryService.CreateCategory(userID, req)
}
