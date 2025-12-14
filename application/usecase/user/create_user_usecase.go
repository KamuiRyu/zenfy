package usecase

import (
	"errors"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type CreateUserUseCase struct {
	userRepo         repository.UserRepository
	verificationRepo repository.VerificationTokenRepository
	emailService     service.EmailService
	tokenService     service.TokenService
	validator        service.ValidationService
}

func NewCreateUserUseCase(
	userRepo repository.UserRepository,
	verificationRepo repository.VerificationTokenRepository,
	emailService service.EmailService,
	tokenService service.TokenService,
	validator service.ValidationService,
) *CreateUserUseCase {
	return &CreateUserUseCase{
		userRepo:         userRepo,
		verificationRepo: verificationRepo,
		emailService:     emailService,
		tokenService:     tokenService,
		validator:        validator,
	}
}

func (uc *CreateUserUseCase) Execute(input dto.CreateUserRequestDTO) (*dto.UserResponse, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	existing, err := uc.userRepo.GetByEmail(input.Email)
	if err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}
	if existing != nil {
		return nil, errors.New("USER_ALREADY_EXISTS")
	}

	user := model.NewUser(input.Name, input.Email, input.Password)

	if err := user.HashPassword(); err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}

	if err := uc.userRepo.Create(user); err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}

	if uc.tokenService != nil && uc.emailService != nil {
		if token, err := uc.tokenService.GenerateVerificationToken(user.ID); err == nil {
			expiresAt := time.Now().Add(24 * time.Hour)
			_ = uc.verificationRepo.Create(token, user.ID, expiresAt)
			go uc.emailService.SendVerificationEmail(user.Email, token)
		}
	}

	return &dto.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}, nil
}
