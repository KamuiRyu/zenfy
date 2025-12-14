package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"zenfy-api/config"
	handlerpkg "zenfy-api/interfaces/handler"
)

func NewRouter(authHandler *handlerpkg.AuthHandler, userHandler *handlerpkg.UserHandler) *fiber.App {
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

	return app
}
