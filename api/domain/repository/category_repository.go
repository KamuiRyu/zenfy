package repository

import (
	"zenfy-api/domain/model"
)

type CategoryRepository interface {
	Create(category *model.Category) error
	FindByID(id int) (*model.Category, error)
	FindByUUID(uuid string) (*model.Category, error)
	FindByNameAndUserID(name string, userID int) (*model.Category, error)
	ListByUser(userID int) ([]*model.Category, error)
	Update(category *model.Category) error
	Delete(id int) error
	FindDefaultCategories() ([]*model.Category, error)
}
