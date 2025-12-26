package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type RefreshTokenUseCase struct {
	authService service.AuthService
}

func NewRefreshTokenUseCase(authService service.AuthService) *RefreshTokenUseCase {
	return &RefreshTokenUseCase{authService: authService}
}

func (uc *RefreshTokenUseCase) Execute(token string) (*dto.TokenData, error) {
	return uc.authService.RefreshToken(token)
}
