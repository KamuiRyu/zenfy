package response

import (
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"zenfy-api/interfaces/response/messages"
)

func Error(c *fiber.Ctx, status int, code string, message string, err error) error {
	errorMsg := ""
	if err != nil {
		errorMsg = err.Error()
	}

	resp := ErrorResponse{
		Type:    "error",
		Code:    code,
		Message: message,
		Error:   errorMsg,
	}
	return c.Status(status).JSON(resp)
}

func Success(c *fiber.Ctx, status int, code string, message string, data interface{}) error {
	resp := SuccessResponse{
		Type:    "success",
		Code:    code,
		Message: message,
		Data:    data,
	}
	return c.Status(status).JSON(resp)
}

func ValidationErrorResponse(c *fiber.Ctx, status int, code string, message string, err error, obj interface{}) error {
	validationErrors := make([]map[string]string, 0)
	if ve, ok := err.(validator.ValidationErrors); ok {
		var typ reflect.Type
		if obj != nil {
			typ = reflect.TypeOf(obj)
			if typ.Kind() == reflect.Ptr {
				typ = typ.Elem()
			}
		}

		for _, e := range ve {
			structField := e.Field()
			jsonField := structField
			if typ != nil {
				if f, found := typ.FieldByName(structField); found {
					tag := f.Tag.Get("json")
					if tag != "" {
						name := strings.Split(tag, ",")[0]
						if name != "" && name != "-" {
							jsonField = name
						}
					}
				}
			}

			msg := GetValidationMessage(c, e.Tag(), jsonField, e.Param(), e.Error())
			validationErrors = append(validationErrors, map[string]string{
				"field":   jsonField,
				"message": msg,
			})
		}
		resp := ValidationErrorsResponse{
			Type:    "error",
			Code:    code,
			Message: message,
			Errors:  validationErrors,
		}
		return c.Status(status).JSON(resp)
	}
	return Error(c, status, code, message, err)
}

func GetValidationMessage(c *fiber.Ctx, tag, field, param, errMsg string) string {
	var msg string
	switch tag {
	case "required":
		msg = messages.GetMessage(messages.RequiredField, field)
	case "min":
		msg = messages.GetMessage(messages.MinLength, field, param)
	case "max":
		msg = messages.GetMessage(messages.MaxLength, field, param)
	case "email":
		msg = messages.GetMessage(messages.EmailFormat, field)
	case "url":
		msg = messages.GetMessage(messages.URLFormat, field)
	case "uuid":
		msg = messages.GetMessage(messages.UUIDFormat, field)
	case "numeric":
		msg = messages.GetMessage(messages.NumericFormat, field)
	case "boolean":
		msg = messages.GetMessage(messages.BooleanFormat, field)
	default:
		msg = errMsg
	}

	return msg
}
