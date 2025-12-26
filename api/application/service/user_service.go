package service

import (
	"errors"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/domain/model"
	"zenfy-api/domain/repository"
)

type UserService interface {
	CreateUser(req dto.CreateUserRequestDTO) (*dto.UserResponse, error)
	GetUserByID(userID int) (*model.User, error)
	GetUserByEmail(email string) (*model.User, error)
	GetUserByUUID(uuid string) (*model.User, error)
}

type userService struct {
	userRepo         repository.UserRepository
	verificationRepo repository.VerificationTokenRepository
	emailService     EmailService
	tokenService     TokenService
}

func NewUserService(
	userRepo repository.UserRepository,
	verificationRepo repository.VerificationTokenRepository,
	emailService EmailService,
	tokenService TokenService,
) UserService {
	return &userService{
		userRepo:         userRepo,
		verificationRepo: verificationRepo,
		emailService:     emailService,
		tokenService:     tokenService,
	}
}

func (s *userService) CreateUser(req dto.CreateUserRequestDTO) (*dto.UserResponse, error) {
	// Check if user already exists
	existing, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}
	if existing != nil {
		return nil, errors.New("USER_ALREADY_EXISTS")
	}

	// Create new user
	user := model.NewUser(req.Name, req.Email, req.Password)

	// Hash password
	if err := user.HashPassword(); err != nil {
		return nil, errors.New("INTERNAL_ERROR")
	}

	// Save user
	if err := s.userRepo.Create(user); err != nil {
		return nil, errors.New("FAILED_CREATE_USER")
	}

	// Send verification email if services are available
	if s.tokenService != nil && s.emailService != nil {
		if token, err := s.tokenService.GenerateVerificationToken(user.ID); err == nil {
			expiresAt := time.Now().Add(24 * time.Hour)
			_ = s.verificationRepo.Create(token, user.ID, expiresAt)
			go s.emailService.SendVerificationEmail(user.Email, token)
		}
	}

	return &dto.UserResponse{
		Uuid:      user.Uuid,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}, nil
}

func (s *userService) GetUserByID(userID int) (*model.User, error) {
	return s.userRepo.GetByID(userID)
}

func (s *userService) GetUserByEmail(email string) (*model.User, error) {
	return s.userRepo.GetByEmail(email)
}

func (s *userService) GetUserByUUID(uuid string) (*model.User, error) {
	return s.userRepo.GetByUUID(uuid)
}
