package usecase

import (
	"errors"

	"golang.org/x/crypto/bcrypt"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type ResetPasswordUseCase struct {
	passwordResetRepo repository.PasswordResetTokenRepository
	userRepo          repository.UserRepository
	validator         service.ValidationService
}

func NewResetPasswordUseCase(passwordResetRepo repository.PasswordResetTokenRepository, userRepo repository.UserRepository, validator service.ValidationService) *ResetPasswordUseCase {
	return &ResetPasswordUseCase{passwordResetRepo: passwordResetRepo, userRepo: userRepo, validator: validator}
}

func (uc *ResetPasswordUseCase) Execute(input dto.ResetPasswordRequestDTO) error {
	if err := uc.validator.Validate(&input); err != nil {
		return err
	}

	userID, err := uc.passwordResetRepo.Consume(input.Token)
	if err != nil {
		return errors.New("INVALID_OR_EXPIRED_TOKEN")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if err := uc.userRepo.UpdatePassword(userID, string(hashed)); err != nil {
		return err
	}

	return nil
}
