package dto

import "time"

type CreateTransactionRequest struct {
	CardUUID     string                 `json:"card_uuid" validate:"required"`
	CategoryUUID string                 `json:"category_uuid" validate:"required"`
	Amount       int64                  `json:"amount" validate:"required,min=1"`
	Currency     string                 `json:"currency" validate:"omitempty,len=3"`
	Kind         string                 `json:"kind" validate:"required,oneof=debit credit deposit withdrawal transfer"`
	Merchant     *string                `json:"merchant" validate:"omitempty,max=255"`
	Description  *string                `json:"description" validate:"omitempty,max=1000"`
	Metadata     map[string]interface{} `json:"metadata" validate:"omitempty"`
	OccurredAt   *time.Time             `json:"occurred_at" validate:"omitempty"`

	// Recurring fields
	IsRecurring         bool       `json:"is_recurring"`
	RecurrenceType      *string    `json:"recurrence_type" validate:"omitempty,oneof=daily weekly monthly yearly"`
	RecurrenceStartDate *time.Time `json:"recurrence_start_date" validate:"omitempty"`
	RecurrenceEndDate   *time.Time `json:"recurrence_end_date" validate:"omitempty"`

	// Installment fields
	IsInstallment     bool `json:"is_installment"`
	InstallmentNumber *int `json:"installment_number" validate:"omitempty,min=1"`
	TotalInstallments *int `json:"total_installments" validate:"omitempty,min=1,max=99"`
}

type UpdateTransactionRequest struct {
	CategoryUUID *string                `json:"category_uuid" validate:"omitempty"`
	Amount       *int64                 `json:"amount" validate:"omitempty,min=1"`
	Currency     *string                `json:"currency" validate:"omitempty,len=3"`
	Kind         *string                `json:"kind" validate:"omitempty,oneof=debit credit deposit withdrawal transfer"`
	Merchant     *string                `json:"merchant" validate:"omitempty,max=255"`
	Description  *string                `json:"description" validate:"omitempty,max=1000"`
	Metadata     map[string]interface{} `json:"metadata" validate:"omitempty"`
	OccurredAt   *time.Time             `json:"occurred_at" validate:"omitempty"`

	// Recurring fields
	IsRecurring         *bool      `json:"is_recurring"`
	RecurrenceType      *string    `json:"recurrence_type" validate:"omitempty,oneof=daily weekly monthly yearly"`
	RecurrenceStartDate *time.Time `json:"recurrence_start_date" validate:"omitempty"`
	RecurrenceEndDate   *time.Time `json:"recurrence_end_date" validate:"omitempty"`
}

type TransactionResponse struct {
	Uuid         string                 `json:"uuid"`
	CardUuid     string                 `json:"card_uuid"`
	UserUuid     string                 `json:"user_uuid"`
	CategoryUuid string                 `json:"category_uuid"`
	Category     *CategoryResponse      `json:"category,omitempty"`
	Card         *CardResponse          `json:"card,omitempty"`
	Amount       int64                  `json:"amount"`
	Currency     string                 `json:"currency"`
	Kind         string                 `json:"kind"`
	Merchant     *string                `json:"merchant"`
	Description  *string                `json:"description"`
	Metadata     map[string]interface{} `json:"metadata"`
	OccurredAt   string                 `json:"occurred_at"`
	CreatedAt    string                 `json:"created_at"`
	UpdatedAt    string                 `json:"updated_at"`

	// Recurring fields
	IsRecurring         bool    `json:"is_recurring"`
	RecurrenceType      *string `json:"recurrence_type"`
	RecurrenceStartDate *string `json:"recurrence_start_date"`
	RecurrenceEndDate   *string `json:"recurrence_end_date"`

	// Installment fields
	IsInstallment     bool `json:"is_installment"`
	InstallmentNumber *int `json:"installment_number"`
	TotalInstallments *int `json:"total_installments"`
}

type TransactionSummaryResponse struct {
	CategoryUuid string            `json:"category_uuid"`
	Category     *CategoryResponse `json:"category,omitempty"`
	Total        int64             `json:"total"`
}

type BalanceOverviewResponse struct {
	Balance           int64          `json:"balance"`
	TotalIncome       int64          `json:"total_income"`
	TotalExpense      int64          `json:"total_expense"`
	LastPaymentAmount *int64         `json:"last_payment_amount,omitempty"`
	LastPaymentDate   *string        `json:"last_payment_date,omitempty"`
	MonthlyStats      []MonthlyStats `json:"monthly_stats"`
}

type MonthlyStats struct {
	Month        string `json:"month"`
	Year         int    `json:"year"`
	TotalIncome  int64  `json:"total_income"`
	TotalExpense int64  `json:"total_expense"`
}
