package usecase

import (
	"fmt"
	"strconv"
	"time"

	"zenfy-api/application/dto"
	"zenfy-api/domain/repository"
)

type GetCardUseCase struct {
	cardRepo repository.CardRepository
}

func NewGetCardUseCase(cardRepo repository.CardRepository) *GetCardUseCase {
	return &GetCardUseCase{
		cardRepo: cardRepo,
	}
}

func (uc *GetCardUseCase) Execute(userID int, cardUUID string) (*dto.CardResponse, error) {
	card, err := uc.cardRepo.FindByUUID(cardUUID)
	if err != nil {
		// fallback: if client passed numeric ID as string, try FindByID
		if idInt, perr := strconv.Atoi(cardUUID); perr == nil {
			card, err = uc.cardRepo.FindByID(idInt)
		}
		if err != nil {
			return nil, err
		}
	}

	if card.UserID != userID {
		return nil, fmt.Errorf("UNAUTHORIZED_ACTION")
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
		CreatedAt:   card.CreatedAt.Format(time.RFC3339),
	}, nil
}
