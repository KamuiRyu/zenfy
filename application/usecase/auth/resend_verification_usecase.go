package usecase

import (
	"database/sql"
	"errors"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type ResendVerificationUseCase struct {
	verificationRepo repository.VerificationTokenRepository
	userRepo         repository.UserRepository
	tokenService     service.TokenService
	emailService     service.EmailService
	validator        service.ValidationService
}

func NewResendVerificationUseCase(
	verificationRepo repository.VerificationTokenRepository,
	userRepo repository.UserRepository,
	tokenService service.TokenService,
	emailService service.EmailService,
	validator service.ValidationService,
) *ResendVerificationUseCase {
	return &ResendVerificationUseCase{verificationRepo: verificationRepo, userRepo: userRepo, tokenService: tokenService, emailService: emailService, validator: validator}
}

func (uc *ResendVerificationUseCase) Execute(input dto.ResendVerificationRequestDTO) error {
	if err := uc.validator.Validate(&input); err != nil {
		return err
	}

	user, err := uc.userRepo.GetByEmail(input.Email)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("USER_NOT_FOUND")
	}
	if user.Verified {
		return errors.New("EMAIL_ALREADY_VERIFIED")
	}

	const resendCooldown = 1 * time.Minute
	if lastCreatedAt, err := uc.verificationRepo.GetLatestCreatedAt(user.ID); err == nil {
		if time.Since(lastCreatedAt) < resendCooldown {
			return errors.New("TOO_MANY_REQUESTS")
		}
	} else if err != nil && err != sql.ErrNoRows {
		return err
	}

	token, err := uc.tokenService.GenerateVerificationToken(user.ID)
	if err != nil {
		return err
	}
	expiresAt := time.Now().Add(24 * time.Hour)
	if err := uc.verificationRepo.Create(token, user.ID, expiresAt); err != nil {
		return err
	}
	go uc.emailService.SendVerificationEmail(user.Email, token)
	return nil
}
