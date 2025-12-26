package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type RequestPasswordResetUseCase struct {
	authService service.AuthService
	validator   service.ValidationService
}

func NewRequestPasswordResetUseCase(authService service.AuthService, validator service.ValidationService) *RequestPasswordResetUseCase {
	return &RequestPasswordResetUseCase{authService: authService, validator: validator}
}

func (uc *RequestPasswordResetUseCase) Execute(input dto.RequestPasswordResetRequestDTO) error {
	if err := uc.validator.Validate(&input); err != nil {
		return err
	}

	return uc.authService.RequestPasswordReset(input.Email)
}
