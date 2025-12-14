package messages

const (
	// Success messages
	LoginSuccessful         = "Login successful"
	LogoutSuccessful        = "Logout successful"
	RegisterSuccessful      = "Registration successful"
	TokenRefreshed          = "Token refreshed successfully"
	PasswordResetSent       = "Password reset email sent"
	PasswordResetSuccess    = "Password reset successful"
	EmailVerified           = "Email verified successfully"
	VerificationEmailSent   = "Verification email sent"
	EmailAlreadyVerified    = "Email already verified"
	PasswordResetSuccessful = "Password has been reset successfully"
	PasswordResetEmailSent  = "Password reset email has been sent if the email exists in our system"
	UserFound               = "User retrieved successfully"
	TokenValid              = "Token is valid"

	// Error messages
	InvalidCredentials    = "Invalid credentials"
	UserNotFound          = "User not found"
	InvalidToken          = "Invalid or expired token"
	Unauthorized          = "Unauthorized"
	SessionExpired        = "Session expired"
	InvalidEmail          = "Invalid email"
	WeakPassword          = "Password too weak"
	PasswordMismatch      = "Passwords do not match"
	EmailNotVerified      = "Email not verified"
	AccountLocked         = "Account locked"
	InvalidRefreshToken   = "Invalid refresh token"
	TokenRequired         = "Token is required"
	InvalidOrExpiredToken = "The provided token is invalid or has expired"
)
