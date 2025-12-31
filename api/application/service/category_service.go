package service

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"zenfy-api/application/dto"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type CategoryService interface {
	CreateCategory(userID int, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error)
	GetCategoriesByUser(userID int) ([]dto.CategoryResponse, error)
	GetCategoriesByUserWithFilters(userID int, filters *dto.CategoryFilters) ([]dto.CategoryResponse, error)
	GetCategoryByUUID(userID int, categoryUUID string) (*dto.CategoryResponse, error)
	UpdateCategory(userID int, categoryUUID string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error)
	DeleteCategory(userID int, categoryUUID string) error
}

type categoryService struct {
	categoryRepo repository.CategoryRepository
}

func NewCategoryService(categoryRepo repository.CategoryRepository) CategoryService {
	return &categoryService{
		categoryRepo: categoryRepo,
	}
}

func (s *categoryService) CreateCategory(userID int, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	existing, err := s.categoryRepo.FindByNameAndUserID(req.Name, userID)
	if err != nil {
		return nil, fmt.Errorf("INTERNAL_ERROR")
	}
	if existing != nil {
		return nil, fmt.Errorf("CATEGORY_NAME_ALREADY_EXISTS")
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
		IsDefault:   false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := s.categoryRepo.Create(category); err != nil {
		return nil, fmt.Errorf("INTERNAL_ERROR")
	}

	return s.toResponse(category), nil
}

func (s *categoryService) GetCategoriesByUser(userID int) ([]dto.CategoryResponse, error) {
	categories, err := s.categoryRepo.ListByUser(userID)
	if err != nil {
		return nil, fmt.Errorf("INTERNAL_ERROR")
	}

	responses := make([]dto.CategoryResponse, len(categories))
	for i, category := range categories {
		responses[i] = *s.toResponse(category)
	}

	return responses, nil
}

func (s *categoryService) GetCategoriesByUserWithFilters(userID int, filters *dto.CategoryFilters) ([]dto.CategoryResponse, error) {
	categories, err := s.categoryRepo.ListByUserWithFilters(userID, filters)
	if err != nil {
		return nil, fmt.Errorf("INTERNAL_ERROR")
	}

	responses := make([]dto.CategoryResponse, len(categories))
	for i, category := range categories {
		responses[i] = *s.toResponse(category)
	}

	return responses, nil
}

func (s *categoryService) GetCategoryByUUID(userID int, categoryUUID string) (*dto.CategoryResponse, error) {
	category, err := s.categoryRepo.FindByUUID(categoryUUID)
	if err != nil {
		return nil, fmt.Errorf("INTERNAL_ERROR")
	}
	if category == nil {
		return nil, fmt.Errorf("CATEGORY_NOT_FOUND")
	}
	if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
		return nil, fmt.Errorf("CATEGORY_DOES_NOT_BELONG_TO_USER")
	}

	return s.toResponse(category), nil
}

func (s *categoryService) UpdateCategory(userID int, categoryUUID string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	category, err := s.categoryRepo.FindByUUID(categoryUUID)
	if err != nil {
		return nil, fmt.Errorf("INTERNAL_ERROR")
	}
	if category == nil {
		return nil, fmt.Errorf("CATEGORY_NOT_FOUND")
	}
	if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
		return nil, fmt.Errorf("CATEGORY_DOES_NOT_BELONG_TO_USER")
	}
	if category.IsDefault {
		return nil, fmt.Errorf("CANNOT_UPDATE_DEFAULT_CATEGORY")
	}

	if req.Name != nil {
		existing, err := s.categoryRepo.FindByNameAndUserID(*req.Name, userID)
		if err != nil {
			return nil, fmt.Errorf("INTERNAL_ERROR")
		}
		if existing != nil && existing.Uuid != categoryUUID {
			return nil, fmt.Errorf("CATEGORY_NAME_ALREADY_EXISTS")
		}
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

	if err := s.categoryRepo.Update(category); err != nil {
		return nil, fmt.Errorf("FAILED_UPDATE_CATEGORY")
	}

	return s.toResponse(category), nil
}

func (s *categoryService) DeleteCategory(userID int, categoryUUID string) error {
	category, err := s.categoryRepo.FindByUUID(categoryUUID)
	if err != nil {
		return err
	}
	if category == nil {
		return fmt.Errorf("CATEGORY_NOT_FOUND")
	}
	if (category.UserID != nil && *category.UserID != userID) && !category.IsDefault {
		return fmt.Errorf("CATEGORY_DOES_NOT_BELONG_TO_USER")
	}
	if category.IsDefault {
		return fmt.Errorf("CANNOT_DELETE_DEFAULT_CATEGORY")
	}

	return s.categoryRepo.DeleteByUUID(categoryUUID)
}

func (s *categoryService) validateExpiryDate(month, year int) error {
	now := time.Now()
	currentYear := now.Year()
	currentMonth := int(now.Month())

	if year < currentYear {
		return fmt.Errorf("CARD_HAS_EXPIRED")
	}

	if year == currentYear && month < currentMonth {
		return fmt.Errorf("CARD_HAS_EXPIRED")
	}

	return nil
}

func (s *categoryService) toResponse(category *model.Category) *dto.CategoryResponse {
	return &dto.CategoryResponse{
		ID:          category.ID,
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
	}
}
