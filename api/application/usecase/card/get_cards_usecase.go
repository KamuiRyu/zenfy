package usecase

import (
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/domain/repository"
)

type GetCardsUseCase struct {
	cardRepo repository.CardRepository
}

func NewGetCardsUseCase(cardRepo repository.CardRepository) *GetCardsUseCase {
	return &GetCardsUseCase{
		cardRepo: cardRepo,
	}
}

func (uc *GetCardsUseCase) Execute(userID int) ([]dto.CardResponse, error) {
	cards, err := uc.cardRepo.FindByUserID(userID)
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
			CreatedAt:   card.CreatedAt.Format(time.RFC3339),
		}
	}

	return responses, nil
}
