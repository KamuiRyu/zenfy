package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"zenfy-api/application/dto"
	categoryusecase "zenfy-api/application/usecase/category"
	"zenfy-api/interfaces/response"
	resp "zenfy-api/interfaces/response"
	"zenfy-api/interfaces/response/messages"
)

type CategoryHandler struct {
	createCategoryUseCase *categoryusecase.CreateCategoryUseCase
	getCategoriesUseCase  *categoryusecase.GetCategoriesUseCase
	updateCategoryUseCase *categoryusecase.UpdateCategoryUseCase
	deleteCategoryUseCase *categoryusecase.DeleteCategoryUseCase
}

func NewCategoryHandler(
	createCategoryUseCase *categoryusecase.CreateCategoryUseCase,
	getCategoriesUseCase *categoryusecase.GetCategoriesUseCase,
	updateCategoryUseCase *categoryusecase.UpdateCategoryUseCase,
	deleteCategoryUseCase *categoryusecase.DeleteCategoryUseCase,
) *CategoryHandler {
	return &CategoryHandler{
		createCategoryUseCase: createCategoryUseCase,
		getCategoriesUseCase:  getCategoriesUseCase,
		updateCategoryUseCase: updateCategoryUseCase,
		deleteCategoryUseCase: deleteCategoryUseCase,
	}
}

func (h *CategoryHandler) CreateCategory(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	var req dto.CreateCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", nil)
	}

	category, err := h.createCategoryUseCase.Execute(userID, req)
	if err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		if err.Error() == "CATEGORY_ALREADY_EXISTS" {
			return response.Error(c, fiber.StatusConflict, "CATEGORY_ALREADY_EXISTS", "A category with this name already exists", nil)
		}
		return response.Error(c, fiber.StatusInternalServerError, "CREATE_CATEGORY_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusCreated, category, "Category created successfully")
}

func (h *CategoryHandler) GetCategories(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	categories, err := h.getCategoriesUseCase.Execute(userID)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "FETCH_CATEGORIES_FAILED", "Failed to fetch categories", nil)
	}

	return response.Success(c, fiber.StatusOK, categories, "Categories fetched successfully")
}

func (h *CategoryHandler) UpdateCategory(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	categoryUUID := c.Params("uuid")
	if categoryUUID == "" {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CATEGORY_UUID", "Category UUID is required", nil)
	}

	var req dto.UpdateCategoryRequest
	if err := c.BodyParser(&req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_REQUEST", "Invalid request body", nil)
	}

	category, err := h.updateCategoryUseCase.Execute(userID, categoryUUID, req)
	if err != nil {
		if _, ok := err.(validator.ValidationErrors); ok {
			return resp.ValidationErrorResponse(c, fiber.StatusUnprocessableEntity, "VALIDATION_ERROR", messages.ValidationError, err, &req)
		}
		return response.Error(c, fiber.StatusInternalServerError, "UPDATE_CATEGORY_FAILED", err.Error(), nil)
	}

	return response.Success(c, fiber.StatusOK, category, "Category updated successfully")
}

func (h *CategoryHandler) DeleteCategory(c *fiber.Ctx) error {
	userID := c.Locals("userID").(int)

	categoryUUID := c.Params("uuid")
	if categoryUUID == "" {
		return response.Error(c, fiber.StatusBadRequest, "INVALID_CATEGORY_UUID", "Category UUID is required", nil)
	}

	if err := h.deleteCategoryUseCase.Execute(userID, categoryUUID); err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "DELETE_CATEGORY_FAILED", err.Error(), nil)
	}

	return c.SendStatus(fiber.StatusNoContent)
}
