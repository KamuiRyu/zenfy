package usecase

import (
	"fmt"

	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type VerifyEmailUseCase struct {
	verificationRepo repository.VerificationTokenRepository
	userRepo         repository.UserRepository
	tokenService     service.TokenService
}

func NewVerifyEmailUseCase(verificationRepo repository.VerificationTokenRepository, userRepo repository.UserRepository, tokenService service.TokenService) *VerifyEmailUseCase {
	return &VerifyEmailUseCase{verificationRepo: verificationRepo, userRepo: userRepo, tokenService: tokenService}
}

func (uc *VerifyEmailUseCase) Execute(token string) error {
	userID, err := uc.verificationRepo.Consume(token)
	if err == nil {
		return uc.userRepo.SetVerified(userID)
	}

	userID, err = uc.tokenService.ParseToken(token)
	if err != nil {
		return fmt.Errorf("invalid token: %w", err)
	}
	return uc.userRepo.SetVerified(userID)
}
