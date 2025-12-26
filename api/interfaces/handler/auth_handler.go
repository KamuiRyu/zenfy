package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"zenfy-api/application/dto"
	usecase "zenfy-api/application/usecase/auth"
	resp "zenfy-api/interfaces/response"
	"zenfy-api/interfaces/response/messages"
)

type AuthHandler struct {
	uc                     *usecase.LoginUseCase
	verifyUC               *usecase.VerifyEmailUseCase
	resendUC               *usecase.ResendVerificationUseCase
	requestPasswordResetUC *usecase.RequestPasswordResetUseCase
	resetPasswordUC        *usecase.ResetPasswordUseCase
	getMeUC                *usecase.GetCurrentUserUseCase
	logoutUC               *usecase.LogoutUseCase
	refreshUC              *usecase.RefreshTokenUseCase
}

func NewAuthHandler(u *usecase.LoginUseCase, v *usecase.VerifyEmailUseCase, r *usecase.ResendVerificationUseCase, pr *usecase.RequestPasswordResetUseCase, rp *usecase.ResetPasswordUseCase, gm *usecase.GetCurrentUserUseCase, lo *usecase.LogoutUseCase, rf *usecase.RefreshTokenUseCase) *AuthHandler {
	return &AuthHandler{uc: u, verifyUC: v, resendUC: r, requestPasswordResetUC: pr, resetPasswordUC: rp, getMeUC: gm, logoutUC: lo, refreshUC: rf}
}

func (h *AuthHandler) Me(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" {
		return resp.Error(c, fiber.StatusUnauthorized, "UNAUTHORIZED", messages.Unauthorized, nil)
	}
	var token string
	if len(auth) > 7 && auth[:7] == "Bearer " {
		token = auth[7:]
	} else {
		token = auth
	}

	user, err := h.getMeUC.Execute(token)
	if err != nil {
		return resp.Error(c, fiber.StatusUnauthorized, "INVALID_TOKEN", messages.InvalidToken, err)
	}
	if user == nil {
		return resp.Error(c, fiber.StatusNotFound, "USER_NOT_FOUND", messages.UserNotFound, nil)
	}
	return resp.Success(c, fiber.StatusOK, user, messages.UserFound)
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" {
		return resp.Error(c, fiber.StatusUnauthorized, "UNAUTHORIZED", messages.Unauthorized, nil)
	}
	var token string
	if len(auth) > 7 && auth[:7] == "Bearer " {
		token = auth[7:]
	} else {
		token = auth
	}
	if err := h.logoutUC.Execute(token); err != nil {
		return resp.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, err)
	}
	return resp.Success(c, fiber.StatusOK, nil, messages.LogoutSuccessful)
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequestDTO
	if err := c.BodyParser(&req); err != nil {
		return resp.Error(c, fiber.StatusBadRequest, "INVALID_PAYLOAD", messages.InvalidPayload, err)
	}

	res, err := h.uc.Execute(req)
	if err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		if err.Error() == "INVALID_CREDENTIALS" {
			return resp.Error(c, fiber.StatusUnauthorized, "INVALID_CREDENTIALS", messages.InvalidCredentials, nil)
		}
		return resp.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, err)
	}
	return resp.Success(c, fiber.StatusOK, res, messages.LoginSuccessful)
}

func (h *AuthHandler) Verify(c *fiber.Ctx) error {
	token := c.Query("token")
	if token == "" {
		return resp.Error(c, fiber.StatusBadRequest, "INVALID_PAYLOAD", messages.TokenRequired, nil)
	}

	if err := h.verifyUC.Execute(token); err != nil {
		return resp.Error(c, fiber.StatusBadRequest, "INVALID_TOKEN", messages.InvalidToken, err)
	}

	return resp.Success(c, fiber.StatusOK, nil, messages.EmailVerified)
}

func (h *AuthHandler) Resend(c *fiber.Ctx) error {
	var req dto.ResendVerificationRequestDTO
	if err := c.BodyParser(&req); err != nil {
		return resp.Error(c, fiber.StatusBadRequest, "INVALID_PAYLOAD", messages.InvalidPayload, err)
	}

	if err := h.resendUC.Execute(req); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		if err.Error() == "USER_NOT_FOUND" {
			return resp.Error(c, fiber.StatusNotFound, "USER_NOT_FOUND", messages.UserNotFound, nil)
		}
		if err.Error() == "EMAIL_ALREADY_VERIFIED" {
			return resp.Error(c, fiber.StatusBadRequest, "EMAIL_ALREADY_VERIFIED", messages.EmailAlreadyVerified, nil)
		}
		return resp.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, err)
	}
	return resp.Success(c, fiber.StatusOK, nil, messages.VerificationEmailSent)
}

func (h *AuthHandler) RequestPasswordReset(c *fiber.Ctx) error {
	var req dto.RequestPasswordResetRequestDTO
	if err := c.BodyParser(&req); err != nil {
		return resp.Error(c, fiber.StatusBadRequest, "INVALID_PAYLOAD", messages.InvalidPayload, err)
	}

	if err := h.requestPasswordResetUC.Execute(req); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		return resp.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, err)
	}
	return resp.Success(c, fiber.StatusOK, nil, messages.PasswordResetEmailSent)
}

func (h *AuthHandler) ResetPassword(c *fiber.Ctx) error {
	var req dto.ResetPasswordRequestDTO
	if err := c.BodyParser(&req); err != nil {
		return resp.Error(c, fiber.StatusBadRequest, "INVALID_PAYLOAD", messages.InvalidPayload, err)
	}

	if err := h.resetPasswordUC.Execute(req); err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		if err.Error() == "INVALID_OR_EXPIRED_TOKEN" {
			return resp.Error(c, fiber.StatusBadRequest, "INVALID_OR_EXPIRED_TOKEN", messages.InvalidOrExpiredToken, nil)
		}
		return resp.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, err)
	}
	return resp.Success(c, fiber.StatusOK, nil, messages.PasswordResetSuccessful)
}

func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" {
		return resp.Error(c, fiber.StatusUnauthorized, "UNAUTHORIZED", messages.Unauthorized, nil)
	}
	var token string
	if len(auth) > 7 && auth[:7] == "Bearer " {
		token = auth[7:]
	} else {
		token = auth
	}

	tokenData, err := h.refreshUC.Execute(token)
	if err != nil {
		return resp.Error(c, fiber.StatusUnauthorized, "INVALID_TOKEN", messages.InvalidToken, err)
	}
	return resp.Success(c, fiber.StatusOK, map[string]string{"token": tokenData.Token, "refresh_token": tokenData.Refresh}, messages.TokenRefreshed)
}

func (h *AuthHandler) Validate(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" {
		return resp.Error(c, fiber.StatusUnauthorized, "UNAUTHORIZED", messages.Unauthorized, nil)
	}
	var token string
	if len(auth) > 7 && auth[:7] == "Bearer " {
		token = auth[7:]
	} else {
		token = auth
	}

	user, err := h.getMeUC.Execute(token)
	if err != nil {
		return resp.Error(c, fiber.StatusUnauthorized, "INVALID_TOKEN", messages.InvalidToken, err)
	}
	return resp.Success(c, fiber.StatusOK, user, messages.UserFound)
}
