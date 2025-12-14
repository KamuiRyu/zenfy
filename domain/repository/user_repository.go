package repository

import (
	"zenfy-api/domain/model"
)

type UserRepository interface {
	GetByID(id int) (*model.User, error)
	GetByEmail(email string) (*model.User, error)
	Create(u *model.User) error
	SetVerified(id int) error
	UpdatePassword(userID int, newHashedPassword string) error
}
