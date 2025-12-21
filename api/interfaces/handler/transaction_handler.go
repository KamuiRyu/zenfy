package handler

import (
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"zenfy-api/application/dto"
	usecase "zenfy-api/application/usecase/transaction"
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
}

func NewTransactionHandler(
	createTransactionUC *usecase.CreateTransactionUseCase,
	getTransactionUC *usecase.GetTransactionUseCase,
	updateTransactionUC *usecase.UpdateTransactionUseCase,
	deleteTransactionUC *usecase.DeleteTransactionUseCase,
	listTransactionsUC *usecase.ListTransactionsUseCase,
	getTransactionSummaryUC *usecase.GetTransactionSummaryUseCase,
) *TransactionHandler {
	return &TransactionHandler{
		createTransactionUC:     createTransactionUC,
		getTransactionUC:        getTransactionUC,
		updateTransactionUC:     updateTransactionUC,
		deleteTransactionUC:     deleteTransactionUC,
		listTransactionsUC:      listTransactionsUC,
		getTransactionSummaryUC: getTransactionSummaryUC,
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
	transactionID, err := strconv.Atoi(transactionIDStr)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_TRANSACTION_ID", "Invalid transaction ID", nil)
	}

	transaction, err := h.getTransactionUC.Execute(userID, transactionID)
	if err != nil {
		return response.Error(c, fiber.StatusNotFound, "TRANSACTION_NOT_FOUND", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, transaction, "Transaction fetched successfully")
}

func (h *TransactionHandler) UpdateTransaction(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	transactionIDStr := c.Params("id")
	transactionID, err := strconv.Atoi(transactionIDStr)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_TRANSACTION_ID", "Invalid transaction ID", nil)
	}

	var req dto.UpdateTransactionRequest
	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", nil)
	}

	transaction, err := h.updateTransactionUC.Execute(userID, transactionID, req)
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
	transactionID, err := strconv.Atoi(transactionIDStr)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_TRANSACTION_ID", "Invalid transaction ID", nil)
	}

	err = h.deleteTransactionUC.Execute(userID, transactionID)
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

	// Check if card_uuid is provided for filtering
	cardUUID := c.Query("card_uuid")
	if cardUUID != "" {
		// Filter transactions by card UUID
		transactions, err := h.listTransactionsUC.ExecuteByUserAndCard(userID, cardUUID, limit, offset)
		if err != nil {
			return response.Error(c, fiber.StatusInternalServerError, "FETCH_TRANSACTIONS_FAILED", "Failed to fetch transactions", nil)
		}
		return response.Success(c, fiber.StatusOK, transactions, "Transactions fetched successfully")
	}

	transactions, err := h.listTransactionsUC.ExecuteByUser(userID, limit, offset)
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
