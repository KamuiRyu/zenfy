package usecase

import (
	"time"

	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type RefreshTokenUseCase struct {
	tokenService service.TokenService
	refreshRepo  repository.RefreshTokenRepository
}

func NewRefreshTokenUseCase(tokenService service.TokenService, refreshRepo repository.RefreshTokenRepository) *RefreshTokenUseCase {
	return &RefreshTokenUseCase{tokenService: tokenService, refreshRepo: refreshRepo}
}

// Execute consumes the provided refresh token, issues a new access token and a new refresh token (rotation).
func (uc *RefreshTokenUseCase) Execute(token string) (string, string, error) {
	userID, err := uc.refreshRepo.Consume(token)
	if err != nil {
		return "", "", err
	}

	accessToken, err := uc.tokenService.GenerateAuthToken(userID)
	if err != nil {
		return "", "", err
	}

	newRefresh, err := uc.tokenService.GenerateRefreshToken(userID)
	if err != nil {
		return "", "", err
	}
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	if err := uc.refreshRepo.Create(newRefresh, userID, expiresAt); err != nil {
		return "", "", err
	}

	return accessToken, newRefresh, nil
}
