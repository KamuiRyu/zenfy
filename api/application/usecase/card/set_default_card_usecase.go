package usecase

import (
	"fmt"

	"zenfy-api/domain/repository"
)

type SetDefaultCardUseCase struct {
	cardRepo repository.CardRepository
}

func NewSetDefaultCardUseCase(cardRepo repository.CardRepository) *SetDefaultCardUseCase {
	return &SetDefaultCardUseCase{
		cardRepo: cardRepo,
	}
}

func (uc *SetDefaultCardUseCase) Execute(userID, cardID int) error {
	card, err := uc.cardRepo.FindByID(cardID)
	if err != nil {
		return err
	}

	if card.UserID != userID {
		return fmt.Errorf("UNAUTHORIZED_ACTION")
	}

	return uc.cardRepo.SetDefault(userID, cardID)
}
