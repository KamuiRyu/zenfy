package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type ResetPasswordUseCase struct {
	authService service.AuthService
	validator   service.ValidationService
}

func NewResetPasswordUseCase(authService service.AuthService, validator service.ValidationService) *ResetPasswordUseCase {
	return &ResetPasswordUseCase{authService: authService, validator: validator}
}

func (uc *ResetPasswordUseCase) Execute(input dto.ResetPasswordRequestDTO) error {
	if err := uc.validator.Validate(&input); err != nil {
		return err
	}

	return uc.authService.ResetPassword(input.Token, input.NewPassword)
}
