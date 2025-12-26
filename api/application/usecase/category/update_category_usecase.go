package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type UpdateCategoryUseCase struct {
	categoryService service.CategoryService
	validator       service.ValidationService
}

func NewUpdateCategoryUseCase(categoryService service.CategoryService, validator service.ValidationService) *UpdateCategoryUseCase {
	return &UpdateCategoryUseCase{
		categoryService: categoryService,
		validator:       validator,
	}
}

func (uc *UpdateCategoryUseCase) Execute(userID int, categoryUUID string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	if err := uc.validator.Validate(&req); err != nil {
		return nil, err
	}

	return uc.categoryService.UpdateCategory(userID, categoryUUID, req)
}
