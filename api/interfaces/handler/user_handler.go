package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"zenfy-api/application/dto"
	usecase "zenfy-api/application/usecase/user"
	resp "zenfy-api/interfaces/response"
	"zenfy-api/interfaces/response/messages"
)

type UserHandler struct {
	uc *usecase.CreateUserUseCase
}

func NewUserHandler(u *usecase.CreateUserUseCase) *UserHandler {
	return &UserHandler{uc: u}
}

func (h *UserHandler) Create(c *fiber.Ctx) error {
	var req dto.CreateUserRequestDTO
	if err := c.BodyParser(&req); err != nil {
		return resp.Error(c, fiber.StatusBadRequest, "INVALID_PAYLOAD", messages.InvalidPayload, err)
	}

	res, err := h.uc.Execute(req)
	if err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		if err.Error() == "USER_ALREADY_EXISTS" {
			return resp.Error(c, fiber.StatusConflict, "USER_ALREADY_EXISTS", messages.UserAlreadyExists, nil)
		} else if err.Error() == "INTERNAL_ERROR" {
			return resp.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, nil)
		}
		return resp.Error(c, fiber.StatusInternalServerError, "INTERNAL_ERROR", messages.InternalServerError, err)
	}
	return resp.Success(c, fiber.StatusOK, "OK", messages.UserCreatedSuccess, res)
}
