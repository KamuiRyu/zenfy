package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type GetCardUseCase struct {
	cardService service.CardService
}

func NewGetCardUseCase(cardService service.CardService) *GetCardUseCase {
	return &GetCardUseCase{
		cardService: cardService,
	}
}

func (uc *GetCardUseCase) Execute(userID int, cardUUID string) (*dto.CardResponse, error) {
	card, err := uc.cardService.GetCardByUUID(userID, cardUUID)
	if err != nil {
		return nil, err
	}

	return &dto.CardResponse{
		Uuid:        card.Uuid,
		LastFour:    card.LastFour,
		Brand:       card.Brand,
		CardType:    string(card.CardType),
		Bank:        card.Bank,
		HolderName:  card.HolderName,
		Nickname:    card.Nickname,
		ExpiryMonth: card.ExpiryMonth,
		ExpiryYear:  card.ExpiryYear,
		BillingDay:  card.BillingDay,
		IsDefault:   card.IsDefault,
		CreatedAt:   card.CreatedAt,
	}, nil
}
