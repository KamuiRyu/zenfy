package messages

import (
	"fmt"
	"strings"
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

func GetMessage(defaultMsg string, args ...interface{}) string {
	if len(args) == 0 {
		return defaultMsg
	}

	if strings.Contains(defaultMsg, "%") {
		return fmt.Sprintf(defaultMsg, args...)
	}

	return defaultMsg + ", " + fmt.Sprint(args...)
}
