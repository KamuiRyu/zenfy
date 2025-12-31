package repository

import (
	"zenfy-api/application/dto"
	"zenfy-api/domain/model"
)

type CategoryRepository interface {
	Create(category *model.Category) error
	FindByID(id int) (*model.Category, error)
	FindByUUID(uuid string) (*model.Category, error)
	FindByNameAndUserID(name string, userID int) (*model.Category, error)
	ListByUser(userID int) ([]*model.Category, error)
	ListByUserWithFilters(userID int, filters *dto.CategoryFilters) ([]*model.Category, error)
	CountByUser(userID int, filters *dto.CategoryFilters) (int64, error)
	Update(category *model.Category) error
	Delete(id int) error
	DeleteByUUID(uuid string) error
	FindDefaultCategories() ([]*model.Category, error)
}
