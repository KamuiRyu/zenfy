package usecase

import (
	"zenfy-api/application/dto"
	"zenfy-api/application/service"
)

type GetCardsUseCase struct {
	cardService service.CardService
}

func NewGetCardsUseCase(cardService service.CardService) *GetCardsUseCase {
	return &GetCardsUseCase{
		cardService: cardService,
	}
}

func (uc *GetCardsUseCase) Execute(userID int) ([]dto.CardResponse, error) {
	cards, err := uc.cardService.GetUserCards(userID)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.CardResponse, len(cards))
	for i, card := range cards {
		responses[i] = dto.CardResponse{
			Uuid:        card.Uuid,
			LastFour:    card.LastFour,
			Brand:       card.Brand,
			Bank:        card.Bank,
			CardType:    string(card.CardType),
			HolderName:  card.HolderName,
			Nickname:    card.Nickname,
			ExpiryMonth: card.ExpiryMonth,
			ExpiryYear:  card.ExpiryYear,
			BillingDay:  card.BillingDay,
			IsDefault:   card.IsDefault,
			CreatedAt:   card.CreatedAt,
		}
	}

	return responses, nil
}
