package usecase

import (
	"zenfy-api/application/service"
)

type LogoutUseCase struct {
	authService service.AuthService
}

func NewLogoutUseCase(authService service.AuthService) *LogoutUseCase {
	return &LogoutUseCase{authService: authService}
}

func (uc *LogoutUseCase) Execute(token string) error {
	return uc.authService.Logout(token)
}
