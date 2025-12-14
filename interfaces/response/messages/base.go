package messages

import (
	"fmt"
)

const (
	InternalServerError = "An internal server error occurred."
	BadRequestError     = "The request was invalid."
	UnauthorizedError   = "Unauthorized access."
	NotFoundError       = "The requested resource was not found."
	ConflictError       = "A conflict occurred with the current state of the resource."
	ValidationError     = "There were validation errors with the request."
	Success             = "The request was successful."
	InvalidPayload      = "Invalid request payload."
)

func GetMessage(defaultMsg string, field string, params ...interface{}) string {
	message := defaultMsg
	return fmt.Sprintf(message, append([]interface{}{field}, params...)...)
}
