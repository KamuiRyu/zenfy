package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type GetCurrentUserUseCase struct {
	authService service.AuthService
}

func NewGetCurrentUserUseCase(authService service.AuthService) *GetCurrentUserUseCase {
	return &GetCurrentUserUseCase{authService: authService}
}

func (uc *GetCurrentUserUseCase) Execute(token string) (*dto.UserResponse, error) {
	return uc.authService.GetCurrentUser(token)
}
