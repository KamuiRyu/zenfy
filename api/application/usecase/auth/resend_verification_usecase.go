package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type ResendVerificationUseCase struct {
	authService service.AuthService
	validator   service.ValidationService
}

func NewResendVerificationUseCase(authService service.AuthService, validator service.ValidationService) *ResendVerificationUseCase {
	return &ResendVerificationUseCase{authService: authService, validator: validator}
}

func (uc *ResendVerificationUseCase) Execute(input dto.ResendVerificationRequestDTO) error {
	if err := uc.validator.Validate(&input); err != nil {
		return err
	}

	return uc.authService.ResendVerification(input.Email)
}
