package service

import (
	"bytes"
	"html/template"
	"log"
	"strconv"

	gomail "gopkg.in/gomail.v2"

	"zenfy-api/config"
)

type emailServiceImpl struct{}

func NewEmailService() EmailService {
	return &emailServiceImpl{}
}

func (s *emailServiceImpl) SendVerificationEmail(to string, token string) {
	cfg := config.Cfg
	if cfg == nil {
		log.Println("email: config.Cfg is nil, cannot send email")
		return
	}

	verificationURL := cfg.AppBaseURL + "/api/auth/verify?token=" + token

	tmpl, err := template.ParseFiles("interfaces/templates/verification_email.html")
	if err != nil {
		log.Println("email: parse template error:", err)
		return
	}

	data := map[string]interface{}{
		"VerificationURL": verificationURL,
		"AppName":         cfg.SMTPFromName,
		"To":              to,
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		log.Println("email: execute template error:", err)
		return
	}

	m := gomail.NewMessage()
	from := cfg.SMTPFromEmail
	m.SetHeader("From", m.FormatAddress(from, cfg.SMTPFromName))
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Welcome to "+cfg.SMTPFromName)
	m.SetBody("text/html", body.String())

	port, _ := strconv.Atoi(cfg.SMTPPort)
	d := gomail.NewDialer(cfg.SMTPHost, port, cfg.SMTPUser, cfg.SMTPPassword)

	if err := d.DialAndSend(m); err != nil {
		return
	}
}

func (s *emailServiceImpl) SendPasswordResetEmail(to string, token string) {
	cfg := config.Cfg
	if cfg == nil {
		log.Println("email: config.Cfg is nil, cannot send password reset email")
		return
	}

	resetURL := cfg.AppBaseURL + "/api/auth/reset?token=" + token

	tmpl, err := template.ParseFiles("interfaces/templates/password_reset_email.html")
	if err != nil {
		log.Println("email: parse template error:", err)
		return
	}

	data := map[string]interface{}{
		"ResetURL": resetURL,
		"AppName":  cfg.SMTPFromName,
		"To":       to,
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		log.Println("email: execute template error:", err)
		return
	}

	m := gomail.NewMessage()
	from := cfg.SMTPFromEmail
	m.SetHeader("From", m.FormatAddress(from, cfg.SMTPFromName))
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Password reset for "+cfg.SMTPFromName)
	m.SetBody("text/html", body.String())

	port, _ := strconv.Atoi(cfg.SMTPPort)
	d := gomail.NewDialer(cfg.SMTPHost, port, cfg.SMTPUser, cfg.SMTPPassword)

	if err := d.DialAndSend(m); err != nil {
		return
	}
}
