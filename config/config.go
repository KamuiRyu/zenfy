package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost           string
	DBPort           string
	DBUser           string
	DBPassword       string
	DBName           string
	GoEnv            string
	AppPort          string
	JWTSecret        string
	AppBaseURL       string
	SMTPHost         string
	SMTPPort         string
	SMTPUser         string
	SMTPPassword     string
	SMTPFromEmail    string
	SMTPFromName     string
	CorsOrigin       string
	CorsMethods      string
	CorsHeaders      string
	LogEnableConsole string
}

var Cfg *Config

func Load(envPath string) (*Config, error) {
	_ = godotenv.Load(envPath)

	cfg := &Config{
		DBHost:        getenvOr("DB_HOST", "db"),
		DBPort:        getenvOr("DB_PORT", "5432"),
		DBUser:        getenvOr("DB_USER", os.Getenv("POSTGRES_USER")),
		DBPassword:    getenvOr("DB_PASSWORD", os.Getenv("POSTGRES_PASSWORD")),
		DBName:        getenvOr("DB_NAME", os.Getenv("POSTGRES_DB")),
		GoEnv:         getenvOr("GO_ENV", "development"),
		AppPort:       getenvOr("PORT", "3000"),
		JWTSecret:     getenvOr("JWT_SECRET", "dev-secret"),
		AppBaseURL:    getenvOr("APP_BASE_URL", "http://localhost:8080"),
		SMTPHost:      getenvOr("SMTP_HOST", ""),
		SMTPPort:      getenvOr("SMTP_PORT", "587"),
		SMTPUser:      getenvOr("SMTP_USER", ""),
		SMTPPassword:  getenvOr("SMTP_PASSWORD", ""),
		SMTPFromEmail: getenvOr("SMTP_FROM_EMAIL", "no-reply@example.com"),
		SMTPFromName:  getenvOr("SMTP_FROM_NAME", "Zenfy"),
		CorsOrigin:    getenvOr("CORS_ORIGIN", "*"),
		CorsMethods: getenvOr("CORS_METHODS",
			"GET,POST,PUT,DELETE,OPTIONS"),
		CorsHeaders: getenvOr("CORS_HEADERS",
			"Origin, Content-Type, Accept, Authorization"),
		LogEnableConsole: getenvOr("LOG_ENABLE_CONSOLE", "true"),
	}

	setIfEmpty("DB_HOST", cfg.DBHost)
	setIfEmpty("DB_PORT", cfg.DBPort)
	setIfEmpty("DB_USER", cfg.DBUser)
	setIfEmpty("DB_PASSWORD", cfg.DBPassword)
	setIfEmpty("DB_NAME", cfg.DBName)
	setIfEmpty("GO_ENV", cfg.GoEnv)
	setIfEmpty("PORT", cfg.AppPort)
	setIfEmpty("JWT_SECRET", cfg.JWTSecret)
	setIfEmpty("APP_BASE_URL", cfg.AppBaseURL)
	setIfEmpty("SMTP_HOST", cfg.SMTPHost)
	setIfEmpty("SMTP_PORT", cfg.SMTPPort)
	setIfEmpty("SMTP_USER", cfg.SMTPUser)
	setIfEmpty("SMTP_PASSWORD", cfg.SMTPPassword)
	setIfEmpty("SMTP_FROM_EMAIL", cfg.SMTPFromEmail)
	setIfEmpty("SMTP_FROM_NAME", cfg.SMTPFromName)
	setIfEmpty("CORS_ORIGIN", cfg.CorsOrigin)
	setIfEmpty("CORS_METHODS", cfg.CorsMethods)
	setIfEmpty("CORS_HEADERS", cfg.CorsHeaders)
	setIfEmpty("LOG_ENABLE_CONSOLE", cfg.LogEnableConsole)

	Cfg = cfg

	return cfg, nil
}

func getenvOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func setIfEmpty(key, val string) {
	if os.Getenv(key) == "" && val != "" {
		_ = os.Setenv(key, val)
	}
}
