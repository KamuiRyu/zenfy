package router

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"zenfy-api/application/service"
	"zenfy-api/config"
	"zenfy-api/domain/repository"
	handlerpkg "zenfy-api/interfaces/handler"
	"zenfy-api/interfaces/middleware"
)

func NewRouter(authHandler *handlerpkg.AuthHandler, userHandler *handlerpkg.UserHandler, cardHandler *handlerpkg.CardHandler, transactionHandler *handlerpkg.TransactionHandler, categoryHandler *handlerpkg.CategoryHandler, tokenService service.TokenService, invalidTokenRepo repository.InvalidTokenRepository) *fiber.App {
	app := fiber.New()
	cfg := config.Cfg
	if cfg == nil {
		panic("config.Cfg is nil; call config.Load before NewRouter")
	}

	app.Use(cors.New(
		cors.Config{
			AllowOrigins: cfg.CorsOrigin,
			AllowMethods: cfg.CorsMethods,
			AllowHeaders: cfg.CorsHeaders,
		},
	))

	if cfg.LogEnableConsole == "true" {
		app.Use(
			logger.New(
				logger.Config{
					Format: "${time} - [${ip}]:${port} ${status} - ${method} ${path}\n",
				},
			),
		)
	}

	api := app.Group("/api")

	auth := api.Group("/auth")
	auth.Use(limiter.New(limiter.Config{
		Max:        5,
		Expiration: 15 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP() + c.Get("X-Forwarded-For")
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"success": false,
				"code":    "RATE_LIMIT_EXCEEDED",
				"message": "Too many login attempts. Please try again later.",
			})
		},
	}))
	auth.Post("/login", authHandler.Login)
	auth.Get("/verify", authHandler.Verify)
	auth.Post("/resend", authHandler.Resend)
	auth.Post("/refresh", authHandler.Refresh)
	auth.Get("/validate", authHandler.Validate)
	auth.Get("/me", authHandler.Me)
	auth.Post("/logout", authHandler.Logout)
	auth.Post("/request-password-reset", authHandler.RequestPasswordReset)
	auth.Post("/reset-password", authHandler.ResetPassword)

	users := api.Group("/users")
	users.Post("/", userHandler.Create)

	authMiddleware := middleware.AuthMiddleware(tokenService, invalidTokenRepo)

	cards := api.Group("/cards")
	cards.Use(authMiddleware)
	cards.Post("/", cardHandler.AddCard)
	cards.Get("/", cardHandler.GetCards)
	cards.Get("/:id", cardHandler.GetCard)
	cards.Put("/:id", cardHandler.UpdateCard)
	cards.Delete("/:id", cardHandler.DeleteCard)
	cards.Patch("/:id/default", cardHandler.SetDefaultCard)

	transactions := api.Group("/transactions")
	transactions.Use(authMiddleware)
	transactions.Post("/", transactionHandler.CreateTransaction)
	transactions.Get("/balance-overview", transactionHandler.GetBalanceOverview)
	transactions.Get("/", transactionHandler.ListTransactionsByUser)
	transactions.Get("/:id", transactionHandler.GetTransaction)
	transactions.Put("/:id", transactionHandler.UpdateTransaction)
	transactions.Delete("/:id", transactionHandler.DeleteTransaction)

	categories := api.Group("/categories")
	categories.Use(authMiddleware)
	categories.Post("/", categoryHandler.CreateCategory)
	categories.Get("/", categoryHandler.GetCategories)
	categories.Put("/:uuid", categoryHandler.UpdateCategory)
	categories.Delete("/:uuid", categoryHandler.DeleteCategory)

	return app
}
