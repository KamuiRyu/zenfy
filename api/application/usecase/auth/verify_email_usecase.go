package usecase

import (
	"zenfy-api/application/service"
)

type VerifyEmailUseCase struct {
	authService service.AuthService
}

func NewVerifyEmailUseCase(authService service.AuthService) *VerifyEmailUseCase {
	return &VerifyEmailUseCase{authService: authService}
}

func (uc *VerifyEmailUseCase) Execute(token string) error {
	return uc.authService.VerifyEmail(token)
}
