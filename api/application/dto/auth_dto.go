package dto

type LoginRequestDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type LoginResponseDTO struct {
	Uuid      string    `json:"uuid"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	AvatarUrl string    `json:"avatar_url"`
	TokenData TokenData `json:"token_data"`
}

type TokenData struct {
	Token     string `json:"token"`
	Refresh   string `json:"refresh"`
	ExpiresAt int64  `json:"expires_at"`
}
