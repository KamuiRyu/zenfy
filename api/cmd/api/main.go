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
	invalidTokenRepo := repositoryimpl.NewInvalidTokenRepository(bunDB)
	cardRepo := repositoryimpl.NewCardRepository(bunDB)
	transactionRepo := repositoryimpl.NewTransactionRepository(bunDB)
	categoryRepo := repositoryimpl.NewCategoryRepository(bunDB)

	// services
	tokenSvc := service.NewTokenService()
	validationSvc := service.NewValidationService()
	emailSvc := service.NewEmailService()
	transactionSvc := service.NewTransactionService(transactionRepo, userRepo, cardRepo, categoryRepo)
	categorySvc := service.NewCategoryService(categoryRepo)
	authSvc := service.NewAuthService(userRepo, verificationRepo, passwordResetRepo, refreshRepo, invalidTokenRepo, tokenSvc, emailSvc)
	cardSvc := service.NewCardService(cardRepo)
	userSvc := service.NewUserService(userRepo, verificationRepo, emailSvc, tokenSvc)

	// use cases
	loginUC := authusecase.NewLoginUseCase(authSvc, validationSvc)
	verifyEmailUC := authusecase.NewVerifyEmailUseCase(authSvc)
	resendUC := authusecase.NewResendVerificationUseCase(authSvc, validationSvc)
	resetPasswordUC := authusecase.NewResetPasswordUseCase(authSvc, validationSvc)
	requestPasswordResetUC := authusecase.NewRequestPasswordResetUseCase(authSvc, validationSvc)
	createUserUC := userusecase.NewCreateUserUseCase(userSvc, validationSvc)
	getMeUC := authusecase.NewGetCurrentUserUseCase(authSvc)
	logoutUC := authusecase.NewLogoutUseCase(authSvc)
	refreshUC := authusecase.NewRefreshTokenUseCase(authSvc)
	createCardUC := cardusecase.NewCreateCardUseCase(cardSvc, validationSvc)
	getCardsUC := cardusecase.NewGetCardsUseCase(cardSvc)
	getCardUC := cardusecase.NewGetCardUseCase(cardSvc)
	updateCardUC := cardusecase.NewUpdateCardUseCase(cardSvc, validationSvc)
	deleteCardUC := cardusecase.NewDeleteCardUseCase(cardSvc)
	setDefaultCardUC := cardusecase.NewSetDefaultCardUseCase(cardSvc)
	createTransactionUC := transactionusecase.NewCreateTransactionUseCase(transactionSvc, validationSvc)
	getTransactionUC := transactionusecase.NewGetTransactionUseCase(transactionSvc)
	updateTransactionUC := transactionusecase.NewUpdateTransactionUseCase(transactionSvc, validationSvc)
	deleteTransactionUC := transactionusecase.NewDeleteTransactionUseCase(transactionSvc)
	listTransactionsUC := transactionusecase.NewListTransactionsUseCase(transactionSvc)
	getTransactionSummaryUC := transactionusecase.NewGetTransactionSummaryUseCase(transactionSvc)
	createCategoryUC := categoryusecase.NewCreateCategoryUseCase(categorySvc, validationSvc)
	getCategoriesUC := categoryusecase.NewGetCategoriesUseCase(categorySvc)
	getCategoriyUC := categoryusecase.NewGetCategoriyUseCase(categorySvc)
	updateCategoryUC := categoryusecase.NewUpdateCategoryUseCase(categorySvc, validationSvc)
	deleteCategoryUC := categoryusecase.NewDeleteCategoryUseCase(categorySvc)

	// handlers (depend on use cases)
	authHandler := handler.NewAuthHandler(loginUC, verifyEmailUC, resendUC, requestPasswordResetUC, resetPasswordUC, getMeUC, logoutUC, refreshUC)
	userHandler := handler.NewUserHandler(createUserUC)
	cardHandler := handler.NewCardHandler(createCardUC, getCardsUC, getCardUC, updateCardUC, deleteCardUC, setDefaultCardUC)
	transactionHandler := handler.NewTransactionHandler(createTransactionUC, getTransactionUC, updateTransactionUC, deleteTransactionUC, listTransactionsUC, getTransactionSummaryUC, cardRepo)
	categoryHandler := handler.NewCategoryHandler(createCategoryUC, getCategoriesUC, getCategoriyUC, updateCategoryUC, deleteCategoryUC)

	app := routerpkg.NewRouter(authHandler, userHandler, cardHandler, transactionHandler, categoryHandler, tokenSvc, invalidTokenRepo)

	addr := ":8080"
	if config.Cfg != nil && config.Cfg.AppPort != "" {
		addr = ":" + config.Cfg.AppPort
	}

	log.Println("🚀 Server running on", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatal(err)
	}

}
