package handler

import (
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"zenfy-api/application/dto"
	usecase "zenfy-api/application/usecase/card"
	"zenfy-api/interfaces/response"
	resp "zenfy-api/interfaces/response"
	"zenfy-api/interfaces/response/messages"
)

type CardHandler struct {
	addCardUC        *usecase.AddCardUseCase
	getCardsUC       *usecase.GetCardsUseCase
	getCardUC        *usecase.GetCardUseCase
	updateCardUC     *usecase.UpdateCardUseCase
	deleteCardUC     *usecase.DeleteCardUseCase
	setDefaultCardUC *usecase.SetDefaultCardUseCase
}

func NewCardHandler(
	addCardUC *usecase.AddCardUseCase,
	getCardsUC *usecase.GetCardsUseCase,
	getCardUC *usecase.GetCardUseCase,
	updateCardUC *usecase.UpdateCardUseCase,
	deleteCardUC *usecase.DeleteCardUseCase,
	setDefaultCardUC *usecase.SetDefaultCardUseCase,
) *CardHandler {
	return &CardHandler{
		addCardUC:        addCardUC,
		getCardsUC:       getCardsUC,
		getCardUC:        getCardUC,
		updateCardUC:     updateCardUC,
		deleteCardUC:     deleteCardUC,
		setDefaultCardUC: setDefaultCardUC,
	}
}

func (h *CardHandler) AddCard(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req dto.AddCardRequest
	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", nil)
	}

	card, err := h.addCardUC.Execute(userID, req)
	if err != nil {
		println(err)
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		return response.Error(c, fiber.StatusBadRequest, "CARD_ADD_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusCreated, card, messages.CardAdded)
}

func (h *CardHandler) GetCards(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	cards, err := h.getCardsUC.Execute(userID)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "FETCH_CARDS_FAILED", "Failed to fetch cards", nil)
	}

	return response.Success(c, fiber.StatusOK, cards, messages.CardsFetched)
}

// GetCard handles GET /api/cards/:id
func (h *CardHandler) GetCard(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	cardID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CARD_ID", "Invalid card ID", nil)
	}

	card, err := h.getCardUC.Execute(userID, cardID)
	if err != nil {
		return response.Error(c, fiber.StatusNotFound, "CARD_NOT_FOUND", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, card, messages.CardFetched)
}

// UpdateCard handles PUT /api/cards/:id
func (h *CardHandler) UpdateCard(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	cardID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CARD_ID", "Invalid card ID", nil)
	}

	var req dto.UpdateCardRequest
	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", nil)
	}

	card, err := h.updateCardUC.Execute(userID, cardID, req)
	if err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		return response.Error(c, fiber.StatusBadRequest, "CARD_UPDATE_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, card, messages.CardUpdated)
}

// DeleteCard handles DELETE /api/cards/:id
func (h *CardHandler) DeleteCard(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	cardID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CARD_ID", "Invalid card ID", nil)
	}

	if err := h.deleteCardUC.Execute(userID, cardID); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "CARD_DELETE_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, nil, messages.CardDeleted)
}

// SetDefaultCard handles PATCH /api/cards/:id/default
func (h *CardHandler) SetDefaultCard(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	cardID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CARD_ID", "Invalid card ID", nil)
	}

	if err := h.setDefaultCardUC.Execute(userID, cardID); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "SET_DEFAULT_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, nil, messages.CardSetDefault)
}
