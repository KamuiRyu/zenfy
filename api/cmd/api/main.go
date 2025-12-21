package main

import (
	"log"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"

	"zenfy-api/application/service"
	authusecase "zenfy-api/application/usecase/auth"
	cardusecase "zenfy-api/application/usecase/card"
	categoryusecase "zenfy-api/application/usecase/category"
	transactionusecase "zenfy-api/application/usecase/transaction"
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
	refreshRepo := repositoryimpl.NewRefreshTokenRepository(bunDB)
	cardRepo := repositoryimpl.NewCardRepository(bunDB)
	transactionRepo := repositoryimpl.NewTransactionRepository(bunDB)
	categoryRepo := repositoryimpl.NewCategoryRepository(bunDB)

	// services
	tokenSvc := service.NewTokenService()
	validationSvc := service.NewValidationService()
	emailSvc := service.NewEmailService()

	// use cases
	loginUC := authusecase.NewLoginUseCase(userRepo, refreshRepo, tokenSvc, validationSvc)
	verifyEmailUC := authusecase.NewVerifyEmailUseCase(verificationRepo, userRepo, tokenSvc)
	resendUC := authusecase.NewResendVerificationUseCase(verificationRepo, userRepo, tokenSvc, emailSvc, validationSvc)
	resetPasswordUC := authusecase.NewResetPasswordUseCase(passwordResetRepo, userRepo, validationSvc)
	requestPasswordResetUC := authusecase.NewRequestPasswordResetUseCase(passwordResetRepo, userRepo, tokenSvc, emailSvc, validationSvc)
	createUserUC := userusecase.NewCreateUserUseCase(userRepo, verificationRepo, emailSvc, tokenSvc, validationSvc)
	getMeUC := authusecase.NewGetCurrentUserUseCase(tokenSvc, userRepo)
	logoutUC := authusecase.NewLogoutUseCase(refreshRepo)
	refreshUC := authusecase.NewRefreshTokenUseCase(tokenSvc, refreshRepo)
	addCardUC := cardusecase.NewAddCardUseCase(cardRepo, validationSvc)
	getCardsUC := cardusecase.NewGetCardsUseCase(cardRepo)
	getCardUC := cardusecase.NewGetCardUseCase(cardRepo)
	updateCardUC := cardusecase.NewUpdateCardUseCase(cardRepo, validationSvc)
	deleteCardUC := cardusecase.NewDeleteCardUseCase(cardRepo)
	setDefaultCardUC := cardusecase.NewSetDefaultCardUseCase(cardRepo)
	createTransactionUC := transactionusecase.NewCreateTransactionUseCase(transactionRepo, userRepo, cardRepo, categoryRepo, validationSvc)
	getTransactionUC := transactionusecase.NewGetTransactionUseCase(transactionRepo, userRepo, categoryRepo, cardRepo)
	updateTransactionUC := transactionusecase.NewUpdateTransactionUseCase(transactionRepo, userRepo, categoryRepo, cardRepo, validationSvc)
	deleteTransactionUC := transactionusecase.NewDeleteTransactionUseCase(transactionRepo)
	listTransactionsUC := transactionusecase.NewListTransactionsUseCase(transactionRepo, userRepo, categoryRepo, cardRepo)
	getTransactionSummaryUC := transactionusecase.NewGetTransactionSummaryUseCase(transactionRepo, categoryRepo)
	createCategoryUC := categoryusecase.NewCreateCategoryUseCase(categoryRepo, validationSvc)
	getCategoriesUC := categoryusecase.NewGetCategoriesUseCase(categoryRepo)
	updateCategoryUC := categoryusecase.NewUpdateCategoryUseCase(categoryRepo, validationSvc)
	deleteCategoryUC := categoryusecase.NewDeleteCategoryUseCase(categoryRepo)

	// handlers (depend on use cases)
	authHandler := handler.NewAuthHandler(loginUC, verifyEmailUC, resendUC, requestPasswordResetUC, resetPasswordUC, getMeUC, logoutUC, refreshUC)
	userHandler := handler.NewUserHandler(createUserUC)
	cardHandler := handler.NewCardHandler(addCardUC, getCardsUC, getCardUC, updateCardUC, deleteCardUC, setDefaultCardUC)
	transactionHandler := handler.NewTransactionHandler(createTransactionUC, getTransactionUC, updateTransactionUC, deleteTransactionUC, listTransactionsUC, getTransactionSummaryUC)
	categoryHandler := handler.NewCategoryHandler(createCategoryUC, getCategoriesUC, updateCategoryUC, deleteCategoryUC)

	app := routerpkg.NewRouter(authHandler, userHandler, cardHandler, transactionHandler, categoryHandler, tokenSvc)

	addr := ":8080"
	if config.Cfg != nil && config.Cfg.AppPort != "" {
		addr = ":" + config.Cfg.AppPort
	}

	log.Println("🚀 Server running on", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatal(err)
	}

}
