package response

type ErrorResponse struct {
	Type    string `json:"type"`
	Code    string `json:"code"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

type SuccessResponse struct {
	Type    string      `json:"type"`
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type ValidationErrorsResponse struct {
	Type    string              `json:"type"`
	Code    string              `json:"code"`
	Message string              `json:"message"`
	Errors  []map[string]string `json:"errors"`
}
