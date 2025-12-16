package usecase

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"zenfy-api/application/dto"
	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
)

type LoginUseCase struct {
	userRepo     repository.UserRepository
	refreshRepo  repository.RefreshTokenRepository
	tokenService service.TokenService
	validator    service.ValidationService
}

func NewLoginUseCase(
	userRepo repository.UserRepository,
	refreshRepo repository.RefreshTokenRepository,
	tokenService service.TokenService,
	validator service.ValidationService,
) *LoginUseCase {
	return &LoginUseCase{userRepo: userRepo, refreshRepo: refreshRepo, tokenService: tokenService, validator: validator}
}

func (uc *LoginUseCase) Execute(input dto.LoginRequestDTO) (*dto.LoginResponseDTO, error) {
	if err := uc.validator.Validate(&input); err != nil {
		return nil, err
	}

	user, err := uc.userRepo.GetByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("INVALID_CREDENTIALS")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return nil, errors.New("INVALID_CREDENTIALS")
	}

	token, err := uc.tokenService.GenerateAuthToken(user.ID)
	if err != nil {
		return nil, err
	}

	// create refresh token and persist
	refreshToken, err := uc.tokenService.GenerateRefreshToken(user.ID)
	if err != nil {
		return nil, err
	}
	expiresAt := time.Now().Add(7 * 24 * time.Hour)
	if err := uc.refreshRepo.Create(refreshToken, user.ID, expiresAt); err != nil {
		return nil, err
	}

	return &dto.LoginResponseDTO{Uuid: user.Uuid, Name: user.Name, Email: user.Email, AvatarUrl: user.AvatarUrl, TokenData: dto.TokenData{Token: token, Refresh: refreshToken, ExpiresAt: expiresAt.Unix()}}, nil
}
