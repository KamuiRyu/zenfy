package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type CreateUserUseCase struct {
	userService service.UserService
	validator   service.ValidationService
}

func NewCreateUserUseCase(
	userService service.UserService,
	validator service.ValidationService,
) *CreateUserUseCase {
	return &CreateUserUseCase{
		userService: userService,
		validator:   validator,
	}
}

func (uc *CreateUserUseCase) Execute(input dto.CreateUserRequestDTO) (*dto.UserResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	return uc.userService.CreateUser(input)
}
