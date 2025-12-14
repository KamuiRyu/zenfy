package dto

type ResendVerificationRequestDTO struct {
	Email string `json:"email" validate:"required,email"`
}
