package service

import (
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type UserService struct {
	repo repository.UserRepository
}

func NewUserService(r repository.UserRepository) *UserService {
	return &UserService{repo: r}
}

func (s *UserService) GetByID(id int) (*model.User, error) {
	return s.repo.GetByID(id)
}

func (s *UserService) Create(u *model.User) error {
	return s.repo.Create(u)
}
