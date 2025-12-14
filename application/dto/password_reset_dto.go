package dto

type RequestPasswordResetRequestDTO struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequestDTO struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=6"`
}
