package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type LoginUseCase struct {
	authService service.AuthService
	validator   service.ValidationService
}

func NewLoginUseCase(authService service.AuthService, validator service.ValidationService) *LoginUseCase {
	return &LoginUseCase{authService: authService, validator: validator}
}

func (uc *LoginUseCase) Execute(input dto.LoginRequestDTO) (*dto.LoginResponseDTO, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	return uc.authService.Login(input)
}
