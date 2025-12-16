package model

import "time"

// CardType represents the type of card (credit or debit)
type CardType string

const (
	CardTypeCredit CardType = "credit"
	CardTypeDebit  CardType = "debit"
)

// Card represents a user's payment card
type Card struct {
	ID          int       `json:"id" bun:"id,pk,autoincrement"`
	UserID      int       `json:"user_id" bun:"user_id,notnull"`
	LastFour    string    `json:"last_four" bun:"last_four,notnull"`
	Brand       string    `json:"brand" bun:"brand,notnull"` // visa, mastercard, amex, etc
	Bank        string    `json:"bank" bun:"bank"`
	CardType    CardType  `json:"card_type" bun:"card_type,notnull"`
	HolderName  string    `json:"holder_name" bun:"holder_name,notnull"`
	Nickname    string    `json:"nickname" bun:"nickname"`
	ExpiryMonth int       `json:"expiry_month" bun:"expiry_month,notnull"`
	ExpiryYear  int       `json:"expiry_year" bun:"expiry_year,notnull"`
	BillingDay  int       `json:"billing_day" bun:"billing_day,notnull"`
	IsDefault   bool      `json:"is_default" bun:"is_default,notnull,default:false"`
	CreatedAt   time.Time `json:"created_at" bun:"created_at,notnull,default:current_timestamp"`
	UpdatedAt   time.Time `json:"updated_at" bun:"updated_at,notnull,default:current_timestamp"`
}

// NewCard creates a new card instance
func NewCard(userID int, lastFour, brand string, cardType CardType, holderName, nickname string, expiryMonth, expiryYear, billingDay int, isDefault bool) *Card {
	return &Card{
		UserID:      userID,
		LastFour:    lastFour,
		Brand:       brand,
		Bank:        "",
		CardType:    cardType,
		HolderName:  holderName,
		Nickname:    nickname,
		ExpiryMonth: expiryMonth,
		ExpiryYear:  expiryYear,
		BillingDay:  billingDay,
		IsDefault:   isDefault,
	}
}
