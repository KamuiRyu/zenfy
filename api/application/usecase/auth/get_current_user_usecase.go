package usecase

import (
	"fmt"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type GetCurrentUserUseCase struct {
	tokenService service.TokenService
	userRepo     repository.UserRepository
}

func NewGetCurrentUserUseCase(tokenService service.TokenService, userRepo repository.UserRepository) *GetCurrentUserUseCase {
	return &GetCurrentUserUseCase{tokenService: tokenService, userRepo: userRepo}
}

func (uc *GetCurrentUserUseCase) Execute(token string) (*dto.UserResponse, error) {
	userID, err := uc.tokenService.ParseToken(token)
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}
	u, err := uc.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}
	if u == nil {
		return nil, nil
	}
	return &dto.UserResponse{Uuid: u.Uuid, Name: u.Name, Email: u.Email, CreatedAt: u.CreatedAt}, nil
}
