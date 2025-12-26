package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"

	"zenfy-api/application/service"
	"zenfy-api/domain/repository"
	"zenfy-api/interfaces/response"
	"zenfy-api/interfaces/response/messages"
)

func AuthMiddleware(tokenService service.TokenService, invalidTokenRepo repository.InvalidTokenRepository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Get("Authorization")
		if auth == "" {
			return response.Error(c, fiber.StatusUnauthorized, "UNAUTHORIZED", messages.Unauthorized, nil)
		}

		var token string
		if strings.HasPrefix(auth, "Bearer ") {
			token = auth[7:]
		} else {
			token = auth
		}

		// Check if token is invalidated
		isInvalid, err := invalidTokenRepo.IsInvalid(token)
		if err != nil {
			return response.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, err)
		}
		if isInvalid {
			return response.Error(c, fiber.StatusUnauthorized, "INVALID_TOKEN", messages.InvalidToken, nil)
		}

		userID, err := tokenService.ParseToken(token)
		if err != nil {
			return response.Error(c, fiber.StatusUnauthorized, "INVALID_TOKEN", messages.InvalidToken, err)
		}

		c.Locals("userID", userID)
		return c.Next()
	}
}
