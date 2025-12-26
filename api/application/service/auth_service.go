package service

import (
	"database/sql"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"zenfy-api/application/dto"
	"zenfy-api/domain/repository"
)

type AuthService interface {
	Login(input dto.LoginRequestDTO) (*dto.LoginResponseDTO, error)
	VerifyEmail(token string) error
	ResendVerification(email string) error
	RequestPasswordReset(email string) error
	ResetPassword(token, newPassword string) error
	GetCurrentUser(token string) (*dto.UserResponse, error)
	Logout(token string) error
	RefreshToken(refreshToken string) (*dto.TokenData, error)
}

type authService struct {
	userRepo          repository.UserRepository
	verificationRepo  repository.VerificationTokenRepository
	passwordResetRepo repository.PasswordResetTokenRepository
	refreshRepo       repository.RefreshTokenRepository
	invalidTokenRepo  repository.InvalidTokenRepository
	tokenService      TokenService
	emailService      EmailService
}

func NewAuthService(
	userRepo repository.UserRepository,
	verificationRepo repository.VerificationTokenRepository,
	passwordResetRepo repository.PasswordResetTokenRepository,
	refreshRepo repository.RefreshTokenRepository,
	invalidTokenRepo repository.InvalidTokenRepository,
	tokenService TokenService,
	emailService EmailService,
) AuthService {
	return &authService{
		userRepo:          userRepo,
		verificationRepo:  verificationRepo,
		passwordResetRepo: passwordResetRepo,
		refreshRepo:       refreshRepo,
		invalidTokenRepo:  invalidTokenRepo,
		tokenService:      tokenService,
		emailService:      emailService,
	}
}

func (s *authService) Login(input dto.LoginRequestDTO) (*dto.LoginResponseDTO, error) {
	user, err := s.userRepo.GetByEmail(input.Email)
	if err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}
	if user == nil {
		return nil, errors.New("INVALID_CREDENTIALS")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return nil, errors.New("INVALID_CREDENTIALS")
	}

	token, err := s.tokenService.GenerateAuthToken(user.ID)
	if err != nil {
		return nil, errors.New("ERROR_GENERATING_TOKEN")
	}

	// create refresh token and persist
	refreshToken, err := s.tokenService.GenerateRefreshToken(user.ID)
	if err != nil {
		return nil, errors.New("ERROR_GENERATING_REFRESH_TOKEN")
	}
	refreshExpiresAt := time.Now().Add(7 * 24 * time.Hour)
	if err := s.refreshRepo.Create(refreshToken, user.ID, refreshExpiresAt); err != nil {
		return nil, errors.New("ERROR_SAVING_REFRESH_TOKEN")
	}

	accessExpiresAt := time.Now().Add(24 * time.Hour)

	return &dto.LoginResponseDTO{
		Uuid:      user.Uuid,
		Name:      user.Name,
		Email:     user.Email,
		AvatarUrl: user.AvatarUrl,
		TokenData: dto.TokenData{
			Token:     token,
			Refresh:   refreshToken,
			ExpiresAt: accessExpiresAt.Unix(),
		},
	}, nil
}

func (s *authService) VerifyEmail(token string) error {
	userID, err := s.verificationRepo.Consume(token)
	if err == nil {
		return s.userRepo.SetVerified(userID)
	}

	userID, err = s.tokenService.ParseToken(token)
	if err != nil {
		return errors.New("INVALID_TOKEN")
	}
	return s.userRepo.SetVerified(userID)
}

func (s *authService) ResendVerification(email string) error {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return errors.New("INTERNAL_ERROR")
	}
	if user == nil {
		return errors.New("USER_NOT_FOUND")
	}
	if user.Verified {
		return errors.New("EMAIL_ALREADY_VERIFIED")
	}

	const resendCooldown = 1 * time.Minute
	if lastCreatedAt, err := s.verificationRepo.GetLatestCreatedAt(user.ID); err == nil {
		if time.Since(lastCreatedAt) < resendCooldown {
			return errors.New("TOO_MANY_REQUESTS")
		}
	} else if err != nil && err != sql.ErrNoRows {
		return err
	}

	token, err := s.tokenService.GenerateVerificationToken(user.ID)
	if err != nil {
		return errors.New("ERROR_GENERATING_VERIFICATION_TOKEN")
	}
	expiresAt := time.Now().Add(24 * time.Hour)
	if err := s.verificationRepo.Create(token, user.ID, expiresAt); err != nil {
		return errors.New("ERROR_SAVING_VERIFICATION_TOKEN")
	}
	go s.emailService.SendVerificationEmail(user.Email, token)
	return nil
}

func (s *authService) RequestPasswordReset(email string) error {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return errors.New("INTERNAL_ERROR")
	}
	if user == nil {
		return errors.New("USER_NOT_FOUND")
	}

	const resetCooldown = 1 * time.Minute
	if lastCreatedAt, err := s.passwordResetRepo.GetLatestCreatedAt(user.ID); err == nil {
		if time.Since(lastCreatedAt) < resetCooldown {
			return nil
		}
	} else if err != nil && err != sql.ErrNoRows {
		return errors.New("INTERNAL_ERROR")
	}

	token, err := s.tokenService.GeneratePasswordResetToken(user.ID)
	if err != nil {
		return errors.New("ERROR_GENERATING_PASSWORD_RESET_TOKEN")
	}
	expiresAt := time.Now().Add(1 * time.Hour)
	if err := s.passwordResetRepo.Create(token, user.ID, expiresAt); err != nil {
		return errors.New("ERROR_SAVING_PASSWORD_RESET_TOKEN")
	}
	go s.emailService.SendPasswordResetEmail(user.Email, token)
	return nil
}

func (s *authService) ResetPassword(token, newPassword string) error {
	userID, err := s.passwordResetRepo.Consume(token)
	if err != nil {
		return errors.New("INVALID_OR_EXPIRED_TOKEN")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("INTERNAL_ERROR")
	}

	if err := s.userRepo.UpdatePassword(userID, string(hashed)); err != nil {
		return errors.New("INTERNAL_ERROR")
	}

	return nil
}

func (s *authService) GetCurrentUser(token string) (*dto.UserResponse, error) {
	// Check if token is invalidated
	isInvalid, err := s.invalidTokenRepo.IsInvalid(token)
	if err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}
	if isInvalid {
		return nil, errors.New("INVALID_TOKEN")
	}

	userID, err := s.tokenService.ParseToken(token)
	if err != nil {
		return nil, errors.New("INVALID_TOKEN")
	}
	u, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}
	if u == nil {
		return nil, nil
	}
	return &dto.UserResponse{Uuid: u.Uuid, Name: u.Name, Email: u.Email, CreatedAt: u.CreatedAt}, nil
}

func (s *authService) Logout(token string) error {
	if token == "" {
		return nil
	}

	// Extract user ID from token
	userID, err := s.tokenService.ParseToken(token)
	if err != nil {
		userID = 0
	}

	// Invalidate the access token
	expiresAt := time.Now().Add(24 * time.Hour) // Access tokens expire in 24 hours
	if err := s.invalidTokenRepo.Create(token, userID, expiresAt); err != nil {
		return errors.New("INTERNAL_ERROR")
	}

	// Consume refresh token if provided (optional)
	_, err = s.refreshRepo.Consume(token)
	if err != nil && err != sql.ErrNoRows {
		return errors.New("INTERNAL_ERROR")
	}

	return nil
}

func (s *authService) RefreshToken(refreshToken string) (*dto.TokenData, error) {
	userID, err := s.refreshRepo.Consume(refreshToken)
	if err != nil {
		return nil, errors.New("INVALID_OR_EXPIRED_REFRESH_TOKEN")
	}

	accessToken, err := s.tokenService.GenerateAuthToken(userID)
	if err != nil {
		return nil, errors.New("ERROR_GENERATING_TOKEN")
	}

	newRefresh, err := s.tokenService.GenerateRefreshToken(userID)
	if err != nil {
		return nil, errors.New("ERROR_GENERATING_REFRESH_TOKEN")
	}
	refreshExpiresAt := time.Now().Add(7 * 24 * time.Hour)
	if err := s.refreshRepo.Create(newRefresh, userID, refreshExpiresAt); err != nil {
		return nil, errors.New("ERROR_SAVING_REFRESH_TOKEN")
	}

	accessExpiresAt := time.Now().Add(24 * time.Hour)

	return &dto.TokenData{
		Token:     accessToken,
		Refresh:   newRefresh,
		ExpiresAt: accessExpiresAt.Unix(),
	}, nil
}
