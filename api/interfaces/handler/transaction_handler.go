package handler

import (
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"zenfy-api/application/dto"
	usecase "zenfy-api/application/usecase/transaction"
	"zenfy-api/domain/repository"
	"zenfy-api/interfaces/response"
	resp "zenfy-api/interfaces/response"
	"zenfy-api/interfaces/response/messages"
)

type TransactionHandler struct {
	createTransactionUC     *usecase.CreateTransactionUseCase
	getTransactionUC        *usecase.GetTransactionUseCase
	updateTransactionUC     *usecase.UpdateTransactionUseCase
	deleteTransactionUC     *usecase.DeleteTransactionUseCase
	listTransactionsUC      *usecase.ListTransactionsUseCase
	getTransactionSummaryUC *usecase.GetTransactionSummaryUseCase
	cardRepo                repository.CardRepository
}

func NewTransactionHandler(
	createTransactionUC *usecase.CreateTransactionUseCase,
	getTransactionUC *usecase.GetTransactionUseCase,
	updateTransactionUC *usecase.UpdateTransactionUseCase,
	deleteTransactionUC *usecase.DeleteTransactionUseCase,
	listTransactionsUC *usecase.ListTransactionsUseCase,
	getTransactionSummaryUC *usecase.GetTransactionSummaryUseCase,
	cardRepo repository.CardRepository,
) *TransactionHandler {
	return &TransactionHandler{
		createTransactionUC:     createTransactionUC,
		getTransactionUC:        getTransactionUC,
		updateTransactionUC:     updateTransactionUC,
		deleteTransactionUC:     deleteTransactionUC,
		listTransactionsUC:      listTransactionsUC,
		getTransactionSummaryUC: getTransactionSummaryUC,
		cardRepo:                cardRepo,
	}
}

func (h *TransactionHandler) CreateTransaction(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req dto.CreateTransactionRequest
	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", nil)
	}

	transaction, err := h.createTransactionUC.Execute(userID, req)
	if err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		return response.Error(c, fiber.StatusBadRequest, "TRANSACTION_CREATE_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusCreated, transaction, "Transaction created successfully")
}

func (h *TransactionHandler) GetTransaction(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	transactionIDStr := c.Params("id")

	transaction, err := h.getTransactionUC.Execute(userID, transactionIDStr)
	if err != nil {
		return response.Error(c, fiber.StatusNotFound, "TRANSACTION_NOT_FOUND", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, transaction, "Transaction fetched successfully")
}

func (h *TransactionHandler) UpdateTransaction(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	transactionIDStr := c.Params("id")

	var req dto.UpdateTransactionRequest
	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", nil)
	}

	transaction, err := h.updateTransactionUC.Execute(userID, transactionIDStr, req)
	if err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		return response.Error(c, fiber.StatusBadRequest, "TRANSACTION_UPDATE_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, transaction, "Transaction updated successfully")
}

func (h *TransactionHandler) DeleteTransaction(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	transactionIDStr := c.Params("id")
	err := h.deleteTransactionUC.ExecuteByUUID(userID, transactionIDStr)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "TRANSACTION_DELETE_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, nil, "Transaction deleted successfully")
}

func (h *TransactionHandler) ListTransactionsByCard(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	cardIDStr := c.Params("cardId")
	cardID, err := strconv.Atoi(cardIDStr)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CARD_ID", "Invalid card ID", nil)
	}

	limitStr := c.Query("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	offsetStr := c.Query("offset", "0")
	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	transactions, err := h.listTransactionsUC.ExecuteByCard(userID, cardID, limit, offset)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "FETCH_TRANSACTIONS_FAILED", "Failed to fetch transactions", nil)
	}

	return response.Success(c, fiber.StatusOK, transactions, "Transactions fetched successfully")
}

func (h *TransactionHandler) ListTransactionsByUser(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	limitStr := c.Query("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	offsetStr := c.Query("offset", "0")
	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	var filters *usecase.TransactionFilters
	dateFromStr := c.Query("date_from")
	dateToStr := c.Query("date_to")
	categoryIDStr := c.Query("category_id")
	kindStr := c.Query("kind")
	searchStr := c.Query("search")
	typeStr := c.Query("type")

	if dateFromStr != "" || dateToStr != "" || categoryIDStr != "" || kindStr != "" || searchStr != "" || typeStr != "" {
		filters = &usecase.TransactionFilters{}
		if dateFromStr != "" {
			if parsed, err := time.Parse(time.RFC3339, dateFromStr); err == nil {
				filters.DateFrom = &parsed
			}
		}
		if dateToStr != "" {
			if parsed, err := time.Parse(time.RFC3339, dateToStr); err == nil {
				filters.DateTo = &parsed
			}
		}
		if categoryIDStr != "" {
			if parsed, err := strconv.Atoi(categoryIDStr); err == nil {
				filters.CategoryID = &parsed
			}
		}
		if kindStr != "" {
			filters.Kind = &kindStr
		}
		if searchStr != "" {
			filters.Search = &searchStr
		}
		if typeStr != "" {
			filters.Type = &typeStr
		}
	}

	// Handle card_uuid
	cardUUID := c.Query("card_uuid")
	if cardUUID != "" {
		// Find card by UUID
		card, err := h.cardRepo.FindByUUID(cardUUID)
		if err != nil || card == nil {
			return response.Error(c, fiber.StatusNotFound, "CARD_NOT_FOUND", "Card not found", nil)
		}
		if card.UserID != userID {
			return response.Error(c, fiber.StatusForbidden, "CARD_DOES_NOT_BELONG_TO_USER", "Card does not belong to user", nil)
		}
		if filters == nil {
			filters = &usecase.TransactionFilters{}
		}
		filters.CardID = &card.ID
	}

	transactions, err := h.listTransactionsUC.ExecuteByUser(userID, limit, offset, filters)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "FETCH_TRANSACTIONS_FAILED", "Failed to fetch transactions", nil)
	}

	return response.Success(c, fiber.StatusOK, transactions, "Transactions fetched successfully")
}

func (h *TransactionHandler) GetTransactionSummaryByCard(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	cardIDStr := c.Params("cardId")
	cardID, err := strconv.Atoi(cardIDStr)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CARD_ID", "Invalid card ID", nil)
	}

	var startDate, endDate *time.Time

	startDateStr := c.Query("start_date")
	if startDateStr != "" {
		if parsed, err := time.Parse(time.RFC3339, startDateStr); err == nil {
			startDate = &parsed
		}
	}

	endDateStr := c.Query("end_date")
	if endDateStr != "" {
		if parsed, err := time.Parse(time.RFC3339, endDateStr); err == nil {
			endDate = &parsed
		}
	}

	summary, err := h.getTransactionSummaryUC.ExecuteByCard(userID, cardID, startDate, endDate)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "FETCH_SUMMARY_FAILED", "Failed to fetch transaction summary", nil)
	}

	return response.Success(c, fiber.StatusOK, summary, "Transaction summary fetched successfully")
}

func (h *TransactionHandler) GetBalanceOverview(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var cardID *int
	if cardUUID := c.Query("card_uuid"); cardUUID != "" {
		if card, err := h.cardRepo.FindByUUID(cardUUID); err == nil && card != nil && card.UserID == userID {
			cardID = &card.ID
		}
	}

	balanceOverview, err := h.getTransactionSummaryUC.ExecuteBalanceOverview(userID, cardID)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "FETCH_BALANCE_FAILED", "Failed to fetch balance overview", nil)
	}

	return response.Success(c, fiber.StatusOK, balanceOverview, "Balance overview fetched successfully")
}
