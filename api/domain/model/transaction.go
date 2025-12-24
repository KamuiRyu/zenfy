package model

import (
	"time"

	"github.com/uptrace/bun"
)

// TransactionKind represents the type of transaction (debit or credit)
type TransactionKind string

const (
	TransactionKindDebit  TransactionKind = "debit"
	TransactionKindCredit TransactionKind = "credit"
)

// RecurrenceType represents how often a recurring transaction occurs
type RecurrenceType string

const (
	RecurrenceTypeDaily   RecurrenceType = "daily"
	RecurrenceTypeWeekly  RecurrenceType = "weekly"
	RecurrenceTypeMonthly RecurrenceType = "monthly"
	RecurrenceTypeYearly  RecurrenceType = "yearly"
)

// Transaction represents a financial transaction
type Transaction struct {
	bun.BaseModel `bun:"table:transactions"`
	ID            int                    `json:"id" bun:"id,pk,autoincrement"`
	Uuid          string                 `json:"uuid" bun:"uuid,unique,notnull"`
	CardID        int                    `json:"card_id" bun:"card_id,notnull"`
	UserID        int                    `json:"user_id" bun:"user_id,notnull"`
	CategoryID    int                    `json:"category_id" bun:"category_id,notnull"`
	Amount        int64                  `json:"amount" bun:"amount,notnull"` // cents
	Currency      string                 `json:"currency" bun:"currency,notnull,default:'BRL'"`
	Kind          TransactionKind        `json:"type" bun:"kind,notnull"`
	Merchant      *string                `json:"merchant" bun:"merchant"`
	Description   *string                `json:"description" bun:"description"`
	Metadata      map[string]interface{} `json:"metadata" bun:"metadata,type:jsonb"`
	OccurredAt    time.Time              `json:"occurred_at" bun:"occurred_at,notnull,default:current_timestamp"`
	CreatedAt     time.Time              `json:"created_at" bun:"created_at,notnull,default:current_timestamp"`
	UpdatedAt     time.Time              `json:"updated_at" bun:"updated_at,notnull,default:current_timestamp"`

	// Relations (for joins)
	Category *Category `json:"category,omitempty" bun:"rel:belongs-to,join:category_id=id"`
	Card     *Card     `json:"card,omitempty" bun:"rel:belongs-to,join:card_id=id"`

	// Recurring fields
	IsRecurring         bool            `json:"is_recurring" bun:"is_recurring,notnull,default:false"`
	RecurrenceType      *RecurrenceType `json:"recurrence_type" bun:"recurrence_type"`
	RecurrenceStartDate *time.Time      `json:"recurrence_start_date" bun:"recurrence_start_date"`
	RecurrenceEndDate   *time.Time      `json:"recurrence_end_date" bun:"recurrence_end_date"`

	// Installment fields
	IsInstallment         bool `json:"is_installment" bun:"is_installment,notnull,default:false"`
	InstallmentNumber     *int `json:"installment_number" bun:"installment_number"`
	TotalInstallments     *int `json:"total_installments" bun:"total_installments"`
	OriginalTransactionID *int `json:"original_transaction_id" bun:"original_transaction_id"`
}

// NewTransaction creates a new transaction instance
func NewTransaction(
	userID, cardID, categoryID int,
	uuid string,
	amount int64,
	currency string,
	kind TransactionKind,
	merchant, description *string,
	metadata map[string]interface{},
	occurredAt time.Time,
	isRecurring bool,
	recurrenceType *RecurrenceType,
	recurrenceStartDate *time.Time,
	recurrenceEndDate *time.Time,
	isInstallment bool,
	installmentNumber, totalInstallments *int,
	originalTransactionID *int,
) *Transaction {
	return &Transaction{
		UserID:                userID,
		CardID:                cardID,
		CategoryID:            categoryID,
		Uuid:                  uuid,
		Amount:                amount,
		Currency:              currency,
		Kind:                  kind,
		Merchant:              merchant,
		Description:           description,
		Metadata:              metadata,
		OccurredAt:            occurredAt,
		IsRecurring:           isRecurring,
		RecurrenceType:        recurrenceType,
		RecurrenceStartDate:   recurrenceStartDate,
		RecurrenceEndDate:     recurrenceEndDate,
		IsInstallment:         isInstallment,
		InstallmentNumber:     installmentNumber,
		TotalInstallments:     totalInstallments,
		OriginalTransactionID: originalTransactionID,
	}
}
