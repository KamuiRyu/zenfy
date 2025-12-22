package usecase

import (
	"database/sql"
	"time"

	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type LogoutUseCase struct {
	refreshRepo      repository.RefreshTokenRepository
	invalidTokenRepo repository.InvalidTokenRepository
	tokenService     service.TokenService
}

func NewLogoutUseCase(refreshRepo repository.RefreshTokenRepository, invalidTokenRepo repository.InvalidTokenRepository, tokenService service.TokenService) *LogoutUseCase {
	return &LogoutUseCase{
		refreshRepo:      refreshRepo,
		invalidTokenRepo: invalidTokenRepo,
		tokenService:     tokenService,
	}
}

func (uc *LogoutUseCase) Execute(token string) error {
	if token == "" {
		return nil
	}

	// Extract user ID from token
	userID, err := uc.tokenService.ParseToken(token)
	if err != nil {
		// If token is invalid, still try to invalidate it
		userID = 0
	}

	// Invalidate the access token
	expiresAt := time.Now().Add(24 * time.Hour) // Access tokens expire in 24 hours
	if err := uc.invalidTokenRepo.Create(token, userID, expiresAt); err != nil {
		return err
	}

	// Consume refresh token if provided (optional)
	if uc.refreshRepo != nil {
		_, err := uc.refreshRepo.Consume(token)
		if err != nil && err != sql.ErrNoRows {
			return err
		}
	}

	return nil
}
