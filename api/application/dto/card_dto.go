package dto

type AddCardRequest struct {
	LastFour    string `json:"last_four" validate:"required,numeric,len=4"`
	Brand       string `json:"brand" validate:"required,min=2"`
	HolderName  string `json:"holder_name" validate:"required,min=3"`
	Nickname    string `json:"nickname" validate:"omitempty,min=2,max=50"`
	ExpiryMonth int    `json:"expiry_month" validate:"required,min=1,max=12"`
	ExpiryYear  int    `json:"expiry_year" validate:"required,min=2024"`
	CardType    string `json:"card_type" validate:"required,oneof=credit debit"`
	BillingDay  int    `json:"billing_day" validate:"required,min=1,max=31"`
	IsDefault   bool   `json:"is_default"`
}

type CardResponse struct {
	ID          int    `json:"id"`
	LastFour    string `json:"last_four"`
	Brand       string `json:"brand"`
	CardType    string `json:"card_type"`
	HolderName  string `json:"holder_name"`
	Nickname    string `json:"nickname"`
	ExpiryMonth int    `json:"expiry_month"`
	ExpiryYear  int    `json:"expiry_year"`
	BillingDay  int    `json:"billing_day"`
	IsDefault   bool   `json:"is_default"`
	CreatedAt   string `json:"created_at"`
}
