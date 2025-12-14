package usecase

import (
	"database/sql"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type RequestPasswordResetUseCase struct {
	passwordResetRepo repository.PasswordResetTokenRepository
	userRepo          repository.UserRepository
	tokenService      service.TokenService
	emailService      service.EmailService
	validator         service.ValidationService
}

func NewRequestPasswordResetUseCase(passwordResetRepo repository.PasswordResetTokenRepository, userRepo repository.UserRepository, tokenService service.TokenService, emailService service.EmailService, validator service.ValidationService) *RequestPasswordResetUseCase {
	return &RequestPasswordResetUseCase{passwordResetRepo: passwordResetRepo, userRepo: userRepo, tokenService: tokenService, emailService: emailService, validator: validator}
}

func (uc *RequestPasswordResetUseCase) Execute(input dto.RequestPasswordResetRequestDTO) error {
	if err := uc.validator.Validate(&input); err != nil {
		return err
	}

	user, err := uc.userRepo.GetByEmail(input.Email)
	if err != nil {
		return err
	}
	if user == nil {
		return nil
	}

	const resetCooldown = 1 * time.Minute
	if lastCreatedAt, err := uc.passwordResetRepo.GetLatestCreatedAt(user.ID); err == nil {
		if time.Since(lastCreatedAt) < resetCooldown {
			return nil
		}
	} else if err != nil && err != sql.ErrNoRows {
		return err
	}

	token, err := uc.tokenService.GeneratePasswordResetToken(user.ID)
	if err != nil {
		return err
	}
	expiresAt := time.Now().Add(1 * time.Hour)
	if err := uc.passwordResetRepo.Create(token, user.ID, expiresAt); err != nil {
		return err
	}
	go uc.emailService.SendPasswordResetEmail(user.Email, token)
	return nil
}
