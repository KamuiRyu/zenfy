package repository

import "zenfy-api/domain/model"

type CardRepository interface {
	Create(card *model.Card) error
	FindByID(id int) (*model.Card, error)
	FindByUserID(userID int) ([]*model.Card, error)
	FindDefaultByUserID(userID int) (*model.Card, error)
	Update(card *model.Card) error
	Delete(id int) error
	SetDefault(userID, cardID int) error
}
