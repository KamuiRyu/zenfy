package service

type TokenService interface {
	GenerateVerificationToken(userID int) (string, error)
	GeneratePasswordResetToken(userID int) (string, error)
	GenerateAuthToken(userID int) (string, error)
	ParseToken(token string) (int, error)
}

type ValidationService interface {
	Validate(i interface{}) error
}

type EmailService interface {
	SendVerificationEmail(to string, token string)
	SendPasswordResetEmail(to string, token string)
}
