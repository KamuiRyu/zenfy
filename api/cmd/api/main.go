package main

import (
	"log"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"

	"zenfy-api/application/service"
	authusecase "zenfy-api/application/usecase/auth"
	userusecase "zenfy-api/application/usecase/user"
	"zenfy-api/config"
	"zenfy-api/infrastructure/database"
	repositoryimpl "zenfy-api/infrastructure/repository"
	routerpkg "zenfy-api/interfaces"
	"zenfy-api/interfaces/handler"
)

func main() {
	if _, err := config.Load(".env"); err != nil {
		log.Fatal("Failed to load config:", err)
	}

	if err := database.RunMigrations("infrastructure/migrations"); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	db, err := database.NewPostgresConnection()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	defer func() {
		if err := database.CloseConnection(); err != nil {
			log.Println("Error closing database connection:", err)
		}
	}()

	// repositories
	// wrap sql.DB with bun DB
	bunDB := bun.NewDB(db, pgdialect.New())
	userRepo := repositoryimpl.NewUserRepository(bunDB)
	verificationRepo := repositoryimpl.NewVerificationTokenRepository(bunDB)
	passwordResetRepo := repositoryimpl.NewPasswordResetTokenRepository(bunDB)

	// services
	tokenSvc := service.NewTokenService()
	validationSvc := service.NewValidationService()
	emailSvc := service.NewEmailService()

	// use cases
	refreshRepo := repositoryimpl.NewRefreshTokenRepository(bunDB)
	loginUC := authusecase.NewLoginUseCase(userRepo, refreshRepo, tokenSvc, validationSvc)
	verifyEmailUC := authusecase.NewVerifyEmailUseCase(verificationRepo, userRepo, tokenSvc)
	resendUC := authusecase.NewResendVerificationUseCase(verificationRepo, userRepo, tokenSvc, emailSvc, validationSvc)
	resetPasswordUC := authusecase.NewResetPasswordUseCase(passwordResetRepo, userRepo, validationSvc)
	requestPasswordResetUC := authusecase.NewRequestPasswordResetUseCase(passwordResetRepo, userRepo, tokenSvc, emailSvc, validationSvc)
	createUserUC := userusecase.NewCreateUserUseCase(userRepo, verificationRepo, emailSvc, tokenSvc, validationSvc)
	getMeUC := authusecase.NewGetCurrentUserUseCase(tokenSvc, userRepo)
	logoutUC := authusecase.NewLogoutUseCase(refreshRepo)
	refreshUC := authusecase.NewRefreshTokenUseCase(tokenSvc, refreshRepo)

	// handlers (depend on use cases)
	authHandler := handler.NewAuthHandler(loginUC, verifyEmailUC, resendUC, requestPasswordResetUC, resetPasswordUC, getMeUC, logoutUC, refreshUC)
	userHandler := handler.NewUserHandler(createUserUC)

	app := routerpkg.NewRouter(authHandler, userHandler)

	addr := ":8080"
	if config.Cfg != nil && config.Cfg.AppPort != "" {
		addr = ":" + config.Cfg.AppPort
	}

	log.Println("🚀 Server running on", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatal(err)
	}

}
