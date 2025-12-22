package usecase

import (
	"fmt"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type GetCurrentUserUseCase struct {
	tokenService     service.TokenService
	userRepo         repository.UserRepository
	invalidTokenRepo repository.InvalidTokenRepository
}

func NewGetCurrentUserUseCase(tokenService service.TokenService, userRepo repository.UserRepository, invalidTokenRepo repository.InvalidTokenRepository) *GetCurrentUserUseCase {
	return &GetCurrentUserUseCase{
		tokenService:     tokenService,
		userRepo:         userRepo,
		invalidTokenRepo: invalidTokenRepo,
	}
}

func (uc *GetCurrentUserUseCase) Execute(token string) (*dto.UserResponse, error) {
	// Check if token is invalidated
	isInvalid, err := uc.invalidTokenRepo.IsInvalid(token)
	if err != nil {
		return nil, fmt.Errorf("failed to check token validity: %w", err)
	}
	if isInvalid {
		return nil, fmt.Errorf("invalid token")
	}

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
